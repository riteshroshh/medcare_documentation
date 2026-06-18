window.PAGES = window.PAGES || {};
window.PAGES['em_engine'] = () => `
<div class="page-chip">medcare_documentation / em_engine</div>
<h1>E/M Engine Architecture &amp; Scoring Logic</h1>

<h2>1. Architectural Overview</h2>
<p>The Evaluation and Management (E/M) Scoring Engine computes the appropriate CPT&reg; codes based on the AMA 2023 Guidelines and CMS compliance rules. The engine evaluates encounters using a dual-pathway algorithm: <strong>Time-Based Selection</strong> and <strong>Medical Decision Making (MDM)-Based Selection</strong>, prioritizing the pathway that yields the highest compliant code. A natural language processing (NLP) Documentation Validation Pipeline runs asynchronously to ensure medical necessity and detect incomplete clinical elements prior to final code assignment.</p>

<hr>

<h2>2. Pathway A: Time-Based Scoring Algorithm</h2>
<p>For outpatient/office visits (9920x / 9921x), time operates as a continuous sum of face-to-face and non-face-to-face provider activities on the date of encounter. For Nursing Facility services (9930x / 9931x), time thresholds act as exact baseline minimums.</p>

<h3>Office or Other Outpatient Services (99202&ndash;99215)</h3>
<table>
  <thead>
    <tr>
      <th>CPT Code</th>
      <th>Total Time Threshold (Minutes)</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>99202</strong> (New)</td><td>15&ndash;29</td><td></td></tr>
    <tr><td><strong>99203</strong> (New)</td><td>30&ndash;44</td><td></td></tr>
    <tr><td><strong>99204</strong> (New)</td><td>45&ndash;59</td><td></td></tr>
    <tr><td><strong>99205</strong> (New)</td><td>60&ndash;74</td><td>Use prolonged service code for +15 min beyond max</td></tr>
    <tr><td><strong>99212</strong> (Est.)</td><td>10&ndash;19</td><td>99211 is N/A for time</td></tr>
    <tr><td><strong>99213</strong> (Est.)</td><td>20&ndash;29</td><td></td></tr>
    <tr><td><strong>99214</strong> (Est.)</td><td>30&ndash;39</td><td></td></tr>
    <tr><td><strong>99215</strong> (Est.)</td><td>40&ndash;54</td><td>Use prolonged service code for +15 min beyond max</td></tr>
  </tbody>
</table>

<h3>Nursing Facility Services (99304&ndash;99310)</h3>
<table>
  <thead>
    <tr>
      <th>Initial Care (New/Admit)</th>
      <th>Time Threshold</th>
      <th>Subsequent Care</th>
      <th>Time Threshold</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>99304</strong></td><td>25 min</td><td><strong>99307</strong></td><td>10 min</td></tr>
    <tr><td><strong>99305</strong></td><td>35 min</td><td><strong>99308</strong></td><td>15 min</td></tr>
    <tr><td><strong>99306</strong></td><td>45 min</td><td><strong>99309</strong></td><td>25 min</td></tr>
    <tr><td></td><td></td><td><strong>99310</strong></td><td>45 min</td></tr>
  </tbody>
</table>

<p><em>Algorithm Logic:</em> <code>if (BillingStrategy == TIME) { return MapTimeThresholdToCPT(TotalEncounterTime); }</code></p>

<hr>

<h2>3. Pathway B: MDM-Based Scoring Algorithm</h2>
<p>The core MDM engine operates on a strict <strong>"Two-of-Three" Rule</strong>. It evaluates three independent dimensions:</p>
<ol>
<li><code>ComplexityOfProblems</code></li>
<li><code>ComplexityOfData</code></li>
<li><code>RiskOfManagement</code></li>
</ol>
<p>To return a specific MDM Level (Straightforward, Low, Moderate, High), the condition <code>count(Dimensions &ge; TargetLevel) &ge; 2</code> must evaluate to <code>True</code>.</p>

<h3>3.1. Number and Complexity of Problems Addressed</h3>
<ul>
<li><strong>Minimal:</strong> 1 self-limited/minor problem.</li>
<li><strong>Low:</strong> 2+ minor problems; OR 1 stable chronic illness; OR 1 acute, uncomplicated illness/injury.</li>
<li><strong>Moderate:</strong> 1+ chronic illnesses with exacerbation, progression, or side effects; OR 2+ stable chronic illnesses; OR 1 undiagnosed new problem with uncertain prognosis; OR 1 acute illness with systemic symptoms.</li>
<li><strong>High:</strong> 1+ chronic illnesses with severe exacerbation; OR 1 acute/chronic illness or injury posing a threat to life or bodily function.</li>
</ul>

<h3>3.2. Amount and/or Complexity of Data to be Reviewed and Analyzed</h3>
<p>Segmented into three categories: Category 1 (Tests, Documents, Independent Historian), Category 2 (Independent Interpretation), Category 3 (Discussion of Management).</p>
<ul>
<li><strong>Minimal/None:</strong> Fails to meet Limited.</li>
<li><strong>Limited:</strong> Meets requirements in &ge; 1 category (e.g., review of 2 prior documents/tests, or use of independent historian).</li>
<li><strong>Moderate:</strong> Meets requirements in &ge; 1 of 3 categories (e.g., review/order of 3 distinct tests/documents, or independent interpretation).</li>
<li><strong>Extensive:</strong> Meets requirements in &ge; 2 of 3 categories with higher volume thresholds.</li>
</ul>

<h3>3.3. Risk of Complications and/or Morbidity or Mortality</h3>
<ul>
<li><strong>Minimal:</strong> Minimal risk from testing/treatment.</li>
<li><strong>Low:</strong> Low risk (e.g., over-the-counter drugs, minor surgery without risk factors).</li>
<li><strong>Moderate:</strong> Moderate risk (e.g., prescription drug management, minor surgery with patient risk factors, major surgery without risk factors).</li>
<li><strong>High:</strong> High risk (e.g., drug therapy requiring intensive monitoring, elective major surgery with risk factors, emergency major surgery, decision regarding hospitalization, DNR/de-escalation of care).</li>
</ul>

<hr>

<h2>4. Documentation Validation Logic (Compliance Subsystem)</h2>
<p>To align with CMS Compliance guidelines and CERT audit rules, our validation pipeline scans the generated documentation for structural and semantic completeness before code assignment.</p>

<h3>4.1. Missing HPI &amp; Medical Necessity Engine</h3>
<ul>
<li><strong>Logic:</strong> While the 2023 AMA rules no longer strictly tabulate specific HPI elements to define the service level, the HPI remains the algorithmic foundation for establishing <em>Medical Necessity</em>.</li>
<li><strong>Validation Pipeline:</strong> The NLP module scans the <code>Chief Complaint</code> and <code>History of Present Illness</code> sections. If the extracted clinical narrative yields only low-entropy tokens without contextualizing symptomatic details, the system triggers a threshold flag:<br>
  <code>Exception: CMS_COMPLIANCE_WARNING -&gt; Vague or Missing HPI. Insufficient narrative to support Medical Necessity.</code></li>
</ul>

<h3>4.2. Incomplete Assessment &amp; Plan (A&amp;P) Verification</h3>
<ul>
<li><strong>Logic:</strong> The A&amp;P node is parsed to ensure it logically maps to the computed <code>ComplexityOfProblems</code> and <code>RiskOfManagement</code>.</li>
<li><strong>Validation Pipeline:</strong>
  <ul>
  <li><code>Diagnoses Integrity Check</code>: Ensures every problem accounted for in MDM has a distinct, fully specified clinical impression.</li>
  <li><code>Actionable Plan Check</code>: Ensures every documented diagnosis is linked to a management vector (e.g., "monitor", "prescribe", "refer").</li>
  <li><code>Cloned Note Detection</code>: Evaluates text-similarity hashes against historical notes to prevent CMS "cloned note" violations.</li>
  </ul>
</li>
</ul>

<pre><code class="language-python">def calculate_em_code(visit_context):
    validation_errors = validate_documentation(visit_context.clinical_doc)
    if validation_errors:
        return raise_provider_query(validation_errors)
        
    mdm_level = calculate_mdm(visit_context.problems, visit_context.data, visit_context.risk)
    time_level = calculate_time_thresholds(visit_context.total_time, visit_context.setting)
    
    # Billing Optimizer Pathway
    selected_level = max(mdm_level, time_level)
    return map_level_to_cpt(selected_level, visit_context.setting, visit_context.patient_status)
</code></pre>
`;
