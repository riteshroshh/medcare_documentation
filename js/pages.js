// ─── All page content ───────────────────────────────────────────────────────

window.PAGES = window.PAGES || {};

window.PAGES['overview'] = () => `
<div class="page-chip">Project medcare / internal brief</div>
<h1>Project MedCare: Internal Brief</h1>
<p><strong>Author:</strong> Ritesh Roshan</p>
<p>We need to develop an AI-powered tool specifically for physician documentation and medical coding compliance.</p>

<h2>Objective</h2>
<p>Create a documentation assistant that follows CMS and payer documentation guidelines and helps providers generate compliant clinical notes while reducing documentation burden.</p>

<h2>Expected Outcome</h2>
<p>The provider enters basic clinical information, and the system generates a CMS-compliant note, recommends the appropriate CPT and ICD-10 codes, determines the supported E/M level, identifies documentation gaps, and provides an audit-ready final note.</p>

<h2>Reference Documentation</h2>
<p>The following are the original, authenticated CMS and AMA links to the guidelines and documentation required for this project:</p>

<h3>Evaluation and Management (E/M) Core Guidelines</h3>
<ul>
  <li><a href="https://www.ama-assn.org/system/files/2023-e-m-descriptors-guidelines.pdf" target="_blank">AMA CPT 2023 E/M Descriptors and Guidelines</a> (Primary source for MDM grids and time thresholds)</li>
  <li><a href="https://www.cms.gov/training-education/medicare-learning-networkr-mln/compliance/medicare-provider-compliance-tips/evaluation-management-services" target="_blank">CMS E/M Services Provider Compliance Tips & Documentation Checklists</a></li>
</ul>

<h3>Care Management & Remote Monitoring</h3>
<ul>
  <li><a href="https://www.cms.gov/files/document/chroniccaremanagement.pdf" target="_blank">Chronic Care Management (CCM) and Principal Care Management (PCM) MLN Booklet</a></li>
  <li><a href="https://www.cms.gov/files/document/mln908628-transitional-care-management-services.pdf" target="_blank">Transitional Care Management (TCM) Services MLN Booklet</a></li>
  <li><a href="https://www.cms.gov/files/document/mln901705-telehealth-remote-monitoring.pdf" target="_blank">Telehealth & Remote Physiologic Monitoring (RPM) MLN Booklet</a></li>
</ul>

<h3>Preventive and Cognitive Services</h3>
<ul>
  <li><a href="https://www.cms.gov/medicare/coverage/preventive-services/medicare-wellness-visits/annual-wellness-visit" target="_blank">Annual Wellness Visit (AWV) Checklist and Components</a></li>
  <li><a href="https://www.cms.gov/files/document/mln-advanced-care-planning.pdf" target="_blank">Advance Care Planning (ACP) MLN Fact Sheet</a></li>
  <li><a href="https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=59036" target="_blank">Cognitive Assessment and Care Plan Services (CPT 99483) Billing and Clinical Elements</a></li>
</ul>

<h3>Therapy, ICD-10, and Specialty Specifics</h3>
<ul>
  <li><a href="https://www.cms.gov/files/document/mln905365-complying-outpatient-rehabilitation-therapy-documentation-requirements.pdf" target="_blank">Outpatient Rehabilitation Therapy Documentation (Physical Therapy/Therapy Caps/CQ Modifiers)</a></li>
  <li><a href="https://stacks.cdc.gov/view/cdc/250974" target="_blank">ICD-10-CM Official Guidelines for Coding and Reporting (CDC/CMS)</a></li>
  <li><a href="https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=53296" target="_blank">Wound Care and Debridement Coding Requirements (CPT 97597, 97598)</a></li>
  <li><a href="https://www.cms.gov/files/document/mln909381-provider-information-medicare-diabetes-self-management-training.pdf" target="_blank">Medicare Diabetes Self-Management Training (DSMT) Guidelines</a></li>
</ul>
`;

window.PAGES['note_generation'] = () => `
<div class="page-chip">medcare_ai / note_generation</div>
<h1>Clinical Note Generation</h1>
<p>The system is designed to handle multiple specialized note types and structured data inputs efficiently.</p>

<h2>Supported Note Types</h2>
<ul>
  <li>Progress Notes</li>
  <li>History & Physical (H&P)</li>
  <li>Consultation Notes</li>
  <li>Discharge Summaries</li>
  <li>Nursing Facility Notes</li>
  <li>Annual Wellness Visits</li>
  <li>CCM, PCM, TCM, RPM, ACP, and Cognitive Assessment documentation</li>
</ul>

<h2>Structured Data Input</h2>
<p>Providers should be able to enter basic information to seed the generation process. Supported fields include:</p>
<ul>
  <li>Chief Complaint</li>
  <li>HPI (History of Present Illness)</li>
  <li>Diagnoses</li>
  <li>Medications</li>
  <li>Lab Results</li>
  <li>Assessment & Plan</li>
  <li>Vital Signs</li>
  <li>ROS (Review of Systems) and Physical Exam findings</li>
</ul>
`;

window.PAGES['compliance_validation'] = () => `
<div class="page-chip">medcare_ai / compliance_validation</div>
<h1>CMS Compliance Validation</h1>
<p>The tool acts as a real-time compliance auditor. It should strictly review documentation against CMS guidelines and immediately identify critical gaps.</p>

<h2>Validation Targets</h2>
<p>The system must automatically flag the following deficiencies:</p>
<ul>
  <li>Missing HPI elements</li>
  <li>Incomplete Assessment & Plan</li>
  <li>Missing treatment goals</li>
  <li>Lack of medical necessity</li>
  <li>Insufficient documentation to support the selected E/M level</li>
  <li>Missing time documentation when applicable</li>
  <li>Missing CCM / PCM / TCM / RPM requirements</li>
</ul>
`;

window.PAGES['coding_assistance'] = () => `
<div class="page-chip">medcare_ai / coding_assistance</div>
<h1>Coding Assistance</h1>
<p>Based on the analyzed documentation, the tool should provide explicit billing and coding recommendations.</p>

<h2>Core Responsibilities</h2>
<ul>
  <li>Suggest appropriate <strong>ICD-10</strong> diagnosis codes.</li>
  <li>Suggest <strong>CPT/HCPCS</strong> codes.</li>
  <li>Recommend the optimal <strong>E/M level</strong> (e.g., 99202–99215, 99304–99310) based on MDM (Medical Decision Making) or total time.</li>
  <li>Provide explicit justification for the recommended code level.</li>
  <li>Flag documentation deficiencies that may result in downcoding or audit findings.</li>
</ul>
`;

window.PAGES['audit_readiness'] = () => `
<div class="page-chip">medcare_ai / audit_readiness</div>
<h1>Audit Readiness</h1>
<p>The system must protect providers against post-payment audits by generating proactive compliance reports.</p>

<h2>Generated Deliverables</h2>
<p>Before finalization, the system should generate:</p>
<ul>
  <li>MDM scoring analysis</li>
  <li>Risk level determination</li>
  <li>Audit compliance score</li>
  <li>Documentation deficiency report</li>
  <li>Suggested improvements before note finalization</li>
</ul>
`;

window.PAGES['specialty_templates'] = () => `
<div class="page-chip">medcare_ai / specialty_templates</div>
<h1>Specialty-Specific Templates</h1>
<p>Clinical workflows differ significantly by specialty. The assistant must dynamically adapt its templates and heuristic evaluations to support:</p>

<ul>
  <li>Internal Medicine</li>
  <li>Cardiology</li>
  <li>Pulmonology</li>
  <li>Nursing Facility Medicine</li>
  <li>Wound Care</li>
  <li>Endocrinology</li>
  <li>Physical Therapy oversight</li>
</ul>
`;

window.PAGES['ai_recommendations'] = () => `
<div class="page-chip">medcare_ai / ai_recommendations</div>
<h1>AI Recommendations</h1>
<p>The system should not just act as a passive checker—it must be an active cognitive assistant.</p>

<h2>Proactive Suggestions</h2>
<p>The tool should proactively suggest:</p>
<ul>
  <li>Additional diagnoses supported by the current documentation context.</li>
  <li>Missing chronic conditions.</li>
  <li>Additional documentation needed to support higher-complexity visits.</li>
  <li>Preventive services that may be due based on patient history.</li>
</ul>
`

// End of overview
function renderMath(el) {
  if (window.renderMathInElement) {
    window.renderMathInElement(el, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
      ],
      throwOnError: false
    });
  }
}

function processCitations(el) {
  el.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.hasAttribute('data-page')) return;
    const ref = link.getAttribute('href').substring(1);
    if (ref.startsWith('ref-')) {
      link.classList.add('citation');
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(ref);
        if (target) {
          const y = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
          target.classList.add('highlight-flash');
          setTimeout(() => target.classList.remove('highlight-flash'), 2000);
        }
      });
    }
  });
}

function renderPage(pageId) {
  const el = document.getElementById('main-content');
  if (!el) return;

  el.classList.add('page-transitioning');

  setTimeout(() => {
    let fn = window.PAGES[pageId];
    if (!fn) {
      const isPlanned = document.querySelector('.nav-item[data-page="' + pageId + '"]');
      if (isPlanned) {
        const formattedTitle = isPlanned.textContent.trim();
        fn = () => `
          <div class="page-chip" style="color: #ec4899; border-color: rgba(236,72,153,0.3); background: rgba(236,72,153,0.05);">coming soon</div>
          <h1 style="margin-top: 1rem; font-size: 3rem; background: linear-gradient(135deg, #fff, #a0a0a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${formattedTitle}</h1>
          <p class="lead" style="color: var(--muted);">This neural pathway is currently under construction. The weights are still converging.</p>
        `;
      } else {
        fn = () => `
          <div style="min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <div style="font-family: var(--font-mono); font-size: 8rem; font-weight: 700; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.1); margin-bottom: -1rem; letter-spacing: -0.05em;">404</div>
            <h1 style="font-size: 2.5rem; color: var(--heading);">Dead End</h1>
            <p style="color: var(--muted); max-width: 400px; margin: 1rem auto 2.5rem; line-height: 1.6;">
              This dimensional coordinate does not exist.
            </p>
          </div>
        `;
      }
    }
    let content = fn();
    if (window.marked && (content.trim().startsWith('#') || content.includes('\n## ') || content.includes('\n*'))) {
      content = marked.parse(content);
    }
    el.innerHTML = content;
    window.scrollTo(0, 0);
    renderMath(el);
    processCitations(el);
    
    el.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.copy-btn')) return;
      pre.style.position = 'relative';
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        const text = code ? code.innerText : pre.innerText;
        navigator.clipboard.writeText(text).then(() => {
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#98c379" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          setTimeout(() => {
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
          }, 2000);
        });
      });
      pre.appendChild(btn);
    });

    if (window.Prism) { Prism.highlightAllUnder(el); }

    // Add Next / Previous Navigation
    const allNavItems = Array.from(document.querySelectorAll('.nav-item[data-page]'));
    const currentIndex = allNavItems.findIndex(navEl => navEl.dataset.page === pageId);
    
    if (currentIndex !== -1) {
      
      const basePath = '';
      let navHtml = '<div class="page-navigation">';
      
      if (currentIndex > 0) {
        const prev = allNavItems[currentIndex - 1];
        let prevTitle = prev.textContent.trim();
        navHtml += `<a href="?p=${prev.dataset.page}" data-page="${prev.dataset.page}" class="page-nav-btn prev">
                      <span class="nav-label">&larr; Previous</span>
                      <span class="nav-title">${prevTitle}</span>
                    </a>`;
      } else {
        navHtml += `<div></div>`;
      }
      
      if (currentIndex < allNavItems.length - 1) {
        const next = allNavItems[currentIndex + 1];
        let nextTitle = next.textContent.trim();
        navHtml += `<a href="?p=${next.dataset.page}" data-page="${next.dataset.page}" class="page-nav-btn next">
                      <span class="nav-label">Next &rarr;</span>
                      <span class="nav-title">${nextTitle}</span>
                    </a>`;
      } else {
        navHtml += `<div></div>`;
      }
      
      navHtml += '</div>';
      el.insertAdjacentHTML('beforeend', navHtml);

      el.querySelectorAll('.page-nav-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetPage = btn.dataset.page;
          history.pushState({ page: targetPage }, '', btn.getAttribute('href'));
          document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
          const link = document.querySelector('.nav-item[data-page="' + targetPage + '"]');
          if (link) link.classList.add('active');
          window.renderPage(targetPage);
        });
      });
    }

    // Dynamic TOC
    const tocNav = document.getElementById('toc-nav');
    if (tocNav) {
      tocNav.innerHTML = '';
      const headings = el.querySelectorAll('h2, h3');
      if (headings.length > 0) {
        headings.forEach((heading, idx) => {
          if (!heading.id) heading.id = 'heading-' + idx;
          const link = document.createElement('a');
          link.href = '#' + heading.id;
          link.className = 'toc-link ' + heading.tagName.toLowerCase();
          link.textContent = heading.textContent;
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const y = heading.getBoundingClientRect().top + window.scrollY - 85;
            window.scrollTo({ top: y, behavior: 'smooth' });
            history.pushState(null, null, '#' + pageId + '::' + heading.id);
          });
          tocNav.appendChild(link);
        });

        const handleScroll = () => {
          let current = '';
          headings.forEach(heading => {
            if (heading.getBoundingClientRect().top < 150) current = heading.id;
          });
          tocNav.querySelectorAll('.toc-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) link.classList.add('active');
          });
        };
        window.removeEventListener('scroll', window._tocScrollHandler);
        window._tocScrollHandler = handleScroll;
        window.addEventListener('scroll', handleScroll);
        setTimeout(handleScroll, 100);
        document.getElementById('toc-sidebar').style.display = 'block';
      } else {
        document.getElementById('toc-sidebar').style.display = 'none';
      }
    }

    requestAnimationFrame(() => el.classList.remove('page-transitioning'));
  }, 150);
}

window.renderPage = renderPage;

document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  let pageId = urlParams.get('p');
  
  const basePath = '';

  if (pageId) {
    history.replaceState({ page: pageId }, '', '?p=' + pageId + (window.location.hash ? window.location.hash : ''));
  } else {
    pageId = window.location.hash.replace('#', '') || 'overview';
    history.replaceState({ page: pageId }, '', '?p=' + pageId + (window.location.hash ? window.location.hash : ''));
  }
  
  // ensure we map correctly since hashes might include the :: syntax for headers
  pageId = pageId.split('::')[0];
  renderPage(pageId);
});
