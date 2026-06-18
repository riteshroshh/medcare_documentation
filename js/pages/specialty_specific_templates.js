window.PAGES = window.PAGES || {};
window.PAGES['specialty_specific_templates'] = () => `
<div class="page-chip">medcare_ai / specialty_specific_templates</div>


# Execution Branching & Time-Based Overrides

The architecture accommodates sophisticated specialty templates and diverse clinical encounters through strict execution branching in \`mdmScoringEngine.js\`.

### Time-Based Override Mechanics
CMS guidelines permit E/M coding based exclusively on total encounter time, entirely bypassing MDM complexity matrices. The \`determineEMCode()\` function implements an $O(1)$ conditional branch to handle this override.
If the \`totalTime\` parameter is present in the payload, the engine immediately abandons the MDM median derivation. Instead, it evaluates against hard-coded temporal thresholds:
* For an \`established\` patient, \`totalTime >= 40\` instantly and deterministically resolves to CPT \`99215\`.
* For a \`new\` patient, \`totalTime >= 60\` resolves to \`99205\`.

### Dynamic Context Routing
By passing the \`patient_type\` boolean flag directly into both the deterministic heuristic trees and the upstream LLM prompt wrappers, the system can seamlessly shift its validation logic to support nuanced specialty requirements (e.g., AWV, PCM, or specific Wound Care paradigms) without requiring complex code refactoring.
`;
