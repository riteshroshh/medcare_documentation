window.PAGES = window.PAGES || {};
window.PAGES['expected_outcome'] = () => `
<div class="page-chip">medcare_ai / expected_outcome</div>


# Multi-Agent Execution Pipeline

The core orchestration of the MedCare backend is governed by \`evaluationPipeline.js\`. To minimize latency while maximizing evaluation depth, the system dispatches a highly concurrent, multi-agent evaluation sequence upon receiving a structured clinical payload.

### Agent 1: Deterministic Pre-Check Pipeline
Operating entirely independently of the LLM layer, this agent executes $O(N)$ heuristics to validate structural integrity. It applies hard-coded constraints against the payload:
* **HPI Vectorization**: Scans the \`hpiFields\` array, asserting that $\\ge 4$ distinct OLDCARTS elements are populated for moderate-to-high complexity encounters.
* **Assessment-Plan Linkage Verification**: Iterates over the \`assessment_plan.diagnoses\` array. If a diagnosis is detected where the associated \`plan\` string resolves to $< 10$ characters, a deterministic \`critical\` severity exception is immediately injected into the pipeline.
* **Chief Complaint Density**: Validates that \`cc.trim().length \\ge 3\`, preventing ambiguous encounter origins.

### Agent 2: Semantic MEAT & HCC LLM Evaluation
Simultaneously, the pipeline dispatches a constrained prompt to Gemini-2.5-Pro. The prompt forces the LLM into the persona of a Certified Professional Coder (CPC) and evaluates subjective criteria—such as verifying MEAT (Monitor, Evaluate, Assess, Treat) documentation for chronic conditions and identifying specificity gaps in ICD-10 narrative mapping.

### Agent 3: Deduplication & Scoring Heuristics
The output of both Agent 1 and Agent 2 are merged into a unified AST. Agent 3 executes an $O(1)$ hash map deduplication algorithm by hashing \`(issue.category + issue.message.slice(0, 60)).toLowerCase()\`. 

The final **Audit Compliance Score** is derived by subtracting weighted penalties (\`critical: 20\`, \`warning: 10\`, \`info: 3\`) from a baseline of 100, clamping the output to a rigorous \`[0, 100]\` bounded integer.
`;
