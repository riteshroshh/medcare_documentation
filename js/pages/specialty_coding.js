window.PAGES = window.PAGES || {};
window.PAGES['specialty_coding'] = () => `
<div class="page-chip">medcare_documentation / specialty_coding</div>
<h1>Specialty Coding &amp; Template Validation Engine</h1>

<h2>1. Executive Summary</h2>
<p>This document outlines the architectural schemas, validation engines, and rulesets for specialty-specific clinical templates within the MedCare AI ecosystem. The system is designed to enforce strict compliance with CMS Medicare Learning Network (MLN) directives, Local Coverage Determinations (LCDs), and CDC ICD-10-CM Official Guidelines. </p>
<p>The validation engine actively parses unstructured clinical narratives and structured data inputs to auto-flag medical necessity gaps, enforce the 8-minute rule, drive ICD-10 specificity, and ensure audit-proof documentation for Physical Therapy, Wound Care, Endocrinology (DSMT), and Internal Medicine.</p>

<hr>

<h2>2. Specialty-Specific Template Schemas</h2>

<h3>2.1 Outpatient Rehabilitation (Physical Therapy)</h3>
<p><strong>Reference:</strong> CMS MLN905365 (Complying with Outpatient Rehab Documentation)</p>

<p><strong>Schema Definition:</strong> <code>RehabTherapyEncounter_v2</code></p>
<ul>
<li><strong>Initial Evaluation / Plan of Care (POC):</strong>
  <ul>
  <li><code>Diagnoses</code>: Medical and treatment diagnoses.</li>
  <li><code>LongTermGoals</code>: Must be measurable, functional, and include a timeframe.</li>
  <li><code>FrequencyDuration</code>: e.g., "3x/week for 4 weeks".</li>
  <li><code>CertificationStatus</code>: Boolean flag, must trigger recertification workflow at 90 days or end of POC.</li>
  </ul>
</li>
<li><strong>Treatment Notes (Per Visit):</strong>
  <ul>
  <li><code>InterventionLog</code>: Array of interventions linked to CPT codes.</li>
  <li><code>TimeTracking</code>: 
    <ul>
    <li><code>TotalTreatmentTime</code>: Integer (minutes).</li>
    <li><code>TotalTimedCodeTime</code>: Integer (minutes). Must satisfy the <strong>CMS 8-Minute Rule</strong> algorithm.</li>
    </ul>
  </li>
  </ul>
</li>
<li><strong>Progress Reports:</strong>
  <ul>
  <li><code>ReportingInterval</code>: Triggered every 10th visit. </li>
  <li><code>ObjectiveMeasurements</code>: Required delta against initial baseline.</li>
  </ul>
</li>
</ul>

<p><strong>Validation Engine Rules:</strong></p>
<ul>
<li><code>RULE_PT_001</code>: If <code>TotalTimedCodeTime</code> / 15 yields $U$ units, check remainder $R$. If $R \ge 8$, $U = U + 1$. Total billed units cannot exceed <code>TotalTimedCodeTime</code> allowance.</li>
<li><code>RULE_PT_002</code>: Block billing if <code>ProgressReport</code> is missing on $N \% 10 == 0$ visit.</li>
</ul>

<h3>2.2 Wound Care Management</h3>
<p><strong>Reference:</strong> CMS LCD Article A53296 (Wound Care)</p>

<p><strong>Schema Definition:</strong> <code>WoundCareEncounter_v3</code></p>
<ul>
<li><strong>Wound Assessment (Per Wound):</strong>
  <ul>
  <li><code>WoundID</code>: Unique identifier per site.</li>
  <li><code>AnatomicalLocation</code>: Must map to specific ICD-10 laterality.</li>
  <li><code>Dimensions</code>: <code>Length_cm</code>, <code>Width_cm</code>, <code>Depth_cm</code>. (Mandatory).</li>
  <li><code>WoundStage</code>: Integer 1-4, Unstageable, or DTI (for pressure ulcers).</li>
  <li><code>TissueTypes</code>: Array of <code>Necrotic</code>, <code>Slough</code>, <code>Granulation</code>, <code>Epithelial</code>.</li>
  </ul>
</li>
<li><strong>Debridement Intervention:</strong>
  <ul>
  <li><code>DebridementType</code>: <code>Selective</code> (e.g., 97597) vs <code>Non-Selective</code> vs <code>Surgical</code> (e.g., 11042).</li>
  <li><code>DepthOfTissueRemoved</code>: <code>Epidermis/Dermis</code>, <code>Subcutaneous</code>, <code>Muscle/Fascia</code>, <code>Bone</code>.</li>
  </ul>
</li>
</ul>

<p><strong>Validation Engine Rules:</strong></p>
<ul>
<li><code>RULE_WND_001</code>: Debridement codes (11042-11047) require explicit <code>DepthOfTissueRemoved</code> mapping to SubQ, Muscle, or Bone. Reject if only "fibrinous slough" is documented.</li>
<li><code>RULE_WND_002</code>: Active debridement requires paired documentation of <code>Dimensions</code> pre- and post-procedure.</li>
</ul>

<h3>2.3 Endocrinology &amp; Diabetes Self-Management Training (DSMT)</h3>
<p><strong>Reference:</strong> CMS MLN909381 (Medicare DSMT)</p>

<p><strong>Schema Definition:</strong> <code>DSMT_Encounter_v1</code></p>
<ul>
<li><strong>Referral / Order Intake:</strong>
  <ul>
  <li><code>PhysicianOrder</code>: Required entity. Must contain NPI and date.</li>
  <li><code>TrainingType</code>: <code>Initial</code> (10 hours max) vs <code>FollowUp</code> (2 hours max).</li>
  </ul>
</li>
<li><strong>Curriculum Tracking:</strong>
  <ul>
  <li><code>TopicsCovered</code>: Array Enum [<code>Nutrition</code>, <code>Meds</code>, <code>Monitoring</code>, <code>Complications</code>, <code>Psychosocial</code>].</li>
  <li><code>Modality</code>: <code>Individual</code> (G0108) vs <code>Group</code> (G0109).</li>
  </ul>
</li>
<li><strong>Time/Duration:</strong>
  <ul>
  <li><code>MinutesSpent</code>: Must increment accurately to track against the 12-month limit.</li>
  </ul>
</li>
</ul>

<p><strong>Validation Engine Rules:</strong></p>
<ul>
<li><code>RULE_END_001</code>: If <code>TrainingType</code> == <code>Initial</code> and aggregate <code>MinutesSpent</code> &gt; 600 within 12 months, flag as non-covered.</li>
<li><code>RULE_END_002</code>: Group modality (G0109) requires minimum 2 participants documented in the scheduling engine.</li>
</ul>

<hr>

<h2>3. Medical Necessity Flaggers (MNF Engine)</h2>
<p>The MNF Engine acts as a pre-claim scrubber. It utilizes an NLP pipeline to cross-reference documented clinical indications against CMS Local/National Coverage Determinations (LCD/NCD).</p>
<ul>
<li><strong>MNF-Diagnostic:</strong> Scans orders (e.g., MRI Lumbar Spine) and ensures the linked ICD-10 code is on the approved "Covered Diagnoses" list for that specific CPT.</li>
<li><strong>MNF-Frequency:</strong> Tracks utilization limits (e.g., DSMT hours, PT visits before progress note, Wound Care debridement frequency).</li>
<li><strong>MNF-Specificity:</strong> Rejects "Unspecified" codes when the note contains specific descriptors (e.g., if the text says "Left leg ulcer", flags an error if the coder selects an unspecified leg ulcer code).</li>
</ul>

<hr>

<h2>4. ICD-10 Recommendation &amp; Sequencing Algorithms</h2>
<p>The ICD-10 Recommendation Engine (IRE) uses a hierarchical graph structure and vector embeddings to suggest optimal coding pathways.</p>

<h3>4.1 Laterality &amp; Specificity Resolution</h3>
<ul>
<li><strong>Algorithm:</strong> The NLP parses anatomical keywords and maps them to a SNOMED-CT ontology, traversing to the highest specificity leaf node in ICD-10.</li>
<li><strong>Action:</strong> If a user inputs <code>M54.5</code> (Low back pain) but the text mentions <code>Sciatica, left side</code>, the engine auto-recommends <code>M54.42</code> (Lumbago with sciatica, left side).</li>
</ul>

<h3>4.2 Excludes1 and Excludes2 Conflict Detection</h3>
<ul>
<li><strong>Algorithm:</strong> <code>O(1)</code> hash map lookup against the CDC Excludes list. </li>
<li><strong>Action:</strong> If Code A and Code B are added to the encounter, and Code B is an <code>Excludes1</code> for Code A, an absolute block is generated preventing dual assignment.</li>
</ul>

<h3>4.3 "Code First" / Sequencing Logic</h3>
<ul>
<li><strong>Algorithm:</strong> Dependency graph traversal.</li>
<li><strong>Action:</strong> For manifestations (e.g., Diabetic Neuropathy), the system forces the etiology code to sequence at <code>Index 0</code> (Primary), while the manifestation goes to <code>Index 1</code>.</li>
</ul>
`;
