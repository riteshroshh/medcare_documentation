window.PAGES = window.PAGES || {};
window.PAGES['ai_recommendations'] = () => `
<div class="page-chip">medcare_ai / ai_recommendations</div>


# Asynchronous Cognitive Intelligence

To maximize provider efficiency without blocking the primary critical-path response, the \`aiRecommendationEngine.js\` operates completely asynchronously. This cognitive layer is dedicated exclusively to proactive revenue integrity and clinical safety net generation.

### Implicit Gap Detection
Utilizing a highly constrained \`temperature=0.2\` prompt, the engine cross-references disparate arrays within the \`noteData\` AST. 
* **Medication-Diagnosis Mismatches**: It algorithmically identifies orphaned treatment vectors—for example, isolating the presence of "Metformin" in the \`medications\` array without a corresponding "Type 2 Diabetes" node in the \`diagnoses\` array.
* **Upcoding Arbitration**: The engine constantly analyzes the sheer density of the Data and Risk vectors. If the parsed documentation easily supports a Level 5 visit (\`99215\`), but the provider manually overrides to a Level 4 (\`99214\`), the engine flags the mathematical discrepancy.
* **Care Management**: Evaluating chronic condition counts against Chronic Care Management (CCM) and Principal Care Management (PCM) eligibility heuristics.
`;
