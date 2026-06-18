window.PAGES = window.PAGES || {};
window.PAGES['architecture'] = () => `
<div class="page-chip">medcare_documentation / architecture</div>
<h1>System Architecture Manifesto</h1>

<h2>1. Architectural Philosophy</h2>
<p>At its core, a medical documentation system is an information retrieval, generation, and validation engine operating under strict constraints of accuracy, latency, and regulatory compliance. MedCare AI does not simply act as a passive scribe; it is an active cognitive partner. Our architecture treats clinical workflows as directed acyclic graphs (DAGs) of data transformation, where unstructured human inputs are meticulously mapped into high-dimensional, structured semantic spaces, evaluated against deterministic regulatory rulesets (CMS), and projected back into natural language representations (Clinical Notes).</p>
<p>To achieve this, we adopt a decoupled, microservices-oriented architecture separating I/O-bound state management from compute-intensive NLP inference.</p>

<h2>2. High-Level System Architecture</h2>
<h3>2.1 Component Topology</h3>
<ul>
<li><strong>API Gateway & Core Business Logic (Node.js/TypeScript)</strong>: Handles authentication, state management, routing, and CRUD operations. Provides a low-latency, highly concurrent event loop capable of streaming responses to the client.</li>
<li><strong>NLP Inference Engine (Python/PyTorch/FastAPI)</strong>: A dedicated cluster for transformer-based inference. Exposes internal gRPC/REST endpoints for tasks like Named Entity Recognition (NER), generation, and compliance classification.</li>
<li><strong>Databases</strong>:
  <ul>
  <li><strong>PostgreSQL</strong>: The absolute source of truth. Handles structured patient data, user state, and audit logs.</li>
  <li><strong>Redis</strong>: Ephemeral cache for session state and rate limiting.</li>
  <li><strong>Vector Store (pgvector)</strong>: Maintains embeddings of clinical guidelines, ICD-10/CPT code descriptions, and historical notes for Retrieval-Augmented Generation (RAG).</li>
  </ul>
</li>
</ul>

<h2>3. Structured Data Input Schemas</h2>
<p>Clinical state is maintained via strict, strongly-typed JSON schemas. This enforces deterministic behavior before data ever reaches the stochastic NLP models.</p>
<pre><code class="language-typescript">interface ClinicalEncounter {
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
  reviewOfSystems: Record&lt;SystemType, SystemReview&gt;;
  medications: Medication[];
  labs: LabResult[];
  diagnoses: Diagnosis[];
  assessmentAndPlan: AssessmentPlanEntry[];
}</code></pre>

<h2>4. API Endpoints</h2>
<p>The interface layer operates strictly over HTTPS with robust payload validation.</p>
<ul>
<li><code>POST /api/v1/encounter/stream-audio</code> -&gt; Streams raw clinician audio, returning structured dictation tokens via WebSockets.</li>
<li><code>POST /api/v1/notes/generate</code> -&gt; Accepts a <code>ClinicalEncounter</code> payload and asynchronously yields a synthesized Markdown clinical note (Progress, H&P, etc.).</li>
<li><code>POST /api/v1/compliance/evaluate</code> -&gt; Accepts an encounter or draft note, evaluates it against the CMS compliance engine, and returns missing elements and a computed E/M level.</li>
<li><code>POST /api/v1/coding/suggest</code> -&gt; RAG-based endpoint taking clinical text embeddings to query pgvector, returning a ranked list of relevant ICD-10 and CPT/HCPCS codes with confidence intervals.</li>
</ul>

<h2>5. NLP Pipeline: Generation & Structuring</h2>
<p>The NLP stack utilizes a cascade of specialized models rather than a single monolithic LLM, optimizing for latency and domain specificity.</p>
<ol>
<li><strong>Information Extraction (Clinical-BioBERT)</strong>: Extracts entities (symptoms, drugs, anatomy) from raw text/transcripts.</li>
<li><strong>Contextual Grounding (RAG)</strong>: Injects retrieved, relevant medical guidelines (e.g., standard of care for hypertension) into the context window.</li>
<li><strong>Generation (Domain-Adapted LLM)</strong>: Synthesizes the narrative clinical note. It maps structured inputs into standard formats (SOAP, H&P) using constrained decoding to prevent hallucination.</li>
<li><strong>Validation (Cross-Encoder)</strong>: A lightweight validation model scores the logical entailment between the generated note and the initial structured inputs. If entailment drops below $\tau = 0.95$, the generation is flagged or retried.</li>
</ol>

<h2>6. Audit-Readiness & Compliance Scoring Formulas</h2>
<p>To calculate the Evaluation and Management (E/M) level and ensure CMS compliance, we compute a deterministic Medical Decision Making (MDM) score. This algorithm bridges clinical NLP with strict heuristics.</p>

<p><strong>MDM Component Computation:</strong></p>
<ol>
<li><strong>Number and Complexity of Problems Addressed ($P$)</strong>:
   <ul>
   <li>Minor problem: 1 point</li>
   <li>Established problem, stable: 1 point</li>
   <li>Established problem, worsening: 2 points</li>
   <li>New problem, no extra workup: 3 points</li>
   <li>New problem, additional workup: 4 points</li>
   </ul>
   <em>Score Matrix</em>: $P_{level} = \min(\sum p_i, 4)$
</li>
<li><strong>Amount and/or Complexity of Data to be Reviewed and Analyzed ($D$)</strong>:
   <ul>
   <li>Order/Review of each unique test (Lab/Image): 1 point</li>
   <li>Independent interpretation of test: 2 points</li>
   <li>Discussion of management with external physician: 2 points</li>
   </ul>
   <em>Score Matrix</em>: $D_{level} = \text{Threshold}(D_{total})$
</li>
<li><strong>Risk of Complications and/or Morbidity or Mortality ($R$)</strong>:
   <ul>
   <li>Calculated via NLP extraction of treatment plans (e.g., "prescription drug management" $\rightarrow$ Moderate Risk; "elective major surgery" $\rightarrow$ High Risk).</li>
   <li>$R_{level} \in \{\text{Minimal}, \text{Low}, \text{Moderate}, \text{High}\}$</li>
   </ul>
</li>
</ol>

<p><strong>Final Audit-Readiness Vector</strong>:<br>
The final E/M Level ($L_{EM}$) is determined by taking the median (or requiring two of the three elements to meet the threshold) of the vectors:<br>
$$L_{EM} = f_{EM}(P_{level}, D_{level}, R_{level})$$</p>
<p>If $L_{EM}$ projected does not match the billed $L_{EM}$ target, the API responds with a specific <code>ComplianceGap</code> array (e.g., "Missing documented independent review of Lab results to support Level 4 MDM").</p>

<h2>Conclusion</h2>
<p>This architecture embraces the messy, high-entropy nature of clinical encounters and systematically refines it into low-entropy, highly structured, and rigorously validated artifacts. By partitioning stochastic generation from deterministic regulatory evaluation, MedCare AI guarantees both the fluidity required by physicians and the absolute precision demanded by auditors.</p>
`;
