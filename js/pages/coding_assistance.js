window.PAGES = window.PAGES || {};
window.PAGES['coding_assistance'] = () => `
<div class="page-chip">medcare_ai / coding_assistance</div>
# Coding Assistance

Based on the documentation ingested, the tool dynamically computes the optimal coding vectors:

* **Suggest ICD-10 Diagnosis Codes**: Resolves clinical text to appropriate, highest-specificity ICD-10 codes.
* **Suggest CPT/HCPCS Codes**: Maps procedures and services to current procedural terminology.
* **Recommend E/M Level**: Computes appropriate E/M (99202–99215, 99304–99310, etc.) based on Medical Decision Making (MDM) or Total Time.
* **Provide Justification**: Surfaces the exact components used to derive the recommended code level.
* **Flag Deficiencies**: Proactively flags documentation gaps that may result in downcoding or negative audit findings.
`;
