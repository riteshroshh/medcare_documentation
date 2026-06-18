window.PAGES = window.PAGES || {};
window.PAGES['clinical_note_generation'] = () => `
<div class="page-chip">medcare_ai / clinical_note_generation</div>
# Clinical Note Generation Engine

The note generation logic is encapsulated within \`noteGenerationEngine.js\`. We employ a resilient LLM parsing strategy to construct CMS-compliant SOAP notes.

### Resilient Parsing Strategy
The \`safeParseNote(raw)\` function utilizes regex to strip arbitrary markdown fencing (\`\\\`\\\`\\\`json\`) injected by the LLM, forcing the string into a valid JSON object. We enforce strict structural integrity by throwing errors if any of the required SOAP keys (\`subjective\`, \`objective\`, \`assessment\`, \`plan\`) are missing from the parsed AST.

### Contextual Fallback
In the event of an upstream Gemini API timeout or hallucination, the engine catches the exception and immediately invokes a deterministic fallback sequence. This sequence reconstructs a primitive but valid note directly from the raw structured \`noteData\` arrays, guaranteeing zero downtime and uninterrupted provider workflows.
`;
