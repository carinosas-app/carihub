const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'home-html-real-mockup-v4.html');
let text = fs.readFileSync(file, 'utf8');
const marker = '/* Tablet horizontal — mismo layout y proporciones que laptop */';
if (text.includes(marker)) {
  console.log('Tablet-h block already present');
  process.exit(0);
}
const startKey = 'body.proto-laptop .home-page-body{z-index:0}';
const endKey = 'body.proto-laptop .home-ad-bottom__dot{width:6px;height:6px}';
const start = text.indexOf(startKey);
const end = text.indexOf(endKey) + endKey.length;
const block = text.slice(start, end);
const lines = block.split(/\r?\n/);
const out = [marker];
let i = 0;
while (i < lines.length) {
  const line = lines[i];
  if (/body\.proto-(iphone|tablet)/.test(line)) {
    while (i < lines.length && !lines[i].includes('}')) i++;
    i++;
    continue;
  }
  if (line.includes('@media') && i + 1 < lines.length && lines[i + 1].includes('body.proto-laptop')) {
    while (i < lines.length) {
      out.push(lines[i].replace(/body\.proto-laptop/g, 'body.proto-tablet-h'));
      if (lines[i].trim() === '}') { i++; break; }
      i++;
    }
    continue;
  }
  if (line.includes('body.proto-laptop')) {
    while (i < lines.length) {
      out.push(lines[i].replace(/body\.proto-laptop/g, 'body.proto-tablet-h'));
      if (lines[i].includes('}')) { i++; break; }
      i++;
    }
    continue;
  }
  i++;
}
text = text.slice(0, end) + '\n' + out.join('\n') + '\n' + text.slice(end);
fs.writeFileSync(file, text, 'utf8');
console.log('Inserted', out.length, 'lines for tablet-h');
