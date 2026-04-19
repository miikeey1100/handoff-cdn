#!/usr/bin/env node
import https from 'node:https';
import fs from 'node:fs/promises';
import path from 'node:path';
import { argv, stdout, stderr, exit, cwd } from 'node:process';
import { fileURLToPath } from 'node:url';

const VERSION = '1.0.0';
const CDN = 'https://raw.githubusercontent.com/miikeey1100/Claude-Design-Handoff-Vault/main';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_MANIFEST = path.resolve(__dirname, '..', 'manifest.json');

const TOKENS = {
  'Liquid Glass': `  --glass-bg:       oklch(0.09 0.04 260)
  --glass-panel:    oklch(1 0 0 / 0.04)  +  backdrop-filter: blur(16px) saturate(140%)
  --glass-stroke:   oklch(1 0 0 / 0.10)
  --ink-100:        oklch(0.97 0.005 80)
  --font-display:   "SF Pro Display", "Space Grotesk", system-ui
  --font-mono:      "JetBrains Mono", monospace
  --radius:         10px / 16px / 24px / 32px
  Rule: never convert oklch() to hex. Blur is non-negotiable.`,
  'Monochrome': `  --bg:       #0a0b0c    --panel: #111315    --line: #23282d
  --ink-0:    #e9ecee   --ink-2: #9aa1a8    --ink-5: #2e3338
  --live:     #00b872   ← one accent, used for live/status only
  --font-display:   "Chakra Petch", "Space Grotesk", system-ui
  --font-mono:      "JetBrains Mono", monospace
  --baseline: 4px — every margin/padding must be a multiple of 4
  Rule: radius ≤ 6px. No gradients except hairline dividers.`,
};

const SKILL_BLOCK = `\n<!-- ClawBridge Skill v${VERSION} -->\n# ClawBridge Design Protocol\n\nWhen implementing any UI from a ClawBridge bundle:\n- Maintain pixel-perfect fidelity — no simplification or "improvements"\n- Preserve all oklch() color values — do not convert to hex\n- Enforce family token rules: Liquid Glass (8px baseline, blur required) or Monochrome (4px baseline, radius ≤ 6px)\n- Never mix design families within a component\n- Full contract: https://github.com/miikeey1100/Claude-Design-Handoff-Vault/blob/main/CLAUDE.md\n<!-- /ClawBridge Skill -->\n`;

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302)
        return get(res.headers.location).then(resolve, reject);
      if (res.statusCode !== 200)
        return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
      const buf = [];
      res.on('data', c => buf.push(c));
      res.on('end', () => resolve(Buffer.concat(buf).toString('utf8')));
    }).on('error', reject);
  });
}

async function loadManifest() {
  try {
    const raw = await fs.readFile(LOCAL_MANIFEST, 'utf8');
    return JSON.parse(raw);
  } catch {
    try {
      const raw = await get(`${CDN}/manifest.json`);
      return JSON.parse(raw);
    } catch (e) {
      stderr.write(`Cannot load manifest: ${e.message}\n`);
      exit(1);
    }
  }
}

function banner(b) {
  const line = '═'.repeat(52);
  return `${line}\n  ClawBridge Protocol · ${b.slug} · v${VERSION}\n  ${b.title}\n  Family: ${b.family}  ·  Fidelity: ${b.fidelity}%  ·  CDN: GitHub Raw\n${line}\n`;
}

const [,, cmd, arg] = argv;

if (!cmd || cmd === '--help' || cmd === '-h') {
  stdout.write(`
ClawBridge — The Design-to-Code Protocol for Claude  v${VERSION}

  npx clawbridge use <slug>        Stream bundle into Claude Code
  npx clawbridge list              Show all registered bundles
  npx clawbridge info <slug>       Bundle metadata + preview URL
  npx clawbridge manifest          Print CDN registry JSON
  npx clawbridge skill install     Install ClawBridge as a Claude Skill

Examples:
  npx clawbridge use aerodrop | claude
  claude -p "$(npx clawbridge use luxar-vault)"
  npx clawbridge use visionsynth > prompt.txt && claude < prompt.txt

Protocol: https://github.com/miikeey1100/Claude-Design-Handoff-Vault
`);
  exit(0);
}

const manifest = await loadManifest();
const bySlug = Object.fromEntries(manifest.bundles.map(b => [b.slug, b]));
const slugList = manifest.bundles.map(b => b.slug).join(', ');

if (cmd === 'manifest') {
  stdout.write(JSON.stringify(manifest, null, 2) + '\n');
  exit(0);
}

if (cmd === 'list') {
  stdout.write(`\nClawBridge Registry  —  ${manifest.bundles.length} bundles\n\n`);
  for (const b of manifest.bundles)
    stdout.write(`  ${b.slug.padEnd(16)} ${String(b.fidelity).padStart(2)}% fidelity  [${b.family}]  ${b.title}\n`);
  stdout.write(`\nProtocol v${VERSION} · CDN: ${manifest.cdn}\n\n`);
  exit(0);
}

if (cmd === 'info') {
  if (!arg || !bySlug[arg]) {
    stderr.write(`Unknown slug: "${arg}"\nAvailable: ${slugList}\n`);
    exit(1);
  }
  const b = bySlug[arg];
  stdout.write(JSON.stringify(b, null, 2) + '\n');
  stdout.write(`\nPreview: ${manifest.cdn}/${b.preview}\n`);
  stdout.write(`Comparison: ${manifest.cdn}/${b.comparison}\n`);
  exit(0);
}

if (cmd === 'skill') {
  if (arg !== 'install') {
    stderr.write(`Unknown skill subcommand: "${arg}"\nTry: npx clawbridge skill install\n`);
    exit(1);
  }
  const target = path.join(cwd(), 'CLAUDE.md');
  let existing = '';
  try { existing = await fs.readFile(target, 'utf8'); } catch {}
  if (existing.includes('ClawBridge Skill')) {
    stdout.write(`ClawBridge skill already present in ${target}\n`);
    exit(0);
  }
  await fs.writeFile(target, existing + SKILL_BLOCK, 'utf8');
  stdout.write(`✓ ClawBridge skill installed → ${target}\n`);
  stdout.write(`  Claude Code will now enforce Liquid Glass + Monochrome token rules.\n`);
  exit(0);
}

if (cmd !== 'use') {
  stderr.write(`Unknown command: "${cmd}"\nTry: npx clawbridge --help\n`);
  exit(1);
}

if (!arg || !bySlug[arg]) {
  stderr.write(`Unknown bundle: "${arg}"\nAvailable: ${slugList}\n`);
  exit(1);
}

const b = bySlug[arg];
const htmlUrl = `${manifest.cdn}/${b.dir}/${b.primary}`;
const chatUrl = `${manifest.cdn}/${b.dir}/${b.chat}`;

let html, chat;
try {
  [html, chat] = await Promise.all([
    get(htmlUrl),
    get(chatUrl).catch(() => '(no chat transcript available)'),
  ]);
} catch (e) {
  stderr.write(`Fetch failed: ${e.message}\n`);
  exit(1);
}

stdout.write(`${banner(b)}
## Design Contract  (${b.family} token family)
\`\`\`css
${TOKENS[b.family]}
\`\`\`

## Original Design Intent
> Source: ${manifest.cdn}/${b.dir}/${b.chat}

${chat.split('\n').slice(0, 60).join('\n')}

## Primary Design File: ${path.basename(b.primary)}
> Source: ${htmlUrl}

\`\`\`html
${html}
\`\`\`

## ClawBridge Implementation Directive
You are implementing a ClawBridge bundle. This is a pixel-perfect contract:

1. **Fidelity is non-negotiable.** Target: ${b.fidelity}% CSS match. Do not simplify.
2. **Preserve all oklch() values.** Never convert to hex or hsl.
3. **Token family: ${b.family}.** Every radius, blur, spacing, and type value must match.
4. **No scope creep.** Do not add features, animations, or "improvements" not in the original.
5. **Framework choice is yours** — React, Vue, SwiftUI, plain CSS — match the visual output.

Full protocol: https://github.com/miikeey1100/Claude-Design-Handoff-Vault/blob/main/CLAUDE.md
Preview: ${manifest.cdn}/${b.preview}
`);
