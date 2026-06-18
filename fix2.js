const fs = require('fs');
let c = fs.readFileSync('C:/Users/rites/Desktop/medcare_documentation/js/pages.js', 'utf8');

// Replace \` with `
c = c.replace(/\\`/g, '`');

fs.writeFileSync('C:/Users/rites/Desktop/medcare_documentation/js/pages.js', c);
