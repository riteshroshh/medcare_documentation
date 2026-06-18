window.PAGES = window.PAGES || {};
window.PAGES['medcare_ai_specialty_coding_template_validation_engine_e9_technical_design'] = () => `
# MedCare AI: Specialty Coding & Template Validation Engine (E9 Technical Design)

## Document Control
**Version:** 1.0.0-draft
**Author:** Specialty Coding Specialist (MedCare AI)
**Status:** Under Review
**Classification:** Internal Confidential / E9 Architecture

---

## 1. Executive Summary
This document outlines the architectural schemas, validation engines, and rulesets for specialty-specific clinical templates within the MedCare AI ecosystem. The system is designed to enforce strict compliance with CMS Medicare Learning Network (MLN) directives, Local Coverage Determinations (LCDs), and CDC ICD-10-CM Official Guidelines. 

The validation engine actively parses unstructured clinical narratives and structured data inputs to auto-flag medical necessity gaps, enforce the 8-minute rule, drive ICD-10 specificity, and ensure audit-proof documentation for Physical Therapy, Wound Care, Endocrinology (DSMT), and Internal Medicine.

---

## 2. Specialty-Specific Template Schemas

### 2.1 Outpatient Rehabilitation (Physical Therapy)
**Reference:** CMS MLN905365 (Complying with Outpatient Rehab Documentation)

**Schema Definition:** \`RehabTherapyEncounter_v2\`
- **Initial Evaluation / Plan of Care (POC):**
  - \`Diagnoses\`: Medical and treatment diagnoses.
  - \`LongTermGoals\`: Must be measurable, functional, and include a timeframe.
  - \`FrequencyDuration\`: e.g., "3x/week for 4 weeks".
  - \`CertificationStatus\`: Boolean flag, must trigger recertification workflow at 90 days or end of POC.
- **Treatment Notes (Per Visit):**
  - \`InterventionLog\`: Array of interventions linked to CPT codes.
  - \`TimeTracking\`: 
    - \`TotalTreatmentTime\`: Integer (minutes).
    - \`TotalTimedCodeTime\`: Integer (minutes). Must satisfy the **CMS 8-Minute Rule** algorithm.
- **Progress Reports:**
  - \`ReportingInterval\`: Triggered every 10th visit. 
  - \`ObjectiveMeasurements\`: Required delta against initial baseline.

**Validation Engine Rules:**
- \`RULE_PT_001\`: If \`TotalTimedCodeTime\` / 15 yields \$U\$ units, check remainder \$R\$. If \$R \\ge 8\$, \$U = U + 1\$. Total billed units cannot exceed \`TotalTimedCodeTime\` allowance.
- \`RULE_PT_002\`: Block billing if \`ProgressReport\` is missing on \$N \\% 10 == 0\$ visit.

### 2.2 Wound Care Management
**Reference:** CMS LCD Article A53296 (Wound Care)

**Schema Definition:** \`WoundCareEncounter_v3\`
- **Wound Assessment (Per Wound):**
  - \`WoundID\`: Unique identifier per site.
  - \`AnatomicalLocation\`: Must map to specific ICD-10 laterality.
  - \`Dimensions\`: \`Length_cm\`, \`Width_cm\`, \`Depth_cm\`. (Mandatory).
  - \`WoundStage\`: Integer 1-4, Unstageable, or DTI (for pressure ulcers).
  - \`TissueTypes\`: Array of \`Necrotic\`, \`Slough\`, \`Granulation\`, \`Epithelial\`.
- **Debridement Intervention:**
  - \`DebridementType\`: \`Selective\` (e.g., 97597) vs \`Non-Selective\` vs \`Surgical\` (e.g., 11042).
  - \`DepthOfTissueRemoved\`: \`Epidermis/Dermis\`, \`Subcutaneous\`, \`Muscle/Fascia\`, \`Bone\`.

**Validation Engine Rules:**
- \`RULE_WND_001\`: Debridement codes (11042-11047) require explicit \`DepthOfTissueRemoved\` mapping to SubQ, Muscle, or Bone. Reject if only "fibrinous slough" is documented.
- \`RULE_WND_002\`: Active debridement requires paired documentation of \`Dimensions\` pre- and post-procedure.

### 2.3 Endocrinology & Diabetes Self-Management Training (DSMT)
**Reference:** CMS MLN909381 (Medicare DSMT)

**Schema Definition:** \`DSMT_Encounter_v1\`
- **Referral / Order Intake:**
  - \`PhysicianOrder\`: Required entity. Must contain NPI and date.
  - \`TrainingType\`: \`Initial\` (10 hours max) vs \`FollowUp\` (2 hours max).
- **Curriculum Tracking:**
  - \`TopicsCovered\`: Array Enum [\`Nutrition\`, \`Meds\`, \`Monitoring\`, \`Complications\`, \`Psychosocial\`].
  - \`Modality\`: \`Individual\` (G0108) vs \`Group\` (G0109).
- **Time/Duration:**
  - \`MinutesSpent\`: Must increment accurately to track against the 12-month limit.

**Validation Engine Rules:**
- \`RULE_END_001\`: If \`TrainingType\` == \`Initial\` and aggregate \`MinutesSpent\` > 600 within 12 months, flag as non-covered.
- \`RULE_END_002\`: Group modality (G0109) requires minimum 2 participants documented in the scheduling engine.

### 2.4 Internal Medicine & Primary Care
**Schema Definition:** \`PrimaryCareEncounter_v4\`
- **Evaluation and Management (E/M):**
  - \`MedicalDecisionMaking_Level\`: Computed via dynamic array of \`DiagnosesTreated\`, \`DataReviewed\`, \`RiskOfComplications\`.
  - \`TimeSpent\`: Alternative to MDM. \`FaceToFaceTime\` + \`NonFaceToFaceTime\` (same day).
- **Preventive Care:**
  - \`AWV_Elements\`: Array of required HRA, depression screen, cognitive assessment.

**Validation Engine Rules:**
- \`RULE_IM_001\`: E/M Leveling (99202-99215) must satisfy 2 out of 3 MDM elements OR meet the time threshold.
- \`RULE_IM_002\`: Prevent billing 99211 if a provider performs a medically necessary E/M on the same date.

---

## 3. Medical Necessity Flaggers (MNF Engine)
The MNF Engine acts as a pre-claim scrubber. It utilizes an NLP pipeline to cross-reference documented clinical indications against CMS Local/National Coverage Determinations (LCD/NCD).

- **MNF-Diagnostic:** Scans orders (e.g., MRI Lumbar Spine) and ensures the linked ICD-10 code is on the approved "Covered Diagnoses" list for that specific CPT.
- **MNF-Frequency:** Tracks utilization limits (e.g., DSMT hours, PT visits before progress note, Wound Care debridement frequency).
- **MNF-Specificity:** Rejects "Unspecified" codes when the note contains specific descriptors (e.g., if the text says "Left leg ulcer", flags an error if the coder selects an unspecified leg ulcer code).

---

## 4. ICD-10 Recommendation & Sequencing Algorithms
**Reference:** CDC ICD-10-CM Official Guidelines for Coding and Reporting

The ICD-10 Recommendation Engine (IRE) uses a hierarchical graph structure and vector embeddings to suggest optimal coding pathways.

### 4.1 Laterality & Specificity Resolution
- **Algorithm:** The NLP parses anatomical keywords and maps them to a SNOMED-CT ontology, traversing to the highest specificity leaf node in ICD-10.
- **Action:** If a user inputs \`M54.5\` (Low back pain) but the text mentions \`Sciatica, left side\`, the engine auto-recommends \`M54.42\` (Lumbago with sciatica, left side).

### 4.2 Excludes1 and Excludes2 Conflict Detection
- **Algorithm:** \`O(1)\` hash map lookup against the CDC Excludes list. 
- **Action:** If Code A and Code B are added to the encounter, and Code B is an \`Excludes1\` for Code A, an absolute block is generated preventing dual assignment.

### 4.3 "Code First" / Sequencing Logic
- **Algorithm:** Dependency graph traversal.
- **Action:** For manifestations (e.g., Diabetic Neuropathy), the system forces the etiology code (e.g., E11.40 Type 2 diabetes mellitus with diabetic neuropathy) to sequence at \`Index 0\` (Primary), while the manifestation (if a separate code is needed) goes to \`Index 1\`.

---

## 5. Architectural Implementation Next Steps
1. **Model Training:** Ingest the provided CMS MLN PDFs and CDC guidelines into the vector database for RAG-assisted clinical decision support.
2. **FHIR Integration:** Map schemas (\`RehabTherapyEncounter\`, \`WoundCareEncounter\`) to HL7 FHIR R4 \`Encounter\`, \`Observation\`, and \`Condition\` resources.
3. **Rule Deployment:** Transpile the Validation Engine Rules into a scalable Rules Engine (e.g., Drools or a custom WASM-based AST evaluator) for real-time validation in the EMR frontend.

---
*Generated by MedCare AI Specialty Coding Specialist Subsystem.*
</SYSTEM_MESSAGE>
`;
