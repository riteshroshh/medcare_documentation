window.PAGES = window.PAGES || {};
window.PAGES['medcare_ai_e_m_engine_architecture_scoring_logic'] = () => `
# MedCare AI: E/M Engine Architecture & Scoring Logic
*Author: E/M Engine Architect*

## 1. Architectural Overview
The Evaluation and Management (E/M) Scoring Engine computes the appropriate CPT® codes based on the AMA 2023 Guidelines and CMS compliance rules. The engine evaluates encounters using a dual-pathway algorithm: **Time-Based Selection** and **Medical Decision Making (MDM)-Based Selection**, prioritizing the pathway that yields the highest compliant code. A natural language processing (NLP) Documentation Validation Pipeline runs asynchronously to ensure medical necessity and detect incomplete clinical elements prior to final code assignment.

## 2. Pathway A: Time-Based Scoring Algorithm
For outpatient/office visits (9920x / 9921x), time operates as a continuous sum of face-to-face and non-face-to-face provider activities on the date of encounter. For Nursing Facility services (9930x / 9931x), time thresholds act as exact baseline minimums.

### Office or Other Outpatient Services (99202–99215)
| CPT Code | Total Time Threshold (Minutes) | Notes |
| :--- | :--- | :--- |
| **99202** (New) | 15–29 | |
| **99203** (New) | 30–44 | |
| **99204** (New) | 45–59 | |
| **99205** (New) | 60–74 | Use prolonged service code for +15 min beyond max |
| **99212** (Est.) | 10–19 | 99211 is N/A for time |
| **99213** (Est.) | 20–29 | |
| **99214** (Est.) | 30–39 | |
| **99215** (Est.) | 40–54 | Use prolonged service code for +15 min beyond max |

### Nursing Facility Services (99304–99310)
| Initial Care (New/Admit) | Time Threshold | Subsequent Care | Time Threshold |
| :--- | :--- | :--- | :--- |
| **99304** | 25 min | **99307** | 10 min |
| **99305** | 35 min | **99308** | 15 min |
| **99306** | 45 min | **99309** | 25 min |
| | | **99310** | 45 min |

*Algorithm Logic:* \`if (BillingStrategy == TIME) { return MapTimeThresholdToCPT(TotalEncounterTime); }\`

## 3. Pathway B: MDM-Based Scoring Algorithm
The core MDM engine operates on a strict **"Two-of-Three" Rule**. It evaluates three independent dimensions:
1. \`ComplexityOfProblems\`
2. \`ComplexityOfData\`
3. \`RiskOfManagement\`

To return a specific MDM Level (Straightforward, Low, Moderate, High), the condition \`count(Dimensions >= TargetLevel) >= 2\` must evaluate to \`True\`.

### 3.1. Number and Complexity of Problems Addressed
- **Minimal:** 1 self-limited/minor problem.
- **Low:** 2+ minor problems; OR 1 stable chronic illness; OR 1 acute, uncomplicated illness/injury.
- **Moderate:** 1+ chronic illnesses with exacerbation, progression, or side effects; OR 2+ stable chronic illnesses; OR 1 undiagnosed new problem with uncertain prognosis; OR 1 acute illness with systemic symptoms.
- **High:** 1+ chronic illnesses with severe exacerbation; OR 1 acute/chronic illness or injury posing a threat to life or bodily function.

### 3.2. Amount and/or Complexity of Data to be Reviewed and Analyzed
Segmented into three categories: Category 1 (Tests, Documents, Independent Historian), Category 2 (Independent Interpretation), Category 3 (Discussion of Management).
- **Minimal/None:** Fails to meet Limited.
- **Limited:** Meets requirements in \$\\ge\$ 1 category (e.g., review of 2 prior documents/tests, or use of independent historian).
- **Moderate:** Meets requirements in \$\\ge\$ 1 of 3 categories (e.g., review/order of 3 distinct tests/documents, or independent interpretation).
- **Extensive:** Meets requirements in \$\\ge\$ 2 of 3 categories with higher volume thresholds.

### 3.3. Risk of Complications and/or Morbidity or Mortality
- **Minimal:** Minimal risk from testing/treatment.
- **Low:** Low risk (e.g., over-the-counter drugs, minor surgery without risk factors).
- **Moderate:** Moderate risk (e.g., prescription drug management, minor surgery with patient risk factors, major surgery without risk factors).
- **High:** High risk (e.g., drug therapy requiring intensive monitoring, elective major surgery with risk factors, emergency major surgery, decision regarding hospitalization, DNR/de-escalation of care).

## 4. Documentation Validation Logic (Compliance Subsystem)
To align with CMS Compliance guidelines and CERT audit rules, our validation pipeline scans the generated documentation for structural and semantic completeness before code assignment.

### 4.1. Missing HPI & Medical Necessity Engine
- **Logic:** While the 2023 AMA rules no longer strictly tabulate specific HPI elements (like location or duration) to define the service level, the HPI remains the algorithmic foundation for establishing *Medical Necessity*.
- **Validation Pipeline:** The NLP module scans the \`Chief Complaint\` and \`History of Present Illness\` sections. If the extracted clinical narrative yields only low-entropy tokens (e.g., \`["doing well", "routine follow-up"]\`) without contextualizing symptomatic details, exacerbations, or chronic disease status, the system triggers a threshold flag:
  \`Exception: CMS_COMPLIANCE_WARNING -> Vague or Missing HPI. Insufficient narrative to support Medical Necessity.\`

### 4.2. Incomplete Assessment & Plan (A&P) Verification
- **Logic:** The A&P node is parsed to ensure it logically maps to the computed \`ComplexityOfProblems\` and \`RiskOfManagement\`.
- **Validation Pipeline:**
  - \`Diagnoses Integrity Check\`: Ensures every problem accounted for in MDM has a distinct, fully specified clinical impression (verifiable via ICD-10 crosswalk).
  - \`Actionable Plan Check\`: Ensures every documented diagnosis is linked to a management vector (e.g., "monitor", "prescribe", "refer", "counsel").
  - \`Cloned Note Detection\`: Evaluates text-similarity hashes against historical notes to prevent CMS "cloned note" compliance violations.
  - Failure in linkage triggers a hard stop:
    \`Exception: CMS_COMPLIANCE_ERROR -> Incomplete A&P. Unable to substantiate clinical work performed.\`

### 5. Integration Code Stub
\`\`\`python
def calculate_em_code(visit_context):
    validation_errors = validate_documentation(visit_context.clinical_doc)
    if validation_errors:
        return raise_provider_query(validation_errors)
        
    mdm_level = calculate_mdm(visit_context.problems, visit_context.data, visit_context.risk)
    time_level = calculate_time_thresholds(visit_context.total_time, visit_context.setting)
    
    # Billing Optimizer Pathway
    selected_level = max(mdm_level, time_level)
    return map_level_to_cpt(selected_level, visit_context.setting, visit_context.patient_status)
\`\`\`
</SYSTEM_MESSAGE>
`;
