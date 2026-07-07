import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { chromium } from 'playwright';
import { REPO } from './vm-pipeline-context.mjs';

const PUBLIC_ROOT = join(REPO, 'public');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.webp': 'image/webp',
};

function startStaticServer(port) {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      try {
        let path = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
        if (path === '/') path = '/index.html';
        const file = join(PUBLIC_ROOT, path.replace(/^\//, '').replace(/\.\./g, ''));
        if (!file.startsWith(PUBLIC_ROOT) || !existsSync(file) || statSync(file).isDirectory()) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        const ext = extname(file).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(readFileSync(file));
      } catch (e) {
        res.writeHead(500);
        res.end(String(e.message));
      }
    });
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

export async function createPlaywrightSession(options = {}) {
  const port = options.port || Number(process.env.QA_PORT) || 5199;
  const baseUrl = process.env.QA_BASE || `http://127.0.0.1:${port}`;

  let server = null;
  let ownedServer = false;

  if (!process.env.QA_BASE) {
    server = await startStaticServer(port);
    ownedServer = true;
  }

  const launchOpts = { headless: true };
  if (process.env.PLAYWRIGHT_CHANNEL) {
    launchOpts.channel = process.env.PLAYWRIGHT_CHANNEL;
  } else if (process.platform === 'win32') {
    launchOpts.channel = 'msedge';
  }

  let browser;
  try {
    browser = await chromium.launch(launchOpts);
  } catch (e) {
    if (launchOpts.channel) {
      browser = await chromium.launch({ headless: true });
    } else {
      throw e;
    }
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'es-MX',
  });

  return {
    browser,
    context,
    baseUrl,
    async close() {
      await context.close();
      await browser.close();
      if (ownedServer && server) {
        await new Promise((r) => server.close(r));
      }
    },
  };
}

export async function newPage(session) {
  const page = await session.context.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      page.__consoleErrors = page.__consoleErrors || [];
      page.__consoleErrors.push(msg.text());
    }
  });
  return page;
}
