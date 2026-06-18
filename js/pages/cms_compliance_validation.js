window.PAGES = window.PAGES || {};
window.PAGES['cms_compliance_validation'] = () => `
<div class="page-chip">medcare_ai / cms_compliance_validation</div>


# CMS Compliance Validation

The compliance engine runs a dual-pass evaluation combining deterministic heuristics and LLM heuristics.

### Deterministic Heuristics
The \`deterministicPreCheck(noteData)\` function executes rigorous, fast-path checks:
* **HPI Count**: Validates that the number of documented OLDCARTS elements is $\\ge 4$ for moderate/high complexity visits.
* **Assessment-Plan Linkage**: Iterates through the \`assessment_plan.diagnoses\` array. If a diagnosis lacks a \`plan\` string of at least 10 characters, a critical severity flag is pushed to the pipeline.

### LLM Heuristics
The \`complianceEngine.js\` dispatches a structured JSON Schema to Gemini 2.5 Flash, prompting the model to evaluate subjective compliance aspects:
* Flagging "unspecified" ICD-10 descriptors when the clinical narrative implies higher specificity.
* Identifying missing preventive care baselines (e.g., missing HbA1c tracking for Diabetic patients).
`;
