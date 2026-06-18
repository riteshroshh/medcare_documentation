window.PAGES = window.PAGES || {};
window.PAGES['ai_recommendations'] = () => `
<div class="page-chip">medcare_ai / ai_recommendations</div>
# Proactive AI Recommendations

The \`aiRecommendationEngine.js\` operates asynchronously alongside the primary scoring engines to generate non-blocking cognitive insights.

Using a highly focused Gemini 2.5 Flash system instruction, the engine scans the \`noteData\` payload for implicit care opportunities:
* **Missing Diagnoses**: Correlating medication arrays (e.g., Metformin) against the diagnoses array to identify undocumented conditions.
* **Upcoding Opportunities**: Flagging instances where the documentation density exceeds the provider's manually selected E/M level.
* **Care Management**: Evaluating chronic condition counts against Chronic Care Management (CCM) and Principal Care Management (PCM) eligibility heuristics.
`;
