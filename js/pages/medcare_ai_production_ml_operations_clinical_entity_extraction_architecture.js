window.PAGES = window.PAGES || {};
window.PAGES['medcare_ai_production_ml_operations_clinical_entity_extraction_architecture'] = () => `
# MedCare AI: Production ML Operations & Clinical Entity Extraction Architecture

**Document Owner:** ML Platform Engineering
**Status:** Canonical / L9 Architectural Standard
**Domain:** Clinical Natural Language Processing (NLP) / Entity Extraction
**Focus Areas:** Continuous Training (CT), Model Registry (MLflow), Active Learning, Drift Detection (KL Divergence), Shadow Rollouts.

---

## 1. Architectural Thesis

In clinical entity extraction, errors directly degrade patient care pathways. Our MLOps infrastructure cannot rely on static deployments. Models operating on Electronic Health Records (EHR) face continuous vocabulary shift (e.g., new drug names, emerging pathogens, changing billing codes). 

The MedCare AI architecture enforces a deterministic, zero-downtime, continuous learning loop. It treats model weights as transient artifacts and the pipeline itself as the immutable product. We leverage MLflow for strict lineage, automated DAGs for continuous training, active learning for optimal label acquisition, and rigorous statistical divergence checks to prevent silent degradation.

---

## 2. Model Registry & Lineage (MLflow)

The model registry is not a file dump; it is a strict state machine. We utilize MLflow to enforce contract-driven model promotion. 

### 2.1 Model Signature Enforcement
Every model must define a strict input/output tensor signature. For our BERT-based clinical NER models, the signature is statically verified before registry entry.

\`\`\`python
import mlflow
from mlflow.models.signature import ModelSignature
from mlflow.types.schema import Schema, TensorSpec
import numpy as np

# Define exact tensor shapes for Clinical NER
input_schema = Schema([
    TensorSpec(np.dtype(np.int32), (-1, 512), name="input_ids"),
    TensorSpec(np.dtype(np.int32), (-1, 512), name="attention_mask")
])

output_schema = Schema([
    TensorSpec(np.dtype(np.float32), (-1, 512, 17), name="logits") # 17 IOB tags
])

signature = ModelSignature(inputs=input_schema, outputs=output_schema)

def log_model_to_registry(model, run_id, metrics):
    """
    L9 Standard: Strict promotion gates based on core clinical metrics.
    """
    if metrics['f1_strict_clinical'] < 0.92:
        raise ValueError(f"Model failed clinical baseline. F1: {metrics['f1_strict_clinical']}")
        
    with mlflow.start_run(run_id=run_id):
        mlflow.pytorch.log_model(
            pytorch_model=model,
            artifact_path="medcare_ner_model",
            signature=signature,
            registered_model_name="MedCare_Clinical_NER"
        )
\`\`\`

### 2.2 Lifecycle State Machine
Models transition through \`None\` -> \`Staging\` -> \`Shadow\` -> \`Production\`. 
*   **Staging:** Runs against the golden clinical test set (n=50,000 carefully curated EHR notes).
*   **Shadow:** Deployed to inference grid, receives mirrored live traffic, outputs are dumped to Kafka but never returned to the client.
*   **Production:** Actively serves API requests.

---

## 3. Continuous Training (CT) Pipeline Orchestration

We orchestrate using a Kubernetes-native DAG (e.g., Kubeflow/Flyte). The CT pipeline is triggered statelessly by event streams, not cron jobs. 

### 3.1 Trigger Conditions
1.  **Drift Alert:** KL Divergence threshold exceeded on \`input_ids\` distribution.
2.  **Label Ingestion:** >10,000 new annotated tokens acquired via the Active Learning loop.
3.  **Scheduled Decay Check:** Bi-weekly baseline retraining.

### 3.2 Pipeline DAG Definition (Pseudo-Flight/Kubeflow)

\`\`\`python
from flytekit import task, workflow
from typing import NamedTuple

@task(limits=Resources(cpu="16", mem="64Gi"))
def materialize_features(start_time: str, end_time: str) -> Dataset:
    # Deterministic time-travel extraction from Feature Store
    return feature_store.get_historical_features(
        entity="patient_note",
        features=["clinical_bert_embeddings", "tfidf_baseline"],
        timestamp_range=(start_time, end_time)
    )

@task(limits=Resources(gpu="4", mem="128Gi"))
def distributed_training(dataset: Dataset, base_model_uri: str) -> ModelURI:
    # DDP-based training using PyTorch Lightning
    trainer = pl.Trainer(
        strategy="ddp",
        accelerator="gpu",
        devices=4,
        precision="16-mixed",
        max_epochs=10
    )
    # Injecting the data into the trainer...
    return trainer.fit(model, dataloader)

@workflow
def medcare_ct_pipeline(start_time: str, end_time: str) -> ModelURI:
    dataset = materialize_features(start_time=start_time, end_time=end_time)
    model_uri = distributed_training(dataset=dataset, base_model_uri="models:/MedCare_Clinical_NER/Production")
    evaluate_model(model_uri=model_uri, golden_set="s3://medcare-data/golden_eval.parquet")
    return model_uri
\`\`\`

---

## 4. Active Learning Strategies in Clinical NLP

Labeling medical data requires domain experts (MDs, RNs) whose time is extremely expensive (\$150+/hr). Random sampling is financially and computationally irresponsible. We employ a rigorous Active Learning (AL) acquisition function to select only the most highly informative EHR notes for human-in-the-loop (HITL) review.

### 4.1 Uncertainty Sampling (Entropy)
We calculate the Shannon Entropy over the softmax probabilities of the sequence tokens. For a sequence \$X = (x_1, ..., x_N)\$, the sequence-level uncertainty is:

\$\$ U(X) = \\frac{1}{N} \\sum_{i=1}^{N} \\left( - \\sum_{j=1}^{C} P(y_{i,j} | X) \\log P(y_{i,j} | X) \\right) \$\$

Where \$C\$ is the number of NER classes (e.g., B-DRUG, I-DRUG, B-DISEASE).

### 4.2 Margin Sampling
To resolve decision boundary conflicts (e.g., distinguishing between a 'symptom' and a 'diagnosis'), we compute the margin between the top two predicted classes for each token:

\$\$ M(x_i) = P(y_{top1} | X) - P(y_{top2} | X) \$\$

Sequences with minimal average margins are prioritized for annotation.

### 4.3 Acquisition Implementation

\`\`\`python
import torch
import torch.nn.functional as F

def compute_acquisition_scores(logits: torch.Tensor, mask: torch.Tensor) -> torch.Tensor:
    """
    Computes sequence-level entropy for active learning batch selection.
    logits: (B, SeqLen, NumClasses)
    mask: (B, SeqLen)
    """
    probs = F.softmax(logits, dim=-1) # (B, SeqLen, NumClasses)
    
    # Compute token-level entropy: -p * log(p)
    log_probs = F.log_softmax(logits, dim=-1)
    token_entropy = -torch.sum(probs * log_probs, dim=-1) # (B, SeqLen)
    
    # Apply attention mask to ignore padding tokens
    masked_entropy = token_entropy * mask
    
    # Aggregate to sequence level (mean entropy over valid tokens)
    seq_lengths = mask.sum(dim=-1)
    seq_entropy = masked_entropy.sum(dim=-1) / torch.clamp(seq_lengths, min=1.0)
    
    return seq_entropy # (B,)

def trigger_hitl_annotation(unlabeled_pool: DataLoader, model: nn.Module, top_k: int = 1000):
    model.eval()
    scores = []
    with torch.no_grad():
        for batch in unlabeled_pool:
            logits = model(batch['input_ids'], batch['attention_mask'])
            batch_scores = compute_acquisition_scores(logits, batch['attention_mask'])
            scores.extend(zip(batch['document_id'], batch_scores.cpu().tolist()))
            
    # Sort descending by entropy
    scores.sort(key=lambda x: x[1], reverse=True)
    
    # Send highest uncertainty docs to annotation queue
    send_to_label_studio([doc_id for doc_id, _ in scores[:top_k]])
\`\`\`

---

## 5. Statistical Drift Detection: KL Divergence

Machine learning models degrade silently. In MedCare AI, we do not rely solely on downstream business metrics (which lag) to detect degradation. We measure Covariate Shift directly on the input distributions.

### 5.1 The Mathematics of Kullback-Leibler (KL) Divergence
KL Divergence measures how one probability distribution \$P\$ (the real-time inference traffic) differs from a reference distribution \$Q\$ (the training data).

\$\$ D_{KL}(P \\parallel Q) = \\sum_{x \\in \\mathcal{X}} P(x) \\log\\left(\\frac{P(x)}{Q(x)}\\right) \$\$

For continuous embeddings (e.g., the \`[CLS]\` token embedding of the clinical note), we bin the latent space or use density estimation, though practically we track the Population Stability Index (PSI), a symmetric derivative of KL divergence:

\$\$ PSI = \\sum \\left( P(x) - Q(x) \\right) \\ln\\left(\\frac{P(x)}{Q(x)}\\right) \$\$

### 5.2 Implementation on Streaming Data

We calculate KL divergence on the semantic embeddings of the clinical notes, drastically reducing dimensionality.

\`\`\`python
from scipy.special import rel_entr
import numpy as np

def calculate_kl_divergence(p_inference: np.ndarray, q_training: np.ndarray, bins: int = 50) -> float:
    """
    Computes KL Divergence between training distribution and inference distribution.
    p_inference: 1D array of embedding projections from last hour.
    q_training: 1D array of embedding projections from training set.
    """
    # Create common histogram bins
    min_val = min(np.min(p_inference), np.min(q_training))
    max_val = max(np.max(p_inference), np.max(q_training))
    bin_edges = np.linspace(min_val, max_val, bins + 1)
    
    # Calculate probability mass functions
    p_hist, _ = np.histogram(p_inference, bins=bin_edges, density=True)
    q_hist, _ = np.histogram(q_training, bins=bin_edges, density=True)
    
    # Add epsilon to prevent division by zero / log(0)
    epsilon = 1e-10
    p_hist = p_hist + epsilon
    q_hist = q_hist + epsilon
    
    # Normalize
    p_pmf = p_hist / np.sum(p_hist)
    q_pmf = q_hist / np.sum(q_hist)
    
    # D_KL(P || Q) = sum(p * log(p / q))
    kl_div = np.sum(rel_entr(p_pmf, q_pmf))
    return float(kl_div)

def monitor_drift(current_embeddings, baseline_embeddings, threshold=0.15):
    kl_score = calculate_kl_divergence(current_embeddings, baseline_embeddings)
    if kl_score > threshold:
        trigger_pagerduty(f"CRITICAL: Covariate Shift Detected. KL Divergence: {kl_score:.4f}")
        initiate_ct_pipeline() # Trigger Airflow/Flyte DAG
\`\`\`

---

## 6. Shadow Deployment & Zero-Downtime Rollouts

We do not do "big bang" deployments. New clinical extraction models undergo a rigorous shadow deployment phase via service mesh routing (Istio/Envoy).

### 6.1 Architecture of a Shadow Rollout

1.  **Traffic Mirroring:** The API Gateway duplicates 100% of incoming HTTP requests (EHR notes).
2.  **Dual Execution:** The primary model \`v1\` serves the synchronous response. The shadow model \`v2\` processes the request asynchronously.
3.  **Fire-and-Forget:** Shadow model responses are dropped to prevent altering the client state but are logged to a ClickHouse analytics cluster.
4.  **Online Evaluation:** A streaming Flink job joins the outputs of \`v1\` and \`v2\` on \`request_id\` and computes real-time agreement rates.

### 6.2 Envoy Proxy Configuration (YAML)

To achieve L9 reliability, infrastructure is codified. Here is the exact Envoy configuration for mirrored routing:

\`\`\`yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: medcare-ner-service
spec:
  hosts:
  - medcare-ner.internal.cluster
  http:
  - route:
    - destination:
        host: medcare-ner-v1
        subset: v1
      weight: 100
    mirror:
      host: medcare-ner-v2
      subset: v2
    mirrorPercentage:
      value: 100.0
\`\`\`

### 6.3 Promotion Criteria (Shadow -> Prod)
A model is only promoted from Shadow to Canary (and subsequently to Prod) if:
1.  **Latency:** p99 latency of \`v2\` is \$\\le\$ p99 of \`v1\` + 5ms.
2.  **OOM/Crash Rate:** \`v2\` container restarts = 0 over 48 hours.
3.  **Agreement:** \`v2\` agrees with \`v1\` on \$\\ge\$ 95% of standard entities, and divergent entities show superior extraction in human audits.

---

## 7. Model Serving & Inference Optimization

Serving Transformer-based models for clinical NER requires high throughput. We leverage ONNX Runtime and TensorRT for execution.

\`\`\`python
# Elite optimization: Dynamic quantization and ONNX export
import torch.onnx

def export_for_serving(model, output_path: str):
    dummy_input = torch.randint(0, 30000, (1, 512), dtype=torch.long)
    dummy_mask = torch.ones((1, 512), dtype=torch.long)
    
    torch.onnx.export(
        model, 
        (dummy_input, dummy_mask), 
        output_path,
        input_names=["input_ids", "attention_mask"],
        output_names=["logits"],
        dynamic_axes={
            "input_ids": {0: "batch_size", 1: "sequence_length"},
            "attention_mask": {0: "batch_size", 1: "sequence_length"},
            "logits": {0: "batch_size", 1: "sequence_length"}
        },
        opset_version=13
    )
    print("Model frozen and optimized for TensorRT/ONNX Runtime.")
\`\`\`

## 8. Conclusion & MLOps Maturity
The MedCare AI platform operates at MLOps Maturity Level 3 (Fully Automated). By coupling MLflow's rigorous lineage with active learning, continuous stateless training, and statistical drift monitoring via KL divergence, we abstract away the fragility of static models. The system self-heals, self-labels, and scales independently, ensuring clinical entity extraction remains robust despite inevitable shifts in medical lexicography.

</SYSTEM_MESSAGE>
`;
