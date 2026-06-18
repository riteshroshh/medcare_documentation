const fs = require('fs');

const htmlPath = 'C:/Users/rites/Desktop/medcare_documentation/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const linkRegex = /<a class="nav-item.*?" href=".*?" data-page="(.*?)">(.*?)<\/a>/g;
let match;
const links = [];

while ((match = linkRegex.exec(html)) !== null) {
  links.push({
    fullHtml: match[0],
    id: match[1],
    title: match[2]
  });
}

const groups = {
  'Clinical UX & Workflows': [],
  'E/M & Compliance Engine': [],
  'NLP & Clinical Intelligence': [],
  'Architecture & Systems': [],
  'Security & Ethical AI': [],
  'Core Knowledge Base': []
};

links.forEach(link => {
  const text = link.id.toLowerCase() + ' ' + link.title.toLowerCase();
  if (text.includes('em_engine') || text.includes('scoring') || text.includes('coding') || text.includes('cms') || text.includes('compliance')) {
    groups['E/M & Compliance Engine'].push(link);
  } else if (text.includes('nlp') || text.includes('diagnostic') || text.includes('entity') || text.includes('rag') || text.includes('cognitive') || text.includes('intelligence')) {
    groups['NLP & Clinical Intelligence'].push(link);
  } else if (text.includes('blueprint') || text.includes('rendering') || text.includes('template') || text.includes('choreography') || text.includes('note_generation') || text.includes('arrival')) {
    groups['Clinical UX & Workflows'].push(link);
  } else if (text.includes('security') || text.includes('threat') || text.includes('ethical') || text.includes('bias') || text.includes('fuzzing')) {
    groups['Security & Ethical AI'].push(link);
  } else if (text.includes('architecture') || text.includes('telemetry') || text.includes('infrastructure') || text.includes('gateway') || text.includes('distributed') || text.includes('operations') || text.includes('hyperscale') || text.includes('persistence')) {
    groups['Architecture & Systems'].push(link);
  } else {
    groups['Core Knowledge Base'].push(link);
  }
});

let newSidebarHtml = '<div class="sidebar-section">\n';

let groupId = 0;
for (const [groupName, groupLinks] of Object.entries(groups)) {
  if (groupLinks.length === 0) continue;
  const gid = 'group-' + groupId++;
  // Open the first two groups by default
  const openClass = (groupId <= 2) ? 'open' : '';
  
  newSidebarHtml += `  <div class="nav-group">
    <div class="nav-group-toggle ${openClass}" data-target="${gid}">
      ${groupName} <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </div>
    <div class="nav-sub ${openClass}" id="${gid}">\n`;
    
  groupLinks.forEach(link => {
    // Reset active state for all during generation
    let cleanLink = link.fullHtml.replace('nav-item active', 'nav-item');
    newSidebarHtml += `      ${cleanLink}\n`;
  });
  
  newSidebarHtml += `    </div>\n  </div>\n`;
}

newSidebarHtml += '      </div>';

// Replace the sidebar section in HTML
const sidebarRegex = /<div class="sidebar-section">[\s\S]*?<\/div>\s*<\/nav>/;
html = html.replace(sidebarRegex, newSidebarHtml + '\n    </nav>');

fs.writeFileSync(htmlPath, html);
console.log('Sidebar reordered successfully.');
