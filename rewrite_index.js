const fs = require('fs');

const htmlPath = 'C:/Users/rites/Desktop/medcare_documentation/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const sidebarHtml = `      <div class="sidebar-section">
        <div class="nav-group">
          <div class="nav-group-toggle open" data-target="group-overview">
            Project Overview <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
          <div class="nav-sub open" id="group-overview">
            <a class="nav-item active" href="#" data-page="overview">Objective</a>
            <a class="nav-item" href="#" data-page="expected_outcome">Expected Outcome</a>
          </div>
        </div>
        
        <div class="nav-group">
          <div class="nav-group-toggle open" data-target="group-features">
            Key Features <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
          <div class="nav-sub open" id="group-features">
            <a class="nav-item" href="#" data-page="clinical_note_generation">Clinical Note Generation</a>
            <a class="nav-item" href="#" data-page="structured_data_input">Structured Data Input</a>
            <a class="nav-item" href="#" data-page="cms_compliance_validation">CMS Compliance Validation</a>
            <a class="nav-item" href="#" data-page="coding_assistance">Coding Assistance</a>
            <a class="nav-item" href="#" data-page="audit_readiness">Audit Readiness</a>
            <a class="nav-item" href="#" data-page="specialty_specific_templates">Specialty-Specific Templates</a>
            <a class="nav-item" href="#" data-page="ai_recommendations">AI Recommendations</a>
          </div>
        </div>
      </div>`;

// Replace the sidebar section in HTML
const sidebarRegex = /<div class="sidebar-section">[\s\S]*?<\/div>\s*<\/nav>/;
html = html.replace(sidebarRegex, sidebarHtml + '\n    </nav>');

const scriptHtml = `  <!-- PAGE CONTENT -->
  <script src="js/pages/overview.js"></script>
  <script src="js/pages/expected_outcome.js"></script>
  <script src="js/pages/clinical_note_generation.js"></script>
  <script src="js/pages/structured_data_input.js"></script>
  <script src="js/pages/cms_compliance_validation.js"></script>
  <script src="js/pages/coding_assistance.js"></script>
  <script src="js/pages/audit_readiness.js"></script>
  <script src="js/pages/specialty_specific_templates.js"></script>
  <script src="js/pages/ai_recommendations.js"></script>`;

const scriptRegex = /<!-- PAGE CONTENT -->[\s\S]*?(?=<script src="js\/pages\.js\?v=13"><\/script>)/;
html = html.replace(scriptRegex, scriptHtml + '\n  ');

fs.writeFileSync(htmlPath, html);
console.log('index.html updated successfully.');
