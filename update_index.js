const fs = require('fs');

const pagesDir = 'C:/Users/rites/Desktop/medcare_documentation/js/pages';
const indexPath = 'C:/Users/rites/Desktop/medcare_documentation/index.html';

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.js'));

// Create script tags
const scriptTags = files.map(f => `  <script src="js/pages/${f}"></script>`).join('\n');

// Create sidebar items
const formatName = (name) => {
    let base = name.replace('.js', '');
    return base.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const sidebarItems = files.map((f, i) => {
    const pageId = f.replace('.js', '');
    const title = formatName(f);
    const activeClass = i === 0 ? 'active' : '';
    return `        <a class="nav-item ${activeClass}" href="#" data-page="${pageId}">${title}</a>`;
}).join('\n');


let indexHtml = fs.readFileSync(indexPath, 'utf-8');

// Replace sidebar
const sidebarStart = '<div class="sidebar-section">';
const sidebarEnd = '      </div>\n    </nav>';
const newSidebar = `${sidebarStart}\n${sidebarItems}\n${sidebarEnd}`;

indexHtml = indexHtml.replace(/<div class="sidebar-section">[\s\S]*?<\/div>\s*<\/nav>/, newSidebar);

// Replace scripts
// Find the block of existing <script src="js/pages/
const scriptsStartRegex = /<script src="js\/pages\/.*?<\/script>/;
// We'll just replace everything between the first <script src="js/pages/ and <script src="js/pages.js
const scriptsRegex = /(<script src="js\/pages\/[\s\S]*?)(?=<script src="js\/pages\.js)/;

indexHtml = indexHtml.replace(scriptsRegex, `${scriptTags}\n  `);

fs.writeFileSync(indexPath, indexHtml);
console.log('Updated index.html with all pages!');
