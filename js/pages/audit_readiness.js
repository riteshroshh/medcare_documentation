window.PAGES = window.PAGES || {};
window.PAGES['audit_readiness'] = () => `
<div class="page-chip">medcare_ai / audit_readiness</div>


# MDM Scoring & Audit Readiness

The \`mdmScoringEngine.js\` is a pure deterministic rules engine that calculates Medical Decision Making complexity without relying on non-deterministic AI models.

### Problem Complexity (\`scoreProblems\`)
Executes keyword matching across the \`diagnoses.description\` and \`plan\` vectors. The presence of "severe", "threat", or "unstable" immediately elevates the complexity to **High**. Keywords like "exacerbation" or "progression" elevate to **Moderate**.

### Risk Classification (\`scoreRisk\`)
Evaluates text vectors for risk indicators. "hospitalize" or "dnr" trigger **High** risk, while "prescription", "rx", or "sdoh" trigger **Moderate** risk.

### Data Element Calculation (\`scoreData\`)
Calculates a numeric points system based on the array lengths of Review of Systems (ROS), Vitals, and HPI entries, resolving to an overarching Data level.

The final MDM level ($L_{EM}$) is determined by sorting the Problem, Risk, and Data levels and selecting the median value, perfectly mirroring AMA 2021 Guidelines.
`;
