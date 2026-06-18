const fs = require('fs');
let c = fs.readFileSync('C:/Users/rites/Desktop/medcare_documentation/js/pages.js', 'utf8');

// Replace \${ with ${
c = c.replace(/\\\$\{/g, '${');

fs.writeFileSync('C:/Users/rites/Desktop/medcare_documentation/js/pages.js', c);

// Add table styles to style.css
let css = fs.readFileSync('C:/Users/rites/Desktop/medcare_documentation/style.css', 'utf8');
if (!css.includes('.content table')) {
  css += `
/* --- Tables ------------------------------------------------------------- */
.content table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 2rem 0;
  background: rgba(15, 15, 18, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  font-size: 0.95rem;
}

.content th {
  background: rgba(255, 255, 255, 0.05);
  color: var(--heading);
  font-weight: 600;
  text-align: left;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.content td {
  padding: 1rem 1.5rem;
  color: var(--text);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: top;
}

.content tr:last-child td {
  border-bottom: none;
}

.content tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}
`;
  fs.writeFileSync('C:/Users/rites/Desktop/medcare_documentation/style.css', css);
}
