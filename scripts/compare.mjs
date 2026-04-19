#!/usr/bin/env node
// Generate "Code Fidelity" comparison screenshots for each bundle.
// Each PNG has a ClawBridge label overlay injected before capture.
// Output: previews/comparisons/<slug>.png  (1920×1080 @2x)
import { chromium } from 'playwright-chromium';
import { mkdir, readFile, stat, readFile as rf } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import http from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(await rf(path.join(root, 'manifest.json'), 'utf8'));
const outDir = path.join(root, 'previews', 'comparisons');
const bundlesRoot = path.join(root, 'bundles');
const VIEWPORT = { width: 1920, height: 1080 };

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.jsx': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif',
};

const FAMILY_COLORS = {
  'Liquid Glass': { bg: 'oklch(0.75 0.2 290)', text: '#fff' },
  'Monochrome':   { bg: '#e9ecee',              text: '#0a0b0c' },
};

await mkdir(outDir, { recursive: true });

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

for (const b of manifest.bundles) {
  const slugDir = b.dir.replace('bundles/', '');
  const url = `http://127.0.0.1:${port}/${encodeURIComponent(slugDir)}/project/${encodeURIComponent(path.basename(b.primary))}`;
  const out = path.join(outDir, `${b.slug}.png`);
  const page = await context.newPage();
  console.log(`→ ${b.slug}  (${b.fidelity}% · ${b.family})`);
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
    await page.waitForTimeout(2000);

    // Inject fidelity badge overlay
    const colors = FAMILY_COLORS[b.family];
    await page.evaluate(({ slug, fidelity, family, bgColor, textColor }) => {
      const badge = document.createElement('div');
      badge.setAttribute('data-clawbridge', 'overlay');
      badge.style.cssText = [
        'position:fixed', 'top:16px', 'right:16px', 'z-index:2147483647',
        `background:${bgColor}`, `color:${textColor}`,
        'font-family:"JetBrains Mono",ui-monospace,monospace',
        'font-size:11px', 'font-weight:600', 'letter-spacing:0.06em',
        'padding:6px 12px', 'border-radius:4px',
        'display:flex', 'flex-direction:column', 'gap:2px',
        'line-height:1.4', 'pointer-events:none',
      ].join(';');
      badge.innerHTML = `<span>ClawBridge · ${slug}</span><span>${family} · ${fidelity}% Fidelity</span>`;
      document.body.appendChild(badge);
    }, { slug: b.slug, fidelity: b.fidelity, family: b.family, bgColor: colors.bg, textColor: colors.text });

    await page.screenshot({ path: out, fullPage: false });
    console.log(`  ✓ ${out}`);
  } catch (e) {
    console.error(`  ✗ ${b.slug}: ${e.message}`);
  }
  await page.close();
}

await browser.close();
server.close();
console.log('\ndone — previews/comparisons/ ready');
