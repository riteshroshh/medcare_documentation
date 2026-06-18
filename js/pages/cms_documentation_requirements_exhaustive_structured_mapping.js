window.PAGES = window.PAGES || {};
window.PAGES['cms_documentation_requirements_exhaustive_structured_mapping'] = () => `
# CMS Documentation Requirements: Exhaustive Structured Mapping

Research complete. Here is the comprehensive mapping for Physical Therapy Oversight and all Care Management program templates.

**NOTE:** The directory \`C:\\Users\\rites\\Desktop\\medcare_ai\\backend\\data\\\` could not be accessed (permission timeout). The project directory \`c:\\Users\\rites\\Desktop\\newsnow\` is currently empty.

---

# PART 1: PHYSICAL THERAPY OVERSIGHT

## 1.1 Plan of Care (POC) Certification

### Current Evaluation Codes (CPT 97003 is OBSOLETE — deleted Jan 1, 2017)
| Code | Description |
|------|-------------|
| **97161** | PT Evaluation — Low Complexity |
| **97162** | PT Evaluation — Moderate Complexity |
| **97163** | PT Evaluation — High Complexity |
| **97164** | PT Re-evaluation (patient-specific, not time-driven) |

### Initial Certification (Updated Jan 1, 2025)
- **NEW Exception:** Physician/NPP signature on initial POC is **not required** if:
  1. Written order/referral from physician/NPP exists in medical record
  2. Evidence that POC was submitted to referring provider within **30 days** of initial evaluation is documented
- If no written order/referral exists → must still obtain signed/dated POC from physician/NPP
- Referring provider's failure to return signed POC will NOT result in denial (when exception criteria met)

### Recertification Requirements
- Required **at least every 90 days** from start of episode of care
- Must be **signed and dated** by physician/NPP (no exception for recerts)
- Recertify sooner if:
  - Significant change in patient condition or treatment plan
  - POC duration < 90 days and care continues
- **Failure to obtain timely recertification = claim denial** for services after expiration

### POC Required Elements
- Diagnosis (medical and treatment-based)
- Long-term treatment goals
- Type of services
- Amount of services
- Frequency of services
- Duration of services
- Medical necessity justification

## 1.2 Progress Note Requirements
- Required **every 10 treatment visits** OR **every 30 calendar days**, whichever comes first
- **Must be written by a licensed PT** (PTAs cannot write progress notes)
- Must include:
  - Evaluation of progress toward long-term goals
  - Objective measures justifying ongoing skilled intervention
  - Patient response to treatment

## 1.3 Functional Limitation Reporting (FLR)
- **DISCONTINUED effective January 1, 2019**
- G-codes and severity modifiers are **no longer required** on Medicare claims
- Documentation must still demonstrate medical necessity through clinical notes

## 1.4 Required Documentation Elements for Each Visit
| Element | Details |
|---------|---------|
| Functional Baseline | Objective measurements at initial evaluation |
| Short-term Goals | Measurable, time-bound intermediate objectives |
| Long-term Goals | Functional outcomes expected by discharge |
| Treatment Frequency | Number of visits per week |
| Treatment Duration | Expected total weeks/months of care |
| Medical Necessity | Why skilled services are required (not maintenance) |
| Total Treatment Time | Documented per visit |
| Timed Code Units | Must support 15-minute timed units billed |
| Patient Response | How patient responded to each session |

## 1.5 Common PT ICD-10 Codes (Current Specificity Required)

### Low Back Pain (M54.5 is DELETED — use specific codes)
| Code | Description |
|------|-------------|
| **M54.50** | Low back pain, unspecified |
| **M54.51** | Vertebrogenic low back pain |
| **M54.59** | Other low back pain |
| **M54.4-** | Lumbago with sciatica (if nerve root involvement) |

### Knee Osteoarthritis (M17.x — laterality required)
| Code | Description |
|------|-------------|
| **M17.0** | Bilateral primary OA of knee |
| **M17.11** | Unilateral primary OA, right knee |
| **M17.12** | Unilateral primary OA, left knee |

### Shoulder Impingement (M75.1 → now M75.4- for impingement)
| Code | Description |
|------|-------------|
| **M75.41** | Impingement syndrome, right shoulder |
| **M75.42** | Impingement syndrome, left shoulder |
| **M75.1-** | Rotator cuff tendinitis (if applicable) |

### Hip Fracture (S72.x — 7th character required)
| 7th Char | Meaning |
|----------|---------|
| **A** | Initial encounter (closed fracture) |
| **D** | Subsequent encounter (routine healing) |
| **S** | Sequela (late effect) |
| Example: **S72.001A** = Fracture of neck of right femur, initial |

### Stroke Rehabilitation
| Code | Use Case |
|------|----------|
| **I63.-** | Acute phase (inpatient only, NOT for outpatient PT) |
| **I69.-** | Sequelae — USE THIS for outpatient rehab (residual deficits: hemiplegia, gait abnormalities, etc.) |

## 1.6 Therapy Cap Thresholds & Exceptions

### Annual KX Modifier Thresholds
| Year | PT & SLP (Combined) | OT (Separate) |
|------|---------------------|----------------|
| **2024** | \$2,330 | \$2,330 |
| **2025** | \$2,410 | \$2,410 |

### KX Modifier Documentation Requirements
- Append **KX modifier** when claims exceed threshold
- Attests services are "reasonable and necessary"
- Documentation must include:
  - Clinical justification for services beyond threshold
  - Severity and complexity factors
  - Measurable progress toward goals
  - Intensity/frequency/duration alignment with medical necessity
- **No prior authorization required**

### Targeted Medical Review (MR) Threshold
- **\$3,000** for both PT/SLP and OT
- Triggers targeted review process (not automatic denial)
- In effect through **calendar year 2028**

### Required Modifiers (use alongside KX)
| Modifier | Purpose |
|----------|---------|
| **GP** | PT plan of care |
| **GO** | OT plan of care |
| **GN** | SLP plan of care |
| **CQ** | Services by PTA |
| **CO** | Services by OTA |

## 1.7 Supervision Level Documentation

### CMS Supervision Level Definitions
| Level | Definition | Practitioner Location |
|-------|-----------|----------------------|
| **General** | Overall direction/control; physical presence NOT required; available via phone/electronic means | Off-site, available by telecom |
| **Direct** | Physically present in office suite/immediate area; immediately available to assist; NOT required in same room | In the building/suite |
| **Personal** | In attendance in the room during the procedure | In the treatment room |

### 2025 Update for PTAs
| Setting | Pre-2025 | 2025+ |
|---------|----------|-------|
| Private Practice | Direct supervision required | **General supervision** now allowed |
| Hospital Outpatient | General supervision (since 2020) | General supervision |

### Regulatory References
- **42 CFR § 410.60** — Outpatient PT coverage conditions
- **42 CFR § 410.27** — Outpatient therapeutic services supervision
- **42 CFR § 485.713** — Conditions of participation for outpatient PT programs
- **State practice acts may be more restrictive** — always follow the stricter standard

---

# PART 2: CARE MANAGEMENT TEMPLATES

## 2.1 CHRONIC CARE MANAGEMENT (CCM)

### Eligibility
- **2+ chronic conditions** expected to last ≥12 months (or until death)
- Conditions must place patient at significant risk of death, acute exacerbation/decompensation, or functional decline

### Consent Documentation
- **Obtained once** — remains valid unless patient changes practitioners
- Must document patient was informed of:
  1. Availability of CCM services
  2. Applicable cost-sharing (deductibles/coinsurance)
  3. Only one practitioner can bill CCM per calendar month
  4. Right to stop services at any time (effective end of calendar month)
- Verbal or written consent acceptable
- Date of consent must be recorded

### CPT Code Matrix
| Code | Type | Time Threshold | Personnel | Add-on To |
|------|------|---------------|-----------|-----------|
| **99490** | Non-complex CCM (base) | First 20 min/month | Clinical staff | — |
| **99439** | Non-complex CCM (add-on) | Each additional 20 min | Clinical staff | 99490 |
| **99491** | Physician-driven CCM (base) | First 30 min/month | Physician/QHP personally | — |
| **99437** | Physician-driven CCM (add-on) | Each additional 30 min | Physician/QHP personally | 99491 |
| **99487** | Complex CCM (base) | 60 min/month | Clinical staff | — |
| **99489** | Complex CCM (add-on) | Each additional 30 min | Clinical staff | 99487 |

### Complex CCM (99487/99489) Additional Requirements
- Requires **moderate or high complexity MDM**
- Establishment or substantial revision of comprehensive care plan

### Care Plan Required Elements
| Element | Description |
|---------|-------------|
| Problem List | Comprehensive list of all chronic conditions |
| Expected Outcomes/Prognosis | Anticipated course for each condition |
| Measurable Treatment Goals | Specific, quantifiable objectives |
| Symptom Management | Plans for managing symptoms |
| Planned Interventions | Specific treatments and coordination activities |
| Medication Management | Reconciliation and ongoing management |
| Community/Social Resources | Referrals to community services |
| Responsible Individuals | Care team members identified |
| 24/7 Access Documentation | Evidence of 24/7 clinical staff access for urgent needs |

### Billing & Documentation Rules
- Billed **once per calendar month**
- Must use **certified EHR** for care plan documentation
- Time tracking log required: date, duration, description of activities
- Cannot double-count time with other billable services (TCM, prolonged E/M)
- Initiating visit required for new patients or those not seen within past year (AWV, E/M visit)
- Clinical staff services must meet "incident to" rules (42 CFR 410.26)

---

## 2.2 PRINCIPAL CARE MANAGEMENT (PCM)

### Eligibility
- **1 single complex chronic condition** expected to last ≥3 months
- Condition must place patient at **significant risk** of:
  - Hospitalization
  - Acute exacerbation/decompensation
  - Functional decline
  - Death

### CPT Code Matrix
| Code | Type | Time | Personnel |
|------|------|------|-----------|
| **99424** | PCM base (physician) | First 30 min/month | Physician/QHP |
| **99425** | PCM add-on (physician) | Each additional 30 min | Physician/QHP |
| **99426** | PCM base (staff) | First 30 min/month | Clinical staff (directed by physician/QHP) |
| **99427** | PCM add-on (staff) | Each additional 30 min | Clinical staff |

### Documentation Requirements
| Requirement | Details |
|-------------|---------|
| Disease Identification | Document the single complex chronic condition |
| Risk Justification | Why condition meets high-risk threshold |
| Condition-Specific Care Plan | Distinct from CCM comprehensive plan; focused on single condition |
| Medical Necessity for Intensity | Document why intensive management is needed (medication adjustments, complexity, coordination) |
| Time Tracking | Precise logs per calendar month, appropriate personnel type |
| Consent | Written or verbal, documented in medical record |
| Supervision | Clinical staff services (99426/99427) require direct supervision |

### Billing Rules
- **Cannot bill PCM and CCM for same patient in same calendar month**
- Billed once per calendar month when time threshold met
- Different providers may bill PCM and CCM for same patient if managing different conditions

---

## 2.3 TRANSITIONAL CARE MANAGEMENT (TCM)

### Eligibility
- Patient discharged from **inpatient facility** (hospital, SNF, inpatient rehab, psychiatric facility, etc.)
- Services cover the **30-day period** beginning on discharge date

### Three Required Components

#### 1. Interactive Contact
- **Within 2 business days** of discharge
- Must be direct contact: telephone, electronic, or face-to-face
- With patient and/or caregiver

#### 2. Medication Reconciliation
- Must be completed **no later than** the date of the face-to-face visit
- Formal review of discharge medications reconciled against current medication list
- Document date performed and provider signature

#### 3. Face-to-Face Visit
| Code | MDM Complexity | F2F Visit Timeframe |
|------|---------------|-------------------|
| **99495** | Moderate complexity | Within **14 calendar days** of discharge |
| **99496** | High complexity | Within **7 calendar days** of discharge |

### Required Documentation
| Element | Details |
|---------|---------|
| Discharge Date | Date patient was discharged from inpatient facility |
| Facility Type | Hospital, SNF, inpatient rehab, etc. |
| Contact Date & Method | Date and mode (phone, electronic, F2F) of interactive contact |
| F2F Visit Date | Date of the face-to-face visit |
| MDM Complexity | Documentation supporting moderate (99495) or high (99496) complexity |
| Medication Reconciliation | Evidence of review completion, date, provider signature |

### Billing Rules
- Reported **once per beneficiary** per 30-day post-discharge period
- Date of service = date of F2F visit (or 30th day per payer instructions)
- Cannot bill during global surgical period for same practitioner
- Cannot bill concurrently with care plan oversight or ESRD services
- Only physicians/QHPs (NPs, PAs, CNSs) may bill
- Clinical staff may assist with non-F2F components

---

## 2.4 REMOTE PATIENT MONITORING (RPM)

### Eligibility
- **Established patients** with acute or chronic condition
- Must use **FDA-cleared device** (Section 201(h) Federal Food, Drug, and Cosmetic Act)
- Device must **automatically collect and transmit** physiologic data (self-reported data insufficient)
- Must document patient consent and medical necessity

### CPT Code Matrix
| Code | Description | Key Requirement | Frequency |
|------|-------------|-----------------|-----------|
| **99453** | Initial device setup & patient education | One-time setup, education on device use | Billed once per episode of care |
| **99454** | Device supply & daily data transmission | **≥16 days of data** collected in 30-day period | Monthly |
| **99457** | Treatment management services (first 20 min) | Interactive communication (audio/video) with patient/caregiver | Monthly (min 20 min) |
| **99458** | Each additional 20 min treatment management | Must be billed with 99457 | Monthly |

### Required Documentation
| Element | Details |
|---------|---------|
| Device Identification | Specific device type, make/model |
| FDA Status Verification | Confirm device is FDA-cleared (typically 510(k)) |
| Data Transmission Method | How data is automatically transmitted |
| Days of Data Collected | Record showing ≥16 days of data transmission per 30-day period |
| Clinical Review of Data | Documentation of how data informed treatment decisions |
| Time Logs (99457/99458) | Start/stop times, description of interactive communication |
| Patient Interaction Notes | Content of patient/caregiver communications |
| Treatment Plan Integration | How monitoring data drives care plan modifications |

### 2026 Note
- New codes (e.g., 99470 for shorter monitoring durations) finalized for 2026
- Always verify current MPFS for exact service year

---

## 2.5 ADVANCE CARE PLANNING (ACP)

### CPT Codes & Time Requirements
| Code | Description | Minimum Time |
|------|-------------|-------------|
| **99497** | First 30 minutes of F2F ACP discussion | **≥16 minutes** |
| **99498** | Each additional 30 minutes (add-on) | ≥46 minutes total to bill |

### Required Documentation
| Element | Details |
|---------|---------|
| Voluntary Nature | Statement that ACP discussion was voluntary |
| Participants | Who was present (patient, family, surrogate, caregiver) |
| Discussion Content | Topics covered: advance directives (living wills, healthcare proxies, power of attorney), goals of care, treatment preferences |
| Patient Understanding | Assessment of patient's comprehension of discussed topics |
| Form Completion | Note if advance directive form completed (NOT required to bill) |
| Time Documentation | Total face-to-face time spent specifically on ACP |

### Billing Rules
- Time spent on ACP **cannot** be used to meet time requirements for other E/M services on same day
- Can be billed with E/M using **Modifier 25**
- No limit on frequency (though annually during AWV is typical)
- Available in office, hospital, home, and other settings

---

## 2.6 COGNITIVE ASSESSMENT & CARE PLAN (99483)

### Overview
- Comprehensive clinical visit for patients with signs of cognitive impairment
- Typically **50-60 minute** face-to-face appointment
- Requires **moderate or high complexity MDM**
- **Maximum frequency: once per 180 days** per provider

### Mandatory Requirement
- **Independent historian MUST be present** (spouse, caregiver, family member) to provide/corroborate history

### All Required Elements (ALL must be completed and documented)

| # | Element | Specific Requirements |
|---|---------|----------------------|
| 1 | **Cognition-Focused History** | Pertinent history from patient and independent historian |
| 2 | **Cognition-Focused Physical Exam** | Relevant neurological/physical examination |
| 3 | **Patient Assessment with Standardized Instruments** | Use validated tools (e.g., MMSE, MoCA, SLUMS) — document instrument used and results |
| 4 | **Functional Assessment (ADLs/IADLs)** | Basic ADLs (bathing, dressing, etc.) and Instrumental ADLs (finances, driving, etc.); includes decision-making capacity evaluation |
| 5 | **Dementia Staging** | Use standardized staging tools (FAST, CDR) |
| 6 | **Neuropsychiatric & Behavioral Evaluation** | Standardized screening for depression, anxiety, behavioral symptoms |
| 7 | **Safety Evaluation** | Home safety assessment, motor vehicle operation assessment |
| 8 | **Medication Reconciliation** | Review all current medications; screen for high-risk medications |
| 9 | **Caregiver Needs Assessment** | Identify caregiver(s); evaluate knowledge, needs, social supports, willingness/ability to provide care |
| 10 | **Advance Care Planning Discussion** | Develop, update, revise, or review advance care plan |
| 11 | **Written Care Plan Creation** | Formal care plan addressing neurocognitive/neuropsychiatric symptoms, functional limitations, community resource referrals |
| 12 | **Education & Support** | Initial education for patient and/or caregiver; share written care plan |

### Billing Rules
- Can be billed with E/M using **Modifier 25**
- Available via telehealth (permanently covered)
- Elements may be performed across multiple visits preceding final care planning session if documented
- All elements must be documented in medical record

---

# PART 3: CROSS-PROGRAM DOCUMENTATION MATRIX

| Requirement | CCM | PCM | TCM | RPM | ACP | 99483 |
|-------------|-----|-----|-----|-----|-----|-------|
| Patient Consent | ✅ One-time | ✅ | ❌ | ✅ | ❌ (voluntary) | ❌ |
| Care Plan | ✅ Comprehensive | ✅ Condition-specific | ❌ | ❌ | ❌ | ✅ Cognitive-specific |
| Time Tracking | ✅ Required | ✅ Required | ❌ | ✅ Required | ✅ F2F time | ❌ (element-based) |
| EHR Required | ✅ | Recommended | Recommended | Recommended | ❌ | ❌ |
| Monthly Billing | ✅ | ✅ | ❌ (once/30-day) | ✅ | N/A | N/A |
| F2F Visit Required | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Independent Historian | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Mandatory |
| Medication Reconciliation | ✅ In care plan | Optional | ✅ Required | ❌ | ❌ | ✅ Required |

# PART 4: MUTUAL EXCLUSIVITY RULES

| Service A | Service B | Same Patient Same Month? |
|-----------|-----------|-------------------------|
| CCM (99490/99491) | PCM (99424-99427) | ❌ NOT allowed |
| CCM | TCM | ❌ NOT allowed (during TCM 30-day period) |
| CCM | RPM | ✅ Allowed (don't double-count time) |
| PCM | RPM | ✅ Allowed |
| ACP | E/M | ✅ Allowed (Modifier 25) |
| 99483 | E/M | ✅ Allowed (Modifier 25) |
| TCM | Global surgical period | ❌ NOT allowed (same practitioner) |

---

This is the exhaustive mapping based on current CMS guidelines (2024-2025, with 2025 updates where applicable). Key regulatory references: Medicare Benefit Policy Manual Chapter 15, 42 CFR §§ 410.27, 410.60, 410.26, 485.713.
</SYSTEM_MESSAGE>
`;
