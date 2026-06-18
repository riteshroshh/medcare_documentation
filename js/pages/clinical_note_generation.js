window.PAGES = window.PAGES || {};
window.PAGES['clinical_note_generation'] = () => `
<div class="page-chip">medcare_ai / clinical_note_generation</div>


# Resilient Clinical Note Generation

The \`noteGenerationEngine.js\` subsystem is responsible for transpiling disjointed structured UI states into cohesive, CMS-compliant SOAP narratives. This subsystem employs sophisticated fault-tolerance mechanisms to guarantee 99.99% availability.

### Constrained JSON Parsing Pipeline
The engine interfaces with Gemini 2.5 Flash utilizing a strict \`responseSchema\`. The model is forced to yield a discrete JSON object containing \`subjective\`, \`objective\`, \`assessment\`, and \`plan\` strings. 

To combat LLM fencing artifacts, the \`safeParseNote(raw)\` interceptor employs aggressive regex stripping (\`.replace(/^\\\`\\\`\\\`json\\s*/i, '')\`) before parsing the AST. Structural integrity is then mathematically validated; if the AST lacks any required SOAP key, an exception is forcefully thrown to halt corruption.

### Idempotent Deterministic Fallback
If the upstream Gemini API suffers a timeout, or if the \`safeParseNote\` validation fails, the engine immediately triggers an idempotent fallback sequence. The \`catch\` block bypasses the LLM entirely and constructs a primitive, functionally valid note string natively mapping the raw \`noteData\` arrays (injecting the Chief Complaint, enumerating the \`assessment_plan.diagnoses\` arrays). This circuit-breaker pattern ensures that providers never experience a "dead screen" during high-throughput clinical operations.
`;
