const http = require('http');
const fs = require('fs');
const path = require('path');
const roots = [
  __dirname,
  path.join(__dirname, '..'),
  path.join(__dirname, '..', 'shared'),
  path.join(__dirname, '..', 'resultados')
];
const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function resolveFile(urlPath) {
  const rel = decodeURIComponent((urlPath.split('?')[0] || '/').replace(/^\//, ''));
  const candidates = rel
    ? roots.map((r) => path.join(r, rel))
    : [path.join(__dirname, 'home-html-real-mockup-v4.html')];
  for (const file of candidates) {
    const norm = path.normalize(file);
    const allowed = roots.some((r) => norm.startsWith(path.normalize(r)));
    if (allowed && fs.existsSync(norm) && fs.statSync(norm).isFile()) return norm;
  }
  return null;
}

http.createServer((req, res) => {
  const file = resolveFile(req.url);
  if (!file) {
    res.writeHead(404);
    return res.end('Not found');
  }
  const ext = path.extname(file).toLowerCase();
  const headers = {
    'Content-Type': types[ext] || 'application/octet-stream',
    'Cache-Control': (ext === '.html' || ext === '.js') ? 'no-cache, no-store, must-revalidate' : 'public, max-age=60'
  };
  res.writeHead(200, headers);
  fs.createReadStream(file).pipe(res);
}).listen(8767, () => console.log('http://localhost:8767/home-html-real-mockup-v4.html'));
