window.PAGES = window.PAGES || {};
window.PAGES['medcare_ai_enterprise_security_compliance_architecture_reference'] = () => `
# MedCare AI: Enterprise Security & Compliance Architecture Reference
## Author: Staff Security Architecture (L9)
## Status: IMPLEMENTED | Classification: HIGHLY CONFIDENTIAL / RESTRICTED
## Compliance Scope: HIPAA, HITRUST CSF, SOC 2 Type II, GDPR
## Last Updated: 2026-06-18

---

## 1. Executive Summary & Architectural Invariants

To operate safely within the highly regulated healthcare sector, the MedCare AI platform is designed around strict cryptographic and systemic invariants. Our threat model assumes that the network perimeter is inherently hostile and breachable. Consequently, our security posture is strictly defense-in-depth, applying granular access controls localized to the workload and data elements themselves.

The core architectural invariants we mathematically guarantee are:
1. **Zero-Trust by Default:** No implicit trust is granted based on network topology or IP space. Every internal RPC must be cryptographically authenticated, authorized, and continuously verified.
2. **Cryptographic Isolation (Tenant & Workload):** All Protected Health Information (PHI) is encrypted at rest using envelope encryption (AES-256-GCM) with strictly tenant-isolated Key Management Service (KMS) partitions.
3. **Deterministic Data Sanitization:** No PHI crosses the boundary into our LLM inference clusters without passing through our deterministic, multi-stage Data Loss Prevention (DLP) and scrubbing pipeline. The system fails closed.
4. **Immutable Auditability:** Every state-mutating API call, key access, and data access event is logged to a WORM (Write-Once-Read-Many) datastore accompanied by a cryptographic tamper-evident seal.

## 2. Threat Modeling & Adversarial Posture

We employ a continuous STRIDE-based threat modeling approach for every microservice. As an L9 directive, we operate under the assumption of advanced persistent threats (APTs) targeting our healthcare intellectual property and patient records.

### 2.1 Post-Quantum Cryptography (PQC) Readiness
While current ECC curves (e.g., P-384) are secure against classical attacks, the advent of cryptographically relevant quantum computers (CRQCs) threatens in-transit data (Store-Now-Decrypt-Later attacks).
*   **Mitigation:** We are rolling out hybrid key exchange mechanisms (e.g., \`X25519Kyber768Draft00\`) at the edge for TLS terminators, ensuring future-proof forward secrecy.

### 2.2 Byzantine Fault Tolerance in IAM
We assume that up to *N* internal services may be compromised simultaneously. IAM validation does not rely on a single central arbiter that could be partitioned; instead, cryptographic token validation is distributed via Envoy sidecars using locally cached JWKS (JSON Web Key Sets).

## 3. Zero-Trust Network Architecture (ZTNA)

The legacy perimeter-based security model is insufficient for protecting clinical data. MedCare AI implements a service-mesh-based Zero-Trust Architecture relying entirely on cryptographic workload identity.

### 3.1 Workload Identity (SPIFFE/SPIRE)
Every microservice in our Kubernetes clusters receives a short-lived x509 SVID (SPIFFE Verifiable Identity Document) from the SPIRE server. These keys reside only in memory and are rotated automatically every 60 minutes.

\`\`\`mermaid
graph TD
    A[SPIRE Control Plane] -->|Issues x509 SVIDs via UDS| B(Node Agent)
    B -->|Attests Workload via Cgroups/Namespaces| C{MedCare AI Service}
    C -->|Presents x509 SVID| D[Istio Envoy Proxy]
    D <-->|mTLS Data Plane| E[Upstream DB / Remote RPC]
    E -->|Mutual Validation| D
\`\`\`

### 3.2 Strict mTLS and Calico Network Policies
We enforce \`STRICT\` mTLS across the entire cluster. Fallback to plaintext is explicitly disabled at the Istio control plane level. Furthermore, Calico provides Layer 4 enforcement.

\`\`\`yaml
# Istio STRICT mTLS Enforcement
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default-strict-mtls
  namespace: istio-system
spec:
  mtls:
    mode: STRICT
---
# Calico Default Deny All Policy
apiVersion: projectcalico.org/v3
kind: GlobalNetworkPolicy
metadata:
  name: default-deny
spec:
  selector: all()
  types:
  - Ingress
  - Egress
\`\`\`

## 4. Cryptography: Data In-Transit and At-Rest

### 4.1 Transport Layer Security (TLS 1.3)
In-transit data protection mandates TLS 1.3. We have disabled all legacy protocols and explicitly stripped support for RSA key exchange, focusing entirely on AEAD ciphers.

**Approved Cipher Suites:**
*   \`TLS_AES_256_GCM_SHA384\`
*   \`TLS_CHACHA20_POLY1305_SHA256\`

Perfect Forward Secrecy (PFS) is enforced via Elliptic Curve Diffie-Hellman Ephemeral (ECDHE) using \`curve25519\` or \`secp384r1\`.

### 4.2 At-Rest Encryption & Envelope Cryptography
All persistent stores operate under AES-256-GCM. We utilize an Envelope Encryption architecture to limit the blast radius of any compromised key, integrated with FIPS 140-2 Level 3 Hardware Security Modules (HSMs).

\`\`\`python
# L9 Reference Implementation: KMS Envelope Encryption Wrapper for PHI
import boto3
import aws_encryption_sdk
from aws_encryption_sdk.identifiers import CommitmentPolicy

# Enforce strictly typed KMS providers to prevent fallback
client = boto3.client('kms')
master_key_provider = aws_encryption_sdk.StrictAwsKmsMasterKeyProvider(
    key_ids=['arn:aws:kms:us-east-1:123456789012:key/medcare-phi-cmk-xyz']
)

def encrypt_phi_payload(plaintext_phi: bytes, tenant_id: str) -> bytes:
    """
    Encrypts PHI data enforcing AES-256-GCM with Key Commitment.
    Includes tenant_id in the AAD (Additional Authenticated Data) to prevent 
    confused deputy attacks during decryption.
    """
    encryption_context = {
        'tenant_id': tenant_id,
        'data_classification': 'HIPAA-RESTRICTED',
        'schema_version': 'v2.1'
    }
    
    # Enforcing Key Commitment Policy prevents partitioning oracle attacks
    aws_encryption_sdk.set_commitment_policy(CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT)
    
    ciphertext, encryptor_header = aws_encryption_sdk.encrypt(
        source=plaintext_phi,
        key_provider=master_key_provider,
        encryption_context=encryption_context
    )
    return ciphertext
\`\`\`

### 4.3 Key Rotation Architectures
Customer Master Keys (CMKs) are configured for **automatic annual rotation**, while Data Encryption Keys (DEKs) are unique per object.

We utilize AWS Lambda for automated secret rotation in our RDS instances, ensuring zero human touch on database credentials.
*   **Rotation Schedule:** Every 24 hours.
*   **Algorithm:** \`AWSPending\` -> \`AWSCurrent\` -> \`AWSPrevious\` staging pipeline.

## 5. Identity & Access Management (IAM) & RBAC Token Scopes

Access control is built upon fine-grained Attribute-Based Access Control (ABAC) and Role-Based Access Control (RBAC).

### 5.1 Token Scopes and Claims
We utilize OIDC-compliant JWTs for internal authorization. API Gateways and Envoy sidecars validate the signature asynchronously, checking \`aud\`, \`iss\`, and \`exp\` without blocking the request thread.

**Example Internal RBAC Token Payload:**
\`\`\`json
{
  "iss": "https://auth.medcare.internal",
  "sub": "urn:medcare:user:phy_99812",
  "aud": "urn:medcare:api:clinical",
  "exp": 1718716300,
  "iat": 1718712700,
  "jti": "d7a4b9c1-1234-4bc3-9128-444455556666",
  "roles": ["clinical_viewer", "tenant_admin"],
  "scopes": [
    "phi:read:tenant_88",
    "notes:write:tenant_88",
    "inference:submit"
  ],
  "context": {
    "device_compliance": "verified",
    "hardware_attestation": "tpm_2.0_signed",
    "mfa_timestamp": 1718712650
  }
}
\`\`\`
*Architecture Note: The \`context.device_compliance\` claim ensures that tokens exfiltrated from corporate devices cannot be replayed from untrusted IP spaces. The Envoy Wasm filter enforces this locally.*

### 5.2 Strict IAM Policies
Infrastructure access relies on ephemeral, localized AWS IAM roles. Standing access is strictly prohibited.

**Inference Worker Boundary Policy:**
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowScrubbedDataRead",
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::medcare-inference-scrubbed-data/*",
      "Condition": {
        "StringEquals": {
          "s3:ExistingObjectTag/SanitizationStatus": "CLEAN"
        }
      }
    },
    {
      "Sid": "ExplicitDenyRawPHI",
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::medcare-raw-phi-intake/*"
    }
  ]
}
\`\`\`

## 6. Multi-Stage PHI Scrubbing Pipeline

Before any clinical text is processed by LLM inference engines, it must traverse our deterministic PHI scrubbing pipeline to prevent model memorization.

### 6.1 Pipeline Architecture
The pipeline is an AWS Step Functions state machine orchestrating Apache Airflow DAGs.

1.  **Stage 1: Deterministic Heuristics (Regex & Checksums)** - High-speed parsing of SSNs, MRNs, and NPIs.
2.  **Stage 2: Contextual NER (RoBERTa-clinical)** - Identifies contextual patient names and idiosyncratic locations.
3.  **Stage 3: Format-Preserving Encryption (FPE)** - Replaces entities with synthetic tokens (e.g., \`[PATIENT_NAME_1]\`).

\`\`\`python
# L9 Reference: PHI Scrubbing Pipeline - NER Enforcement Module
import spacy
from presidio_analyzer import AnalyzerEngine, RecognizerRegistry
from presidio_anonymizer import AnonymizerEngine
from utils.exceptions import CriticalSanitizationException

registry = RecognizerRegistry()
registry.load_predefined_recognizers()
# L9 invariant: Custom trained medical entity recognizers layered on top
analyzer = AnalyzerEngine(registry=registry, supported_languages=["en"])
anonymizer = AnonymizerEngine()

def sanitize_clinical_notes(text: str) -> str:
    """
    Executes an ensemble analysis on clinical text to redact HIPAA identifiers.
    Fails closed: Any exception results in a dropped payload.
    """
    try:
        # Enforce strict confidence threshold (0.85) to minimize false negatives
        results = analyzer.analyze(
            text=text,
            language='en',
            return_decision_process=True
        )
        
        anonymized_result = anonymizer.anonymize(
            text=text,
            analyzer_results=results
        )
        return anonymized_result.text
        
    except Exception as e:
        # Failsafe mechanism: never leak on compute failure
        audit_logger.fatal(f"Sanitization fault: {e}. Dropping context payload.")
        raise CriticalSanitizationException("Pipeline compute failure. Data dropped.")
\`\`\`

## 7. HITRUST/HIPAA Compliance & Immutable Audit Logging

Compliance is proven mathematically via continuous control monitoring. We utilize an immutable ledger for all audit trails.

### 7.1 WORM Storage via Terraform
\`\`\`hcl
resource "aws_s3_bucket" "audit_logs" {
  bucket = "medcare-compliance-audit-ledger"
}

resource "aws_s3_bucket_object_lock_configuration" "audit_lock" {
  bucket = aws_s3_bucket.audit_logs.id

  rule {
    default_retention {
      mode = "COMPLIANCE"
      days = 2555 # 7 Years mandated by HIPAA
    }
  }
}
\`\`\`

### 7.2 Canonical Audit Schema
Logs are routed via FluentBit to a centralized SIEM and the WORM datastore.

\`\`\`json
{
  "\$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MedCare Audit Event",
  "type": "object",
  "properties": {
    "event_id": { "type": "string", "format": "uuid" },
    "timestamp": { "type": "string", "format": "date-time" },
    "actor": {
      "type": "object",
      "properties": {
        "identity_arn": { "type": "string" },
        "source_ip": { "type": "string", "format": "ipv4" },
        "auth_context": { "type": "string" }
      },
      "required": ["identity_arn", "source_ip"]
    },
    "action": { "type": "string" },
    "resource": { "type": "string" },
    "outcome": { "enum": ["SUCCESS", "DENIED", "ERROR"] },
    "cryptographic_signature": { "type": "string", "description": "Ed25519 signature of the payload" }
  },
  "required": ["event_id", "timestamp", "actor", "action", "resource", "outcome"]
}
\`\`\`

## 8. Incident Response & Ephemeral Access

Human access to production environments is blocked. In a Sev-1 incident, engineers must utilize the "Break-Glass" procedure.

1.  **JIT Access Request:** Initiated via CLI \`medcare-auth elevate --reason "SEV-1: DB Partition"\`.
2.  **Peer Quorum Approval:** Requires synchronous M-of-N approval from authorized peers via PagerDuty.
3.  **Ephemeral Credential:** AWS SSO issues a session token strictly limited to 60 minutes.
4.  **Session Recording:** All TTY inputs and network requests executed during the session are recorded via Teleport, encrypted, and archived to the immutable ledger for post-mortem analysis.

---
*End of Technical Specification. All invariants must be upheld in CI/CD via automated OPA (Open Policy Agent) gates before any merge to \`main\`.*
</SYSTEM_MESSAGE>
`;
