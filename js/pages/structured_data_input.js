window.PAGES = window.PAGES || {};
window.PAGES['structured_data_input'] = () => `
<div class="page-chip">medcare_ai / structured_data_input</div>


# Clinical Data Normalization & Ontology Mapping

Before the MedCare multi-agent pipeline can process a payload, the unstructured UI state vectors must be normalized into strict CMS taxonomies. The backend acts as an ontological transpiler.

### HPI Ontology Transpilation
The \`mapHpiToCMS()\` function is a critical mapping layer that transforms user-friendly frontend keys into the rigid OLDCARTS (Onset, Location, Duration, Character, Aggravating/Alleviating, Radiation, Timing, Severity) terminology demanded by CMS auditors.

* \`hpi.character\` is strictly mapped to \`mapped.quality\`
* \`hpi.alleviating\` is strictly mapped to \`mapped.modifying_factors\`
* \`hpi.associated\` is strictly mapped to \`mapped.associated_signs_symptoms\`

### Semantic Anchor Optimization
By enforcing this deterministic nomenclature shift *before* dispatching the payload to the LLM (Agent 2), we establish powerful semantic anchors in the prompt context. This drastically minimizes the cognitive load on the LLM, reducing the token consumption required for reasoning and radically increasing the zero-shot inference accuracy during the subsequent compliance auditing phase.
`;
