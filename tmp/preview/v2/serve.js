const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const types = { '.html': 'text/html', '.png': 'image/png', '.webp': 'image/webp', '.css': 'text/css', '.js': 'application/javascript' };
http.createServer((req, res) => {
  const url = decodeURIComponent((req.url.split('?')[0] || '/').replace(/^\//, ''));
  const file = path.join(root, url || 'home-html-real-mockup-v2.html');
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); return res.end('Not found');
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(8766, () => console.log('http://localhost:8766/home-html-real-mockup-v2.html'));
