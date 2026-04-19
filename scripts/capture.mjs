#!/usr/bin/env node
// Capture high-fidelity previews of each handoff bundle's primary HTML.
// Usage: node scripts/capture.mjs
import { chromium } from 'playwright-chromium';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import http from 'node:http';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jsx': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif',
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const previewsDir = path.join(root, 'previews');

const BUNDLES = [
  { slug: 'aerodrop',     dir: 'aerodrop-luxury-ui', file: 'AeroDrop.html' },
  { slug: 'agentic-ops',  dir: 'agentic-ops',        file: 'Agentic Ops.html' },
  { slug: 'biopulse',     dir: 'biopulse-ai',        file: 'BioPulse.html' },
  { slug: 'luxar-vault',  dir: 'holowallet',         file: 'Luxar Vault.html' },
  { slug: 'orchestrator', dir: 'logicchain',         file: 'Orchestrator.html' },
  { slug: 'neuralstore',  dir: 'neuralstore',        file: 'NeuralStore.html' },
  { slug: 'frontier',     dir: 'vibe-design',        file: 'Frontier Landing.html' },
  { slug: 'visionsynth',  dir: 'visionsynth',        file: 'VisionSynth.html' },
];

const VIEWPORT = { width: 1920, height: 1080 };

await mkdir(previewsDir, { recursive: true });

const bundlesRoot = path.join(root, 'bundles');
const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const abs = path.join(bundlesRoot, urlPath);
    if (!abs.startsWith(bundlesRoot)) { res.writeHead(403).end(); return; }
    const s = await stat(abs);
    if (s.isDirectory()) { res.writeHead(404).end(); return; }
    const ext = path.extname(abs).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(await readFile(abs));
  } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
console.log(`serving bundles/ on http://127.0.0.1:${port}`);

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });

for (const b of BUNDLES) {
  const url = `http://127.0.0.1:${port}/${encodeURIComponent(b.dir)}/project/${encodeURIComponent(b.file)}`;
  const out = path.join(previewsDir, `${b.slug}.png`);
  const page = await context.newPage();
  console.log(`→ ${b.slug}  ${url}`);
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
    await page.waitForTimeout(2500);
    await page.screenshot({ path: out, fullPage: false });
    console.log(`  ✓ ${out}`);
  } catch (e) {
    console.error(`  ✗ ${b.slug}: ${e.message}`);
  }
  await page.close();
}

await browser.close();
server.close();
console.log('done');
