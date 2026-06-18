window.PAGES = window.PAGES || {};
window.PAGES['specialty_specific_templates'] = () => `
<div class="page-chip">medcare_ai / specialty_specific_templates</div>


# Encounter and Specialty Architecture

The MDM engine utilizes dynamic patient routing based on the \`patient_type\` boolean flag (New vs. Established).

### Total Time Evaluation
The \`determineEMCode()\` function implements a strict branch evaluation based on \`totalTime\`. For established patients, a \`totalTime >= 40\` deterministically resolves to \`99215\`, bypassing the MDM problem/risk/data complexity calculations entirely. 

The architecture supports horizontal scaling for upcoming specialty templates by passing modular \`patient_type\` context constraints directly into the Gemini prompt wrappers.
`;
