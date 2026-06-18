window.PAGES = window.PAGES || {};
window.PAGES['overview'] = () => `
<div class="page-chip">medcare_ai / overview</div>

<div class="sleek-hero">
  <div class="sleek-chip">Internal Brief • Author: Ritesh Roshan</div>
  <h1 class="sleek-hero-title">Project MedCare</h1>
  <p class="sleek-hero-subtitle">
    MedCare AI is an advanced, AI-powered compliance and documentation engine designed specifically to eliminate the cognitive overhead of clinical documentation for physicians. By operating at the intersection of Large Language Models and deterministic clinical heuristics, MedCare AI ensures that every patient encounter is instantly translated into a robust, CMS-compliant, and audit-ready clinical narrative.
  </p>
</div>

<h2 class="sleek-section-title">Core Objective</h2>
<p style="font-size: 1.1rem; color: var(--heading); margin-bottom: 2rem;">
  Create a documentation assistant that follows CMS and payer documentation guidelines and helps providers generate compliant clinical notes while reducing documentation burden.
</p>

<h2 class="sleek-section-title">Key Features</h2>

<div class="sleek-card-grid">
  
  <div class="sleek-card">
    <div class="sleek-card-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    </div>
    <div class="sleek-card-title">Clinical Note Generation</div>
    <div class="sleek-card-body">
      <ul>
        <li>Progress Notes</li>
        <li>History & Physical (H&P)</li>
        <li>Consultation Notes</li>
        <li>Discharge Summaries</li>
        <li>Nursing Facility Notes</li>
        <li>Annual Wellness Visits</li>
        <li>CCM, PCM, TCM, RPM, ACP</li>
      </ul>
    </div>
  </div>

  <div class="sleek-card">
    <div class="sleek-card-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
    </div>
    <div class="sleek-card-title">Structured Data Input</div>
    <div class="sleek-card-body">
      <ul>
        <li>Chief Complaint & HPI</li>
        <li>Diagnoses & Medications</li>
        <li>Lab Results</li>
        <li>Assessment & Plan</li>
        <li>Vital Signs</li>
        <li>ROS and Physical Exam findings</li>
      </ul>
    </div>
  </div>

  <div class="sleek-card">
    <div class="sleek-card-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    </div>
    <div class="sleek-card-title">CMS Compliance Validation</div>
    <div class="sleek-card-body">
      <ul>
        <li>Missing HPI elements</li>
        <li>Incomplete Assessment & Plan</li>
        <li>Missing treatment goals</li>
        <li>Lack of medical necessity</li>
        <li>Insufficient E/M documentation</li>
        <li>Missing time documentation</li>
      </ul>
    </div>
  </div>

  <div class="sleek-card">
    <div class="sleek-card-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    </div>
    <div class="sleek-card-title">Defensive Coding Assistance</div>
    <div class="sleek-card-body">
      <ul>
        <li>Suggest ICD-10 diagnosis codes</li>
        <li>Suggest CPT/HCPCS codes</li>
        <li>Recommend E/M level based on MDM/time</li>
        <li>Provide justification for code level</li>
        <li>Flag deficiencies that risk downcoding</li>
      </ul>
    </div>
  </div>

  <div class="sleek-card">
    <div class="sleek-card-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
    </div>
    <div class="sleek-card-title">Audit Readiness</div>
    <div class="sleek-card-body">
      <ul>
        <li>MDM scoring analysis</li>
        <li>Risk level determination</li>
        <li>Audit compliance score</li>
        <li>Documentation deficiency report</li>
        <li>Suggested improvements pre-finalization</li>
      </ul>
    </div>
  </div>

  <div class="sleek-card">
    <div class="sleek-card-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
    </div>
    <div class="sleek-card-title">AI Recommendations</div>
    <div class="sleek-card-body">
      <ul>
        <li>Additional supported diagnoses</li>
        <li>Missing chronic conditions</li>
        <li>Documentation for higher-complexity visits</li>
        <li>Preventive services that may be due</li>
      </ul>
    </div>
  </div>

</div>

<div class="sleek-card" style="margin-top: 2rem; border-color: rgba(138, 180, 248, 0.3);">
  <div class="sleek-card-title" style="color: #8ab4f8;">Expected Outcome</div>
  <div class="sleek-card-body" style="font-size: 1rem; color: var(--heading);">
    The provider enters basic clinical information, and the system generates a CMS-compliant note, recommends the appropriate CPT and ICD-10 codes, determines the supported E/M level, identifies documentation gaps, and provides an audit-ready final note.
  </div>
</div>

<h2 class="sleek-section-title">Authenticated CMS & AMA Guidelines</h2>

<a href="https://www.ama-assn.org/system/files/2023-e-m-descriptors-guidelines.pdf" target="_blank" class="sleek-link-card">
  <div class="sleek-link-text">
    <strong>AMA CPT 2023 E/M Descriptors and Guidelines</strong>
    Primary source for MDM grids and time thresholds
  </div>
  <div class="sleek-link-arrow">↗</div>
</a>

<a href="https://www.cms.gov/training-education/medicare-learning-networkr-mln/compliance/medicare-provider-compliance-tips/evaluation-management-services" target="_blank" class="sleek-link-card">
  <div class="sleek-link-text">
    <strong>CMS E/M Services Provider Compliance Tips</strong>
    Documentation checklists for evaluation and management
  </div>
  <div class="sleek-link-arrow">↗</div>
</a>

<a href="https://www.cms.gov/files/document/chroniccaremanagement.pdf" target="_blank" class="sleek-link-card">
  <div class="sleek-link-text">
    <strong>Chronic Care Management (CCM) and PCM</strong>
    CMS MLN Booklet for remote care programs
  </div>
  <div class="sleek-link-arrow">↗</div>
</a>

<a href="https://stacks.cdc.gov/view/cdc/250974" target="_blank" class="sleek-link-card">
  <div class="sleek-link-text">
    <strong>ICD-10-CM Official Guidelines</strong>
    Coding and Reporting guidelines from CDC/CMS
  </div>
  <div class="sleek-link-arrow">↗</div>
</a>

<a href="https://www.cms.gov/medicare/coverage/preventive-services/medicare-wellness-visits/annual-wellness-visit" target="_blank" class="sleek-link-card">
  <div class="sleek-link-text">
    <strong>Annual Wellness Visit (AWV)</strong>
    CMS Checklist and Components
  </div>
  <div class="sleek-link-arrow">↗</div>
</a>
`;
