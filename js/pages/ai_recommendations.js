window.PAGES = window.PAGES || {};
window.PAGES['ai_recommendations'] = () => `
<div class="page-chip">medcare_ai / ai_recommendations</div>
# AI Recommendations

The tool acts as a proactive cognitive assistant during the documentation process. It continually evaluates the clinical context to suggest:

* **Additional Diagnoses**: Recommends diagnoses supported by the current documentation context (e.g., lab results indicating an undocumented condition).
* **Missing Chronic Conditions**: Flags historical chronic conditions not addressed in the current encounter.
* **Complexity Enhancements**: Suggests additional documentation needed to legitimately support higher-complexity visits.
* **Preventive Services**: Identifies preventive services that may be due based on patient history and demographics.
`;
