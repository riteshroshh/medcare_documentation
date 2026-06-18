window.PAGES = window.PAGES || {};
window.PAGES['expected_outcome'] = () => `
<div class="page-chip">medcare_ai / expected_outcome</div>
# Expected Execution Pipeline

The core execution path is defined in \`evaluationPipeline.js\`. When a provider submits structured clinical data, the system initiates a highly concurrent, multi-agent evaluation sequence:

1. **Agent 1 (Deterministic Pre-Check)**: Executes purely algorithmic structural validations (e.g., Chief Complaint string length checks, Assessment-Plan linkage arrays, HPI OLDCARTS element counting) operating at $O(N)$ time complexity.
2. **Agent 2 (LLM MEAT Criteria)**: Dispatches a high-temperature constrained prompt to Gemini-2.5-Pro to extract complex clinical contexts, HCC Risk Adjustments, and MEAT criteria (Monitor, Evaluate, Assess, Treat) from unstructured narrative fields.
3. **Agent 3 (Aggregator & Scorer)**: Merges the deterministic array and AI evaluation arrays, deduplicating identical issues via $O(1)$ hash map lookups. It computes a final compliance score by applying strict severity weights (-20 for Critical, -10 for Warning, -3 for Info).
`;
