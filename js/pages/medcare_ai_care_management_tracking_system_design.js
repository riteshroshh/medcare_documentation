window.PAGES = window.PAGES || {};
window.PAGES['medcare_ai_care_management_tracking_system_design'] = () => `
# MedCare AI: Care Management Tracking System Design

## 1. Overview
The Care Management Tracking System manages state machines, time-tracking algorithms, and compliance validations for Chronic Care Management (CCM), Principal Care Management (PCM), Transitional Care Management (TCM), and Remote Physiologic Monitoring (RPM). This design aligns with CMS regulations (including updates effective Jan 1, 2026) to ensure auditable, complaint billing.

## 2. Core Data Models

### 2.1. Program Enrollment (\`CareProgramEnrollment\`)
Tracks patient participation across care management programs.
- \`EnrollmentID\` (UUID)
- \`PatientID\` (UUID)
- \`ProgramType\` (Enum: \`CCM\`, \`PCM\`, \`TCM\`, \`RPM\`)
- \`Status\` (Enum: \`ELIGIBLE\`, \`CONSENT_PENDING\`, \`ACTIVE\`, \`COMPLETED\`, \`REVOKED\`)
- \`ConsentDate\` (Timestamp)
- \`QualifyingConditions\` (List of ICD-10 codes)
- \`StartDate\` / \`EndDate\` (Timestamps)

### 2.2. Time Entry (\`CareTimeLog\`)
Centralized time tracking log to prevent double-counting across programs.
- \`LogID\` (UUID)
- \`PatientID\` (UUID)
- \`ProviderID\` / \`Role\` (UUID / Enum)
- \`ProgramType\` (Enum: \`CCM\`, \`PCM\`, \`TCM\`, \`RPM\`)
- \`StartTime\` / \`EndTime\` (Timestamps)
- \`DurationMinutes\` (Integer)
- \`ActivityDescription\` (String - highly specific per CMS rules)
- \`IsInteractiveContact\` (Boolean - required for RPM/TCM)
- \`BilledStatus\` (Enum: \`UNBILLED\`, \`BILLED\`)

---

## 3. Program Specific Algorithms and State Machines

### 3.1. Chronic Care Management (CCM) & Principal Care Management (PCM)

#### Compliance Checklist
- **Consent:** Documented verbal or written consent.
- **Conditions:** 
  - **CCM:** 2+ chronic conditions lasting >12 months.
  - **PCM:** 1 high-risk chronic condition lasting >3 months.
- **Care Plan:** Comprehensive (CCM) or Disease-specific (PCM) accessible to the patient.
- **Time Thresholds (Per Calendar Month):** 
  - CCM: ≥ 20 mins clinical staff time.
  - PCM: ≥ 30 mins care management time.

#### State Machine
\`ELIGIBLE\` → \`CONSENT_OBTAINED\` → \`PLAN_CREATED\` → \`ACTIVE_MONTH\` → \`BILLING_READY\` → \`BILLED\`

#### Time-Tracking Algorithm (Runs nightly via Cron)
\`\`\`python
def check_ccm_pcm_billing_eligibility(patient_id, month, program_type):
    logs = fetch_time_logs(patient_id, month, program_type)
    total_minutes = sum(log.DurationMinutes for log in logs)
    
    threshold = 20 if program_type == 'CCM' else 30
    has_consent = check_consent_status(patient_id, program_type)
    has_care_plan = check_care_plan_exists(patient_id, program_type)
    
    if total_minutes >= threshold and has_consent and has_care_plan:
        return True, total_minutes
    return False, total_minutes
\`\`\`

---

### 3.2. Transitional Care Management (TCM)

#### Compliance Checklist
- **Duration:** 30-day period starting the day of inpatient discharge.
- **Interactive Contact:** Must occur within **2 business days** of discharge. Unsuccessful attempts must be logged.
- **Medication Reconciliation:** Must be completed on or before the face-to-face visit.
- **Face-to-Face Visit Timeframes:**
  - Moderate Complexity (CPT 99495): Within **14 calendar days**.
  - High Complexity (CPT 99496): Within **7 calendar days**.

#### State Machine
\`DISCHARGED\` → \`INTERACTIVE_CONTACT_PENDING\` (Loop: \`ATTEMPTED\` → \`RETRY\`) → \`CONTACT_SUCCESS\` → \`MED_REC_PENDING\` → \`FACE_TO_FACE_PENDING\` → \`VISIT_COMPLETED\` → \`WAITING_FOR_30_DAYS\` → \`BILLING_READY\`

#### Validation Algorithm
\`\`\`python
def validate_tcm_compliance(enrollment_id):
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
\`\`\`

---

### 3.3. Remote Physiologic Monitoring (RPM)

#### Compliance Checklist
- **Device:** FDA-defined medical device with automated transmission (no manual entry).
- **Time/Data Thresholds (2026 CMS Rules):**
  - Device Supply (Short): 2–15 days of data (CPT 99445).
  - Device Supply (Standard): 16–30 days of data (CPT 99454).
  - Management Time (Short): 10–19 mins/month (CPT 99470).
  - Management Time (Standard): ≥20 mins/month (CPT 99457).
- **Interactive Contact:** At least 1 real-time, synchronous communication per month.

#### State Machine
\`DEVICE_PRESCRIBED\` → \`CONSENT_OBTAINED\` → \`DEVICE_SETUP_BILLED\` (99453) → \`ACTIVE_MONITORING\` → \`DATA_THRESHOLDS_MET\` → \`BILLING_READY\`

#### Validation Algorithm
\`\`\`python
def evaluate_rpm_billing(patient_id, current_month):
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
\`\`\`

---

## 4. Cross-Program Concurrency & Guardrails
- **Strict Time Partitioning:** The API layer must reject any \`CareTimeLog\` entries with overlapping \`StartTime\` and \`EndTime\` for the same provider. 
- **Double Counting Protection:** A single block of time cannot be tagged with multiple \`ProgramType\`s. If a clinician spends 40 minutes with a patient doing CCM and RPM, they must explicitly split the logs (e.g., 20 mins CCM, 20 mins RPM).
- **TCM Exclusivity:** TCM timeframes overlap with other services; system warnings must alert clinicians to prevent concurrent billing violations during a patient's post-discharge 30-day global period.
</SYSTEM_MESSAGE>
`;
