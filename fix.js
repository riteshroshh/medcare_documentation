const fs = require('fs');
let c = fs.readFileSync('C:/Users/rites/Desktop/medcare_documentation/js/pages.js', 'utf8');

// Replace property keys with window.PAGES assignments
c = c.replace(/([a-z_]+):\s*\(\)\s*=>\s*`/g, "window.PAGES['$1'] = () => `");

// Replace `,\n\nwindow.PAGES with `;\n\nwindow.PAGES
c = c.replace(/`,\s+window\.PAGES/g, '`;\n\nwindow.PAGES');

fs.writeFileSync('C:/Users/rites/Desktop/medcare_documentation/js/pages.js', c);
