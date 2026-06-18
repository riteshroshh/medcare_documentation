window.PAGES = window.PAGES || {};
window.PAGES['medcare_ai_system_architecture_manifesto'] = () => `
# MedCare AI: System Architecture Manifesto

## 1. Architectural Philosophy

At its core, a medical documentation system is an information retrieval, generation, and validation engine operating under strict constraints of accuracy, latency, and regulatory compliance. MedCare AI does not simply act as a passive scribe; it is an active cognitive partner. Our architecture treats clinical workflows as directed acyclic graphs (DAGs) of data transformation, where unstructured human inputs are meticulously mapped into high-dimensional, structured semantic spaces, evaluated against deterministic regulatory rulesets (CMS), and projected back into natural language representations (Clinical Notes).

To achieve this, we adopt a decoupled, microservices-oriented architecture separating I/O-bound state management from compute-intensive NLP inference.

## 2. High-Level System Architecture

### 2.1 Component Topology
- **API Gateway & Core Business Logic (Node.js/TypeScript)**: Handles authentication, state management, routing, and CRUD operations. Provides a low-latency, highly concurrent event loop capable of streaming responses to the client.
- **NLP Inference Engine (Python/PyTorch/FastAPI)**: A dedicated cluster for transformer-based inference. Exposes internal gRPC/REST endpoints for tasks like Named Entity Recognition (NER), generation, and compliance classification.
- **Databases**:
  - **PostgreSQL**: The absolute source of truth. Handles structured patient data, user state, and audit logs.
  - **Redis**: Ephemeral cache for session state and rate limiting.
  - **Vector Store (pgvector)**: Maintains embeddings of clinical guidelines, ICD-10/CPT code descriptions, and historical notes for Retrieval-Augmented Generation (RAG).

## 3. Structured Data Input Schemas

Clinical state is maintained via strict, strongly-typed JSON schemas. This enforces deterministic behavior before data ever reaches the stochastic NLP models.

\`\`\`typescript
interface ClinicalEncounter {
  encounterId: string;
  patientId: string;
  timestamp: string;
  vitals: {
    bloodPressure: { systolic: number; diastolic: number };
    heartRate: number;
    temperature: number; // Celsius
    o2Saturation: number;
  };
  chiefComplaint: string[];
  historyOfPresentIllness: {
    onset: string;
    duration: string;
    severity: string;
    context: string;
    modifyingFactors: string[];
    associatedSymptoms: string[];
  };
  reviewOfSystems: Record<SystemType, SystemReview>;
  medications: Medication[];
  labs: LabResult[];
  diagnoses: Diagnosis[];
  assessmentAndPlan: AssessmentPlanEntry[];
}
\`\`\`

## 4. API Endpoints

The interface layer operates strictly over HTTPS with robust payload validation.

- \`POST /api/v1/encounter/stream-audio\` -> Streams raw clinician audio, returning structured dictation tokens via WebSockets.
- \`POST /api/v1/notes/generate\` -> Accepts a \`ClinicalEncounter\` payload and asynchronously yields a synthesized Markdown clinical note (Progress, H&P, etc.).
- \`POST /api/v1/compliance/evaluate\` -> Accepts an encounter or draft note, evaluates it against the CMS compliance engine, and returns missing elements and a computed E/M level.
- \`POST /api/v1/coding/suggest\` -> RAG-based endpoint taking clinical text embeddings to query pgvector, returning a ranked list of relevant ICD-10 and CPT/HCPCS codes with confidence intervals.

## 5. NLP Pipeline: Generation & Structuring

The NLP stack utilizes a cascade of specialized models rather than a single monolithic LLM, optimizing for latency and domain specificity.

1. **Information Extraction (Clinical-BioBERT)**: Extracts entities (symptoms, drugs, anatomy) from raw text/transcripts.
2. **Contextual Grounding (RAG)**: Injects retrieved, relevant medical guidelines (e.g., standard of care for hypertension) into the context window.
3. **Generation (Domain-Adapted LLM)**: Synthesizes the narrative clinical note. It maps structured inputs into standard formats (SOAP, H&P) using constrained decoding to prevent hallucination.
4. **Validation (Cross-Encoder)**: A lightweight validation model scores the logical entailment between the generated note and the initial structured inputs. If entailment drops below \$\\tau = 0.95\$, the generation is flagged or retried.

## 6. Audit-Readiness & Compliance Scoring Formulas

To calculate the Evaluation and Management (E/M) level and ensure CMS compliance, we compute a deterministic Medical Decision Making (MDM) score. This algorithm bridges clinical NLP with strict heuristics.

**MDM Component Computation:**

1. **Number and Complexity of Problems Addressed (\$P\$)**:
   - Minor problem: 1 point
   - Established problem, stable: 1 point
   - Established problem, worsening: 2 points
   - New problem, no extra workup: 3 points
   - New problem, additional workup: 4 points
   *Score Matrix*: \$P_{level} = \\min(\\sum p_i, 4)\$

2. **Amount and/or Complexity of Data to be Reviewed and Analyzed (\$D\$)**:
   - Order/Review of each unique test (Lab/Image): 1 point
   - Independent interpretation of test: 2 points
   - Discussion of management with external physician: 2 points
   *Score Matrix*: \$D_{level} = \\text{Threshold}(D_{total})\$

3. **Risk of Complications and/or Morbidity or Mortality (\$R\$)**:
   - Calculated via NLP extraction of treatment plans (e.g., "prescription drug management" \$\\rightarrow\$ Moderate Risk; "elective major surgery" \$\\rightarrow\$ High Risk).
   - \$R_{level} \\in \\{\\text{Minimal}, \\text{Low}, \\text{Moderate}, \\text{High}\\}\$

**Final Audit-Readiness Vector**:
The final E/M Level (\$L_{EM}\$) is determined by taking the median (or requiring two of the three elements to meet the threshold) of the vectors:
\$\$L_{EM} = f_{EM}(P_{level}, D_{level}, R_{level})\$\$

If \$L_{EM}\$ projected does not match the billed \$L_{EM}\$ target, the API responds with a specific \`ComplianceGap\` array (e.g., "Missing documented independent review of Lab results to support Level 4 MDM").

## Conclusion

This architecture embraces the messy, high-entropy nature of clinical encounters and systematically refines it into low-entropy, highly structured, and rigorously validated artifacts. By partitioning stochastic generation from deterministic regulatory evaluation, MedCare AI guarantees both the fluidity required by physicians and the absolute precision demanded by auditors.
</SYSTEM_MESSAGE>
`;
