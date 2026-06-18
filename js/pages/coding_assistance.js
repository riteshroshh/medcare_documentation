window.PAGES = window.PAGES || {};
window.PAGES['coding_assistance'] = () => `
<div class="page-chip">medcare_ai / coding_assistance</div>


# Defensive Coding & Deterministic Injection

The \`codingEngine.js\` isolates the responsibility of mapping clinical narratives to massive, high-dimensional ICD-10-CM and CPT ontologies. 

### LLM Constrained Taxonomy Mapping
By enforcing a strict JSON schema on Gemini 2.5 Flash, the model is compelled to yield highly structured arrays of \`icd10\` and \`cpt\` objects. Crucially, the schema forces the LLM to provide a \`justification\` string and an \`hcc_relevant\` boolean, demanding that the model explicitly "show its work" when mapping a risk-adjustable condition.

### E/M Code Hallucination Prevention Protocol
A known vulnerability in LLM-assisted medical coding is the hallucination of the primary E/M CPT code (e.g., suggesting a \`99215\` when the deterministic MDM algorithm only supports a \`99213\`). 

To completely eliminate this risk, the pipeline executes a strict deterministic injection protocol:
1. It filters the LLM's generated CPT array, aggressively stripping any code that begins with E/M prefixes (\`9921\`, \`9920\`, \`9934\`, \`9935\`).
2. It takes the mathematically derived E/M code from our \`mdmScoringEngine.js\`.
3. It pushes this unimpeachable, deterministic E/M code to the \`0\`-index of the CPT array before yielding the final payload to the client.
`;
