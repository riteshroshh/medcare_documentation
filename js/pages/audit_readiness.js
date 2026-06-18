window.PAGES = window.PAGES || {};
window.PAGES['audit_readiness'] = () => `
<div class="page-chip">medcare_ai / audit_readiness</div>


# Algorithmic MDM Complexity Scoring

The \`mdmScoringEngine.js\` represents the most critical deterministic component of the backend architecture. It calculates the AMA 2021/2023 Medical Decision Making complexity purely via algorithmic heuristics, guaranteeing mathematical idempotency and absolute audit survivability.

### Complexity Matrix Resolution
The engine decomposes the MDM matrix into three isolated, independently calculated vectors:
* **Problem Complexity (\`scoreProblems\`)**: Iterates through the \`assessment_plan\` text. It employs regex keyword detection—flagging "severe", "threat", or "unstable" to immediately classify the problem vector as **High** (\`4\`), while "exacerbation" or "progression" yields **Moderate** (\`3\`).
* **Risk Calculation (\`scoreRisk\`)**: Scans management data. Keywords like "hospitalize", "dnr", or "toxicity" escalate the vector to **High** (\`4\`), whereas "prescription", "rx", or "sdoh" classify as **Moderate** (\`3\`).
* **Data Element Scoring (\`scoreData\`)**: Executes a simple combinatorial points system. \`Object.keys(ros).length > 0\` adds 1 point. Extensive vitals add 1 point. $\\ge 4$ HPI elements add 1 point. A sum of $\\ge 3$ yields **High** (\`4\`).

### Median Value Derivation
To calculate the final MDM level ($L_{EM}$), the engine arrays the three resulting integers (e.g., \`[3, 4, 3]\`), sorts them descending (\`[4, 3, 3]\`), and mathematically selects the median value at index \`1\` (which is \`3\` or **Moderate**). This perfectly mimics the CMS requirement that "2 of 3 elements must be met or exceeded."
`;
