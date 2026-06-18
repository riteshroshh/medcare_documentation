const fs = require('fs');
const readline = require('readline');
const path = 'C:/Users/rites/.gemini/antigravity/brain/a2eab4ab-0ad0-419f-ac5c-48c4ebd98272/.system_generated/logs/transcript_full.jsonl';

const outDir = 'C:/Users/rites/Desktop/medcare_documentation/js/pages';

async function processLineByLine() {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    let obj;
    try {
      obj = JSON.parse(line);
    } catch(e) {
      continue;
    }
    
    if (obj.type === 'SYSTEM_MESSAGE' && obj.content) {
      let markdown = '';
      if (obj.content.includes('```markdown')) {
        const parts = obj.content.split('```markdown');
        if (parts.length > 1) {
            markdown = parts[1].split('```')[0].trim();
        }
      } else if (obj.content.includes('Here is the massive') || obj.content.includes('Here is the') || obj.content.includes('# MedCare AI')) {
        const hashIndex = obj.content.indexOf('# ');
        if (hashIndex !== -1) {
            markdown = obj.content.substring(hashIndex).trim();
        }
      }

      if (markdown && markdown.length > 500) {
         const match = markdown.match(/^# (.*?)(?:\r?\n|$)/m);
         if (match) {
           const id = match[1].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().replace(/_+/g, '_').replace(/^_|_$/g, '');
           const jsContent = `window.PAGES = window.PAGES || {};\nwindow.PAGES['${id}'] = () => \`\n${markdown.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\n\`;\n`;
           fs.writeFileSync(`${outDir}/${id}.js`, jsContent);
           console.log('Created ' + id + '.js');
         }
      }
    }
  }
}

processLineByLine().catch(console.error);
