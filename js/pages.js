window.PAGES = {

overview: () => `
<div class="page-chip">medcare_documentation / overview</div>
<h1>MedCare AI Documentation</h1>
<p>This documentation outlines the architectural topology of <strong>MedCare AI</strong>, an end-to-end intelligent platform engineered to redefine clinical workflows. Built from first principles, it is an uncompromising fusion of strict data governance, real-time AI-assisted clinical documentation, and high-performance state management.</p>

<div class="callout note">
  <strong>Note:</strong> MedCare AI operates entirely autonomously via its Node.js backend and React-driven interface, persisting compliance events directly into an immutable local SQLite architecture. 
</div>

<h2>The Paradigm Shift in Clinical Ops</h2>
<p>Traditional EMRs operate as static data repositories—forcing clinicians into the dual role of caregiver and data-entry clerk. MedCare AI shifts this paradigm from passive storage to active intelligence. By intercepting clinical notes in real-time, the system automatically runs compliance heuristics, detects missing billing codes (E/M codes), and structures chaotic patient histories into highly organized longitudinal records.</p>
<p>The platform is designed around three core pillars:</p>
<ul>
  <li><strong>Real-Time AI Auditing:</strong> Instantaneous, deterministic evaluation of clinical notes against medical necessity and billing constraints.</li>
  <li><strong>Longitudinal Care Management:</strong> Stateful, persistent tracking of patient enrollment in CCM (Chronic Care Management), RPM, and PCM protocols.</li>
  <li><strong>Zero-Latency UI/UX:</strong> A hyper-optimized React frontend utilizing Framer Motion for cognitive load reduction through spatial UI transitions.</li>
</ul>
`,

architecture: () => `
<div class="page-chip">medcare_documentation / architecture</div>
<h1>System Architecture</h1>
<p>The MedCare AI architecture enforces a strict decoupling of concerns. The frontend manages optimistic state and high-frequency UI updates, while the backend acts as a rigid enforcement layer for data integrity and AI communication.</p>

<h2>The Client Layer (React / Vite)</h2>
<p>The frontend is a single-page application bundled with Vite. It eschews heavy state management libraries (like Redux) in favor of localized React hooks and context-driven state propagation. The UI relies on native CSS and Framer Motion for layout calculations.</p>
<pre><code class="language-javascript">
// Typical architectural flow for data fetching
useEffect(() => {
  const fetchDashboardData = async () => {
    const statsRes = await fetch('http://localhost:5000/api/patients/stats');
    const data = await statsRes.json();
    setStats(data);
  };
  fetchDashboardData();
}, []);
</code></pre>

<h2>The API Layer (Node.js / Express)</h2>
<p>The backend serves as a stateless router that sits atop a stateful Prisma ORM. It exposes highly specialized, granular endpoints. Data validation is handled at the controller level before persisting to SQLite.</p>

<h2>The Persistence Layer (SQLite via Prisma)</h2>
<p>We leverage SQLite for local, zero-config persistence. The database schema strictly enforces referential integrity between <code>Patients</code>, <code>Notes</code>, and <code>CareManagement</code> models. Prisma's generated type definitions ensure end-to-end type safety between the database and the Node layer.</p>
`,

ai_auditing: () => `
<div class="page-chip">medcare_documentation / ai_auditing</div>
<h1>AI Auditing System</h1>
<p>The AI Auditing engine is the cognitive core of MedCare AI. It transforms unstructured clinical narratives into structured compliance objects.</p>

<h2>The Heuristic Pipeline</h2>
<p>When a physician finalizes a note, the text is routed through an asynchronous inference pipeline. The payload is constructed with strict prompt boundaries to prevent hallucination, forcing the LLM to output pure, parseable JSON arrays of missing elements.</p>

<h2>Deterministic Parsing</h2>
<p>The raw LLM output is not trusted by default. It passes through a deterministic parsing layer in the backend that sanitizes the output, strips markdown formatting, and validates the presence of expected JSON keys.</p>

<pre><code class="language-javascript">
// Backend AI integration logic
const auditClinicalNote = async (req, res) => {
  const { content, category } = req.body;
  const prompt = \`
    Analyze this \${category} note. Identify missing E/M coding elements. 
    Return ONLY a JSON array of strings. 
    NOTE: \${content}
  \`;
  
  const rawResponse = await callLLM(prompt);
  const parsedDiscrepancies = JSON.parse(sanitizeJSON(rawResponse));
  
  // Persist to SQLite and return
  await db.note.update({ discrepancies: parsedDiscrepancies });
  res.json({ discrepancies: parsedDiscrepancies });
};
</code></pre>
<p>The resulting array is rendered in the frontend via a high-visibility, glassmorphic discrepancy panel, allowing the clinician to immediately rectify documentation gaps before committing the record.</p>
`,

care_management: () => `
<div class="page-chip">medcare_documentation / care_management</div>
<h1>Care Management</h1>
<p>The Care Management module tracks continuous patient engagement across various clinical programs (CCM, RPM, PCM). This is not a static list, but a temporal state machine.</p>

<h2>Temporal Tracking</h2>
<p>Each patient entity holds a one-to-one relationship with a <code>CareManagement</code> record. This record tracks absolute timestamps of their last engagement and accumulates minutes over a rolling 30-day window.</p>

<h2>State Transitions</h2>
<p>Enrollment status transitions through distinct states: <code>Eligible</code>, <code>Enrolled</code>, and <code>Inactive</code>. The UI reflects these states dynamically.</p>
<pre><code class="language-javascript">
model CareManagement {
  id              Int      @id @default(autoincrement())
  patientId       Int      @unique
  programType     String   // "CCM", "RPM", "PCM"
  status          String   // "Enrolled", "Eligible"
  minutesLogged   Int      @default(0)
  lastInteraction DateTime
  patient         Patient  @relation(fields: [patientId], references: [id])
}
</code></pre>
`,

security_data: () => `
<div class="page-chip">medcare_documentation / security_data</div>
<h1>Security & Data Handling</h1>
<p>Healthcare data requires absolute deterministic guarantees regarding access and modification. MedCare AI handles this through a local-first philosophy combined with strict architectural boundaries.</p>

<h2>Local-First Architecture</h2>
<p>By relying on SQLite running on the host machine, we eliminate the network vector for data interception. Patient Protected Health Information (PHI) never traverses the open internet unless explicitly querying the LLM for note auditing—and during that phase, data is stripped of direct patient identifiers.</p>

<h2>Immutable Audit Trails</h2>
<p>While the current prototype allows direct editing, the eventual architecture enforces append-only semantics for clinical notes. Every modification creates a new version record, ensuring cryptographic-level non-repudiation of clinical history.</p>
`

};
