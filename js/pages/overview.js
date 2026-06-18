window.PAGES = window.PAGES || {};
window.PAGES['overview'] = () => `
<div class="page-chip">medcare_ai / overview</div>


# Project MedCare: Internal Brief

**Author:** Ritesh Roshan

MedCare AI is an advanced, AI-powered compliance and documentation engine designed specifically to eliminate the cognitive overhead of clinical documentation for physicians. By operating at the intersection of Large Language Models and deterministic clinical heuristics, MedCare AI ensures that every patient encounter is instantly translated into a robust, CMS-compliant, and audit-ready clinical narrative.

---

### Objective
Create a documentation assistant that follows CMS and payer documentation guidelines and helps providers generate compliant clinical notes while reducing documentation burden.

### Key Features
#### Clinical Note Generation
* Progress Notes
* History & Physical (H&P)
* Consultation Notes
* Discharge Summaries
* Nursing Facility Notes
* Annual Wellness Visits
* CCM, PCM, TCM, RPM, ACP, and Cognitive Assessment documentation

#### Structured Data Input
Providers should be able to enter basic information such as:
* Chief Complaint
* HPI (History of Present Illness)
* Diagnoses
* Medications
* Lab Results
* Assessment & Plan
* Vital Signs
* ROS (Review of Systems) and Physical Exam findings

#### CMS Compliance Validation
The tool reviews documentation against CMS guidelines and identifies:
* Missing HPI elements
* Incomplete Assessment & Plan
* Missing treatment goals
* Lack of medical necessity
* Insufficient documentation to support the selected E/M level
* Missing time documentation when applicable
* Missing CCM/PCM/TCM/RPM requirements

#### Coding Assistance
Based on the documentation, the tool should:
* Suggest appropriate ICD-10 diagnosis codes
* Suggest CPT/HCPCS codes
* Recommend E/M level (99202–99215, 99304–99310, etc.) based on MDM / time
* Provide justification for the recommended code level
* Flag documentation deficiencies that may result in downcoding or audit findings

#### Audit Readiness
The system generates:
* MDM scoring analysis
* Risk level determination
* Audit compliance score
* Documentation deficiency report
* Suggested improvements before note finalization

#### Specialty-Specific Templates
Support for:
* Internal Medicine
* Cardiology
* Pulmonology
* Nursing Facility Medicine
* Wound Care
* Endocrinology
* Physical Therapy oversight

#### AI Recommendations
The tool proactively suggests:
* Additional diagnoses supported by documentation
* Missing chronic conditions
* Additional documentation needed to support higher-complexity visits
* Preventive services that may be due

### Expected Outcome
The provider enters basic clinical information, and the system generates a CMS-compliant note, recommends the appropriate CPT and ICD-10 codes, determines the supported E/M level, identifies documentation gaps, and provides an audit-ready final note.

---

## Original Authenticated Guidelines & Documentation

Here are the original, authenticated CMS and AMA links to the guidelines and documentation required for this project:

#### Evaluation and Management (E/M) Core Guidelines
* **AMA CPT 2023 E/M Descriptors and Guidelines** (Primary source for MDM grids and time thresholds): [View PDF](https://www.ama-assn.org/system/files/2023-e-m-descriptors-guidelines.pdf)
* **CMS E/M Services Provider Compliance Tips & Documentation Checklists:** [View Guidelines](https://www.cms.gov/training-education/medicare-learning-networkr-mln/compliance/medicare-provider-compliance-tips/evaluation-management-services)

#### Care Management & Remote Monitoring
* **Chronic Care Management (CCM) and Principal Care Management (PCM) MLN Booklet:** [View PDF](https://www.cms.gov/files/document/chroniccaremanagement.pdf)
* **Transitional Care Management (TCM) Services MLN Booklet:** [View PDF](https://www.cms.gov/files/document/mln908628-transitional-care-management-services.pdf)
* **Telehealth & Remote Physiologic Monitoring (RPM) MLN Booklet:** [View PDF](https://www.cms.gov/files/document/mln901705-telehealth-remote-monitoring.pdf)

#### Preventive and Cognitive Services
* **Annual Wellness Visit (AWV) Checklist and Components:** [View Checklist](https://www.cms.gov/medicare/coverage/preventive-services/medicare-wellness-visits/annual-wellness-visit)
* **Advance Care Planning (ACP) MLN Fact Sheet:** [View PDF](https://www.cms.gov/files/document/mln-advanced-care-planning.pdf)
* **Cognitive Assessment and Care Plan Services (CPT 99483) Billing and Clinical Elements:** [View Article](https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=59036)

#### Therapy, ICD-10, and Specialty Specifics
* **Outpatient Rehabilitation Therapy Documentation** (Physical Therapy/Therapy Caps/CQ Modifiers): [View PDF](https://www.cms.gov/files/document/mln905365-complying-outpatient-rehabilitation-therapy-documentation-requirements.pdf)
* **ICD-10-CM Official Guidelines for Coding and Reporting** (CDC/CMS): [View Guidelines](https://stacks.cdc.gov/view/cdc/250974)
* **Wound Care and Debridement Coding Requirements** (CPT 97597, 97598): [View Article](https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=53296)
* **Medicare Diabetes Self-Management Training (DSMT) Guidelines:** [View PDF](https://www.cms.gov/files/document/mln909381-provider-information-medicare-diabetes-self-management-training.pdf)
`;
