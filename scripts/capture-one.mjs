#!/usr/bin/env node
// One-off capture of a single bundle. Usage: node scripts/capture-one.mjs <slug>
import { chromium } from 'playwright-chromium';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import http from 'node:http';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.jsx': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
};
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const slug = process.argv[2];
if (!slug) { console.error('usage: capture-one.mjs <slug>'); process.exit(1); }

const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
const b = manifest.bundles.find(x => x.slug === slug);
if (!b) { console.error('unknown slug:', slug); process.exit(1); }
// Serve from project root so ${b.dir}/${b.primary} (bundles/xxx/project/Xxx.html) resolves.
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const filePath = path.join(root, decodeURIComponent(url.pathname));
  try {
    const buf = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'text/plain' });
    res.end(buf);
  } catch {
    res.writeHead(404); res.end();
  }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(`http://127.0.0.1:${port}/${b.dir}/${b.primary}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2500);
await mkdir(path.join(root, 'previews'), { recursive: true });
await page.screenshot({ path: path.join(root, 'previews', `${slug}.png`), fullPage: false });
await browser.close();
server.close();
console.log(`✓ previews/${slug}.png`);
