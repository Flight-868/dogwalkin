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
};

// Clean URL → file mapping
const ROUTES = {
  '/':         'src/index.html',
  '/services': 'src/services.html',
  '/about':    'src/about.html',
  '/contact':  'src/contact.html',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0].split('#')[0];

  // Try clean-URL route first
  const routeFile = ROUTES[urlPath];
  const filePath = routeFile
    ? path.join(__dirname, routeFile)
    : path.join(__dirname, urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${urlPath}`);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Dev server → http://localhost:${PORT}`);
  console.log('  /          src/index.html');
  console.log('  /services  src/services.html');
  console.log('  /about     src/about.html');
  console.log('  /contact   src/contact.html');
});
