window.PAGES = window.PAGES || {};
window.PAGES['care_management'] = () => `
<div class="page-chip">medcare_documentation / care_management</div>
<h1>Care Management Tracking System Design</h1>

<h2>1. Overview</h2>
<p>The Care Management Tracking System manages state machines, time-tracking algorithms, and compliance validations for Chronic Care Management (CCM), Principal Care Management (PCM), Transitional Care Management (TCM), and Remote Physiologic Monitoring (RPM). This design aligns with CMS regulations (including updates effective Jan 1, 2026) to ensure auditable, complaint billing.</p>

<h2>2. Core Data Models</h2>

<h3>2.1. Program Enrollment (<code>CareProgramEnrollment</code>)</h3>
<p>Tracks patient participation across care management programs.</p>
<ul>
<li><code>EnrollmentID</code> (UUID)</li>
<li><code>PatientID</code> (UUID)</li>
<li><code>ProgramType</code> (Enum: <code>CCM</code>, <code>PCM</code>, <code>TCM</code>, <code>RPM</code>)</li>
<li><code>Status</code> (Enum: <code>ELIGIBLE</code>, <code>CONSENT_PENDING</code>, <code>ACTIVE</code>, <code>COMPLETED</code>, <code>REVOKED</code>)</li>
<li><code>ConsentDate</code> (Timestamp)</li>
<li><code>QualifyingConditions</code> (List of ICD-10 codes)</li>
<li><code>StartDate</code> / <code>EndDate</code> (Timestamps)</li>
</ul>

<h3>2.2. Time Entry (<code>CareTimeLog</code>)</h3>
<p>Centralized time tracking log to prevent double-counting across programs.</p>
<ul>
<li><code>LogID</code> (UUID)</li>
<li><code>PatientID</code> (UUID)</li>
<li><code>ProviderID</code> / <code>Role</code> (UUID / Enum)</li>
<li><code>ProgramType</code> (Enum: <code>CCM</code>, <code>PCM</code>, <code>TCM</code>, <code>RPM</code>)</li>
<li><code>StartTime</code> / <code>EndTime</code> (Timestamps)</li>
<li><code>DurationMinutes</code> (Integer)</li>
<li><code>ActivityDescription</code> (String - highly specific per CMS rules)</li>
<li><code>IsInteractiveContact</code> (Boolean - required for RPM/TCM)</li>
<li><code>BilledStatus</code> (Enum: <code>UNBILLED</code>, <code>BILLED</code>)</li>
</ul>

<h2>3. Program Specific Algorithms and State Machines</h2>

<h3>3.1. Chronic Care Management (CCM) & Principal Care Management (PCM)</h3>

<h4>Compliance Checklist</h4>
<ul>
<li><strong>Consent:</strong> Documented verbal or written consent.</li>
<li><strong>Conditions:</strong> 
  <ul>
  <li><strong>CCM:</strong> 2+ chronic conditions lasting &gt;12 months.</li>
  <li><strong>PCM:</strong> 1 high-risk chronic condition lasting &gt;3 months.</li>
  </ul>
</li>
<li><strong>Care Plan:</strong> Comprehensive (CCM) or Disease-specific (PCM) accessible to the patient.</li>
<li><strong>Time Thresholds (Per Calendar Month):</strong> 
  <ul>
  <li>CCM: &ge; 20 mins clinical staff time.</li>
  <li>PCM: &ge; 30 mins care management time.</li>
  </ul>
</li>
</ul>

<h4>State Machine</h4>
<p><code>ELIGIBLE</code> &rarr; <code>CONSENT_OBTAINED</code> &rarr; <code>PLAN_CREATED</code> &rarr; <code>ACTIVE_MONTH</code> &rarr; <code>BILLING_READY</code> &rarr; <code>BILLED</code></p>

<h4>Time-Tracking Algorithm (Runs nightly via Cron)</h4>
<pre><code class="language-python">def check_ccm_pcm_billing_eligibility(patient_id, month, program_type):
    logs = fetch_time_logs(patient_id, month, program_type)
    total_minutes = sum(log.DurationMinutes for log in logs)
    
    threshold = 20 if program_type == 'CCM' else 30
    has_consent = check_consent_status(patient_id, program_type)
    has_care_plan = check_care_plan_exists(patient_id, program_type)
    
    if total_minutes >= threshold and has_consent and has_care_plan:
        return True, total_minutes
    return False, total_minutes
</code></pre>

<h3>3.2. Transitional Care Management (TCM)</h3>

<h4>Compliance Checklist</h4>
<ul>
<li><strong>Duration:</strong> 30-day period starting the day of inpatient discharge.</li>
<li><strong>Interactive Contact:</strong> Must occur within <strong>2 business days</strong> of discharge. Unsuccessful attempts must be logged.</li>
<li><strong>Medication Reconciliation:</strong> Must be completed on or before the face-to-face visit.</li>
<li><strong>Face-to-Face Visit Timeframes:</strong>
  <ul>
  <li>Moderate Complexity (CPT 99495): Within <strong>14 calendar days</strong>.</li>
  <li>High Complexity (CPT 99496): Within <strong>7 calendar days</strong>.</li>
  </ul>
</li>
</ul>

<h4>Validation Algorithm</h4>
<pre><code class="language-python">def validate_tcm_compliance(enrollment_id):
    tcm = fetch_tcm_record(enrollment_id)
    
    # Rule 1: Contact within 2 biz days
    days_to_contact = get_business_days(tcm.DischargeDate, tcm.FirstContactDate)
    if days_to_contact > 2: return False, "Failed Interactive Contact rule"
    
    # Rule 2: Med Rec before or on Visit Date
    if tcm.MedRecDate > tcm.VisitDate: return False, "Failed Med Rec rule"
    
    # Rule 3: Visit Timeframe based on Complexity
    days_to_visit = (tcm.VisitDate - tcm.DischargeDate).days
    if tcm.Complexity == 'MODERATE' and days_to_visit > 14: return False, "Failed 14-day rule"
    if tcm.Complexity == 'HIGH' and days_to_visit > 7: return False, "Failed 7-day rule"
    
    # Rule 4: Claim Submission
    days_since_discharge = (current_date - tcm.DischargeDate).days
    if days_since_discharge <= 29: return False, "Waiting for 30-day period to end"
    
    return True, "Ready for Billing"
</code></pre>

<h3>3.3. Remote Physiologic Monitoring (RPM)</h3>

<h4>Validation Algorithm</h4>
<pre><code class="language-python">def evaluate_rpm_billing(patient_id, current_month):
    data_days = count_active_device_transmission_days(patient_id, last_30_days)
    logs = fetch_time_logs(patient_id, current_month, 'RPM')
    
    total_management_mins = sum(log.DurationMinutes for log in logs)
    has_interactive = any(log.IsInteractiveContact for log in logs)
    
    billing_codes = []
    
    # Device Supply Logic
    if 2 <= data_days <= 15: billing_codes.append('99445')
    elif data_days >= 16: billing_codes.append('99454')
        
    # Management Logic (Only valid if interactive contact occurred)
    if has_interactive:
        if 10 <= total_management_mins <= 19:
            billing_codes.append('99470')
        elif total_management_mins >= 20:
            billing_codes.append('99457')
            # Additional 20 min increments
            additional_increments = (total_management_mins - 20) // 20
            for _ in range(additional_increments):
                billing_codes.append('99458')
                
    return billing_codes
</code></pre>

<h2>4. Cross-Program Concurrency & Guardrails</h2>
<ul>
<li><strong>Strict Time Partitioning:</strong> The API layer must reject any <code>CareTimeLog</code> entries with overlapping <code>StartTime</code> and <code>EndTime</code> for the same provider. </li>
<li><strong>Double Counting Protection:</strong> A single block of time cannot be tagged with multiple <code>ProgramType</code>s.</li>
<li><strong>TCM Exclusivity:</strong> TCM timeframes overlap with other services; system warnings must alert clinicians to prevent concurrent billing violations during a patient's post-discharge 30-day global period.</li>
</ul>
`;
