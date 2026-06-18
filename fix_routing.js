const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Remove isGithubPages and basePath declarations
  content = content.replace(/.*const isGithubPages.*\n/g, '');
  content = content.replace(/.*const basePath.*\n/g, '');

  // Fix href attributes in pages.js
  content = content.replace(/href="\$\{basePath\}\?p=\$\{prev\.dataset\.page\}"/g, 'href="?p=${prev.dataset.page}"');
  content = content.replace(/href="\$\{basePath\}\?p=\$\{next\.dataset\.page\}"/g, 'href="?p=${next.dataset.page}"');

  // Fix history.replaceState and history.pushState in pages.js and nav.js
  content = content.replace(/basePath \+ '\?p=' \+ /g, "'?p=' + ");
  content = content.replace(/window\.location\.pathname\.replace\(basePath, ''\)/g, "window.location.pathname");
  
  // Fix popstate fallback in nav.js
  // const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  content = content.replace(/const path = window\.location\.pathname\.replace\(\/^\/\/\, ''\)\.replace\(\/\\\/\\$\/\, ''\);/g, "const path = ''; // fallback to hash or overview");

  fs.writeFileSync(file, content);
}

fix('js/pages.js');
fix('js/nav.js');
console.log('Fixed routing in js/pages.js and js/nav.js');
