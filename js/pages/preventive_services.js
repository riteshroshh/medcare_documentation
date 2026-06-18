window.PAGES = window.PAGES || {};
window.PAGES['preventive_services'] = () => `
<div class="page-chip">medcare_documentation / preventive_services</div>
<h1>Preventive & Cognitive Services</h1>

<h2>1. Executive Summary</h2>
<p>This document defines the core data structures, JSON schemas, and AI validation algorithms required to automatically verify compliance for three critical Medicare services: </p>
<ol>
<li><strong>Annual Wellness Visit (AWV)</strong> &mdash; Initial (G0438) &amp; Subsequent (G0439)</li>
<li><strong>Advance Care Planning (ACP)</strong> &mdash; CPT 99497 &amp; 99498</li>
<li><strong>Cognitive Assessment &amp; Care Plan</strong> &mdash; CPT 99483</li>
</ol>
<p>The objective is to establish an automated pipeline utilizing LLM-based entity extraction and deterministic logic to enforce Centers for Medicare &amp; Medicaid Services (CMS) documentation requirements.</p>

<hr>

<h2>2. Annual Wellness Visit (AWV) Validation</h2>

<h3>2.1 JSON Schema</h3>
<p>The payload must capture all core clinical components defined by CMS for an AWV.</p>

<pre><code class="language-json">{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AWV_Encounter",
  "type": "object",
  "properties": {
    "encounter_id": { "type": "string" },
    "is_initial_awv": { "type": "boolean" },
    "hra_completed": { "type": "boolean", "description": "Health Risk Assessment administered" },
    "history_reviewed": {
      "type": "object",
      "properties": {
        "medical_history": { "type": "boolean" },
        "family_history": { "type": "boolean" }
      },
      "required": ["medical_history", "family_history"]
    },
    "providers_list_updated": { "type": "boolean" },
    "vitals": {
      "type": "object",
      "properties": {
        "height": { "type": "number" },
        "weight": { "type": "number" },
        "bmi": { "type": "number" },
        "blood_pressure": { "type": "string" }
      },
      "required": ["height", "weight", "bmi", "blood_pressure"]
    },
    "cognitive_assessment": { "type": "boolean" },
    "depression_screening": { "type": "boolean" },
    "functional_ability": {
      "type": "object",
      "properties": {
        "adls_iadls_reviewed": { "type": "boolean" },
        "fall_risk_assessed": { "type": "boolean" },
        "hearing_assessed": { "type": "boolean" },
        "home_safety_assessed": { "type": "boolean" }
      },
      "required": ["adls_iadls_reviewed", "fall_risk_assessed", "hearing_assessed", "home_safety_assessed"]
    },
    "screening_schedule_5_10_yr": { "type": "boolean" },
    "risk_factors_interventions": { "type": "array", "items": { "type": "string" } },
    "personalized_health_advice": { "type": "boolean" }
  },
  "required": [
    "encounter_id", "is_initial_awv", "hra_completed", "history_reviewed", 
    "providers_list_updated", "vitals", "cognitive_assessment", "depression_screening", 
    "functional_ability", "screening_schedule_5_10_yr", "risk_factors_interventions", "personalized_health_advice"
  ]
}</code></pre>

<h3>2.2 AI Verification Algorithm (<code>AWV_Compliance_Check</code>)</h3>

<pre><code class="language-python">def verify_awv_compliance(encounter_data: dict) -> dict:
    compliance_flags = []
    is_compliant = True

    # 1. HRA & History Check
    if not encounter_data['hra_completed']:
        compliance_flags.append("MISSING: Health Risk Assessment")
        is_compliant = False
        
    if not all(encounter_data['history_reviewed'].values()):
        compliance_flags.append("MISSING: Complete Medical/Family History")
        is_compliant = False

    # 2. Vitals Check (Allowing exception for physical limitations if documented)
    missing_vitals = [k for k, v in encounter_data['vitals'].items() if v is None]
    if missing_vitals:
        compliance_flags.append(f"MISSING VITALS: {', '.join(missing_vitals)}")
        is_compliant = False

    # 3. Functional & Safety Assessment Check
    func_data = encounter_data['functional_ability']
    if not all(func_data.values()):
        missing_func = [k for k, v in func_data.items() if not v]
        compliance_flags.append(f"MISSING FUNCTIONAL/SAFETY ELEMS: {', '.join(missing_func)}")
        is_compliant = False

    # 4. Care Plan Elements
    if not encounter_data['screening_schedule_5_10_yr']:
        compliance_flags.append("MISSING: 5-10 Year Screening Schedule")
        is_compliant = False

    return {
        "status": "PASS" if is_compliant else "FAIL",
        "deficiencies": compliance_flags
    }
</code></pre>

<hr>

<h2>3. Advance Care Planning (ACP) Validation</h2>

<h3>3.1 JSON Schema</h3>
<p>To map to CPT 99497 (first 30 mins) and 99498 (additional 30 mins), time tracking and explicit participant documentation are strictly enforced.</p>

<pre><code class="language-json">{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ACP_Encounter",
  "type": "object",
  "properties": {
    "encounter_id": { "type": "string" },
    "voluntary_nature_documented": { "type": "boolean" },
    "participants": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1
    },
    "discussion_content_summary": { "type": "string", "minLength": 10 },
    "face_to_face_time_minutes": { "type": "integer", "minimum": 16 },
    "forms_completed": { "type": "boolean" },
    "is_repeat_service": { "type": "boolean" },
    "change_in_health_status_documented": { "type": "boolean" }
  },
  "required": [
    "encounter_id", "voluntary_nature_documented", "participants", 
    "discussion_content_summary", "face_to_face_time_minutes"
  ]
}</code></pre>

<h3>3.2 AI Verification Algorithm (<code>ACP_Compliance_Check</code>)</h3>

<pre><code class="language-python">def verify_acp_compliance(encounter_data: dict) -> dict:
    compliance_flags = []
    
    # 1. Voluntary Nature
    if not encounter_data['voluntary_nature_documented']:
        compliance_flags.append("MISSING: Documentation that ACP was voluntary.")
    
    # 2. Time Requirement (CMS rule: minimum 16 minutes to bill 99497)
    time_spent = encounter_data['face_to_face_time_minutes']
    if time_spent < 16:
        compliance_flags.append(f"INVALID TIME: {time_spent} mins does not meet 16-min threshold for 99497.")
    
    # Calculate applicable CPT codes
    cpt_codes = []
    if time_spent >= 16:
        cpt_codes.append("99497")
    if time_spent >= 46:
        # Each additional 30 mins (16 mins past the first 30)
        additional_units = (time_spent - 16) // 30
        cpt_codes.extend(["99498"] * additional_units)

    # 3. Repeat Service Rule
    if encounter_data.get('is_repeat_service') and not encounter_data.get('change_in_health_status_documented'):
        compliance_flags.append("MISSING: Repeat ACP requires documented change in health status or end-of-life wishes.")

    return {
        "status": "PASS" if not compliance_flags else "FAIL",
        "billable_codes": cpt_codes if not compliance_flags else [],
        "deficiencies": compliance_flags
    }
</code></pre>

<hr>

<h2>4. Cognitive Assessment (CPT 99483) Validation</h2>

<h3>4.1 JSON Schema</h3>
<p>CPT 99483 is an exhaustive E/M code equivalent to a Level 5 visit (99215). It requires 10 highly specific elements to be documented.</p>

<pre><code class="language-json">{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Cognitive_Assessment_Encounter",
  "type": "object",
  "properties": {
    "encounter_id": { "type": "string" },
    "independent_historian_present": { "type": "boolean" },
    "cognition_focused_eval": { "type": "boolean" },
    "functional_assessment": {
      "type": "object",
      "properties": {
        "adls": { "type": "boolean" },
        "iadls": { "type": "boolean" },
        "decision_making_capacity": { "type": "boolean" }
      },
      "required": ["adls", "iadls", "decision_making_capacity"]
    },
    "standardized_instrument_used": { "type": "string", "enum": ["FAST", "CDR", "MoCA", "MMSE", "Other"] },
    "neuropsychiatric_eval": { "type": "boolean", "description": "Screening for depression, anxiety, agitation" },
    "medication_reconciliation": { "type": "boolean" },
    "safety_evaluation": { "type": "boolean", "description": "Home environment, fall risk, wandering" },
    "caregiver_assessment": { "type": "boolean", "description": "Caregiver needs and knowledge" },
    "mdm_complexity": { "type": "string", "enum": ["Moderate", "High", "Low", "Straightforward"] },
    "written_care_plan_created": { "type": "boolean" }
  },
  "required": [
    "encounter_id", "independent_historian_present", "cognition_focused_eval", 
    "functional_assessment", "standardized_instrument_used", "neuropsychiatric_eval",
    "medication_reconciliation", "safety_evaluation", "caregiver_assessment", 
    "mdm_complexity", "written_care_plan_created"
  ]
}</code></pre>

<h3>4.2 AI Verification Algorithm (<code>CogAssess_Compliance_Check</code>)</h3>

<pre><code class="language-python">def verify_cognitive_assessment(encounter_data: dict) -> dict:
    missing_elements = []

    # 1. The 10 Mandatory Elements Rule
    if not encounter_data['independent_historian_present']:
        missing_elements.append("Independent Historian")
        
    if not encounter_data['standardized_instrument_used']:
        missing_elements.append("Standardized Staging Instrument (e.g., FAST, CDR)")
        
    if not encounter_data['neuropsychiatric_eval']:
        missing_elements.append("Neuropsychiatric/Behavioral Evaluation")
        
    if not encounter_data['medication_reconciliation']:
        missing_elements.append("Medication Reconciliation (High-risk screen)")
        
    if not encounter_data['safety_evaluation']:
        missing_elements.append("Home/Safety/Wandering Evaluation")
        
    if not encounter_data['caregiver_assessment']:
        missing_elements.append("Caregiver Assessment")
        
    if not encounter_data['written_care_plan_created']:
        missing_elements.append("Written Care Plan (Communicated to patient/caregiver)")

    # 2. Functional Capacity Validation
    func = encounter_data['functional_assessment']
    if not (func['adls'] and func['iadls'] and func['decision_making_capacity']):
        missing_elements.append("Complete Functional Assessment (ADLs, IADLs, Decision-Making)")

    # 3. Medical Decision Making Complexity Validation
    if encounter_data['mdm_complexity'] not in ["Moderate", "High"]:
        missing_elements.append(f"Insufficient MDM Complexity: Found '{encounter_data['mdm_complexity']}'. Must be Moderate or High.")

    is_compliant = len(missing_elements) == 0

    return {
        "cpt_code": "99483",
        "status": "PASS" if is_compliant else "FAIL",
        "deficiencies": missing_elements
    }
</code></pre>

<hr>

<h2>5. NLP Extraction &amp; Pipeline Directives</h2>
<p>To implement this spec in production, the AI text extraction pipeline must:</p>
<ol>
<li><strong>Entity Resolution:</strong> Use Named Entity Recognition (NER) to map free-text clinical notes to the boolean flags in the schemas.</li>
<li><strong>Contextual Negation:</strong> Ensure models handle negation (e.g., <em>"Patient refused depression screening"</em> should flag as a missing/incomplete component unless patient refusal logic overrides).</li>
<li><strong>Audit Traceability:</strong> Every schema boolean flagged <code>true</code> must map to a specific <code>text_span</code> from the source EMR document to facilitate human-in-the-loop auditing and CMS compliance reviews.</li>
</ol>
`;
