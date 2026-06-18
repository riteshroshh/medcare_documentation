window.PAGES = window.PAGES || {};
window.PAGES['cms_compliance_validation'] = () => `
<div class="page-chip">medcare_ai / cms_compliance_validation</div>


# Deep E/M Compliance Heuristics

The \`complianceEngine.js\` is the definitive gatekeeper for the final documentation payload. It enforces a dual-layered architectural perimeter against upcoding and insufficient medical necessity.

### Algorithmic Baseline Enforcement
The system bypasses AI hallucination for quantifiable metrics by hard-coding the AMA 2021/2023 E/M Guidelines directly into the execution graph. 
For instance, the engine executes $O(1)$ array length checks against the \`hpi\` object. If the calculated Medical Decision Making ($L_{EM}$) dictates a Moderate or High complexity code (e.g., \`99214\`), the engine mathematically requires \`Object.keys(hpi).length >= 4\`. Failure to meet this algorithmic threshold dynamically injects a \`warning\` severity event.

### Semantic Quality Assessment
While lengths and counts are handled deterministically, the subjective quality of the narrative is evaluated by Gemini 2.5 Flash operating at an ultra-low temperature (\`T=0.1\`). The LLM is instructed to scan for:
* **ICD-10 Ambiguity**: Flagging generic "unspecified" descriptors when the surrounding clinical data (e.g., specific lab results or explicit lateral physical exam findings) mathematically supports a higher-specificity code.
* **Preventive Care Identification**: Scanning the \`diagnoses\` array against demographic matrices to identify missing chronic tracking (e.g., missing A1C orders for an existing Type 2 Diabetes vector).
`;
