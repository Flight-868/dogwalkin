import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.ico':  'image/x-icon',
  '.pdf':  'application/pdf',
  '.xml':  'application/xml',
  '.txt':  'text/plain',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
};

// Clean URL → file mapping, matching the .htaccess rewrite rules
const ROUTES = {
  '/':         'src/index.html',
  '/services': 'src/services.html',
  '/about':    'src/about.html',
  '/contact':  'src/contact.html',
};

// On GoDaddy, src/ and public/ are both flattened into public_html/, so a
// path like /style.css or /components/load.js sits at the domain root. These
// prefixes are tried in order so localhost resolves paths exactly the way
// production will — otherwise a path that works here 404s once deployed.
const ROOTS = ['src', 'public', '.'];

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0].split('#')[0];

  const send = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(filePath));
  };

  // 1. Clean-URL route
  const route = ROUTES[urlPath];
  if (route) {
    const full = path.join(__dirname, route);
    if (fs.existsSync(full)) return send(full);
  }

  // 2. Each deployment root, in priority order
  let rel = urlPath;
  while (rel[0] === '/') rel = rel.slice(1);
  for (const root of ROOTS) {
    const full = path.join(__dirname, root, rel);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return send(full);
  }

  // 3. Extensionless fallback, mirroring the .htaccess .html rewrite
  for (const root of ROOTS) {
    const full = path.join(__dirname, root, rel + '.html');
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return send(full);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end(`404 Not Found: ${urlPath}`);
});

server.listen(PORT, () => {
  console.log(`Dev server → http://localhost:${PORT}`);
  console.log('  resolves /  /services  /about  /contact');
  console.log('  roots: src/ → public/ → project root (mirrors public_html/)');
});
