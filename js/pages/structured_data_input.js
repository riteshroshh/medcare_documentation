window.PAGES = window.PAGES || {};
window.PAGES['structured_data_input'] = () => `
<div class="page-chip">medcare_ai / structured_data_input</div>


# Structured Data Normalization

The backend utilizes strict normalization protocols before dispatching data to the multi-agent pipeline. 

### HPI Ontology Mapping
The \`mapHpiToCMS()\` function in the evaluation pipeline is responsible for translating user-friendly frontend nomenclature into strict CMS OLDCARTS terminology.
- \`hpi.character\` is transpiled to \`mapped.quality\`
- \`hpi.alleviating\` is transpiled to \`mapped.modifying_factors\`
- \`hpi.associated\` is transpiled to \`mapped.associated_signs\`

This deterministic mapping dramatically improves the zero-shot inference accuracy of the downstream Gemini 2.5 Pro model during compliance auditing.
`;
