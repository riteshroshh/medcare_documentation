window.PAGES = window.PAGES || {};
window.PAGES['coding_assistance'] = () => `
<div class="page-chip">medcare_ai / coding_assistance</div>
# Algorithmic Coding Assistance

The \`codingEngine.js\` architecture maps clinical narratives to the highest-specificity ICD-10-CM and CPT codes.

### Gemini 2.5 Flash Integration
The engine utilizes a constrained JSON schema that forces the model to return arrays of ICD-10 and CPT objects containing:
- \`code\`: The exact alphanumeric code.
- \`confidence\`: The model's confidence interval.
- \`justification\`: A text explanation of the clinical linkage.
- \`hcc_relevant\`: A boolean flag identifying Risk Adjustment impact.

### E/M Injection Protocol
To prevent AI hallucination regarding Medical Decision Making (MDM), the pipeline filters out any E/M codes (prefixes \`9921\`, \`9920\`, etc.) hallucinated by the LLM. It then deterministically injects the hard-calculated E/M code (derived from our \`mdmScoringEngine\`) at the 0-index of the CPT array.
`;
