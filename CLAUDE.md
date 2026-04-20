# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What this repo is

**Handoff-CDN** — a Design-to-Code protocol. It is an npm package (`handoff-cdn`/`clawkit` binaries) that fetches self-contained HTML/CSS/JS design bundles from a GitHub Raw CDN and pipes them as structured implementation prompts into Claude Code.

```
npx handoff-cdn use aerodrop | claude
```

The repo has two roles simultaneously: (1) a CDN of 8 design bundles, and (2) a published CLI that consumers `npx`-run without cloning.

---

## Commands

```bash
npm run setup      # npm install + npx playwright install chromium
npm run capture    # Playwright: render all 8 bundles → previews/<slug>.png
npm run compare    # Playwright: render + inject fidelity badge → previews/comparisons/<slug>.png

node bin/handoff-cdn.js --help
node bin/handoff-cdn.js list
node bin/handoff-cdn.js use <slug>         # streams bundle prompt to stdout
node bin/handoff-cdn.js info <slug>        # JSON metadata
node bin/handoff-cdn.js manifest           # full CDN registry
node bin/handoff-cdn.js skill install      # appends Handoff-CDN block to ./CLAUDE.md
```

There are no tests, no lint step, and no build step. The scripts run directly with Node 20+ ESM.

---

## Architecture

### Protocol layers

```
manifest.json          Single source of truth — all bundle metadata, CDN base URL, family tags
bin/handoff-cdn.js      Fetch layer — reads manifest (local first, CDN fallback), builds prompt
bin/clawkit            Legacy binary — hardcoded BUNDLES map, kept for backward compat
scripts/capture.mjs    Playwright capture — spins up a node:http server over bundles/, screenshots
scripts/compare.mjs    Same as capture but reads manifest and injects a fidelity badge via page.evaluate()
```

### `manifest.json` is the single registry

Both `bin/handoff-cdn.js` and `scripts/compare.mjs` read `manifest.json` at runtime. When you add a bundle, add it to `manifest.json` — the scripts derive all paths from it. `bin/clawkit` has a **hardcoded** BUNDLES map and does **not** read manifest; update it separately if you need the old binary to know a new slug.

### Why the local HTTP server in capture scripts

Bundles that load JSX via Babel standalone (`aerodrop`, `holowallet`, `visionsynth`) cannot be served from `file://` — Babel can't `fetch()` sibling files cross-origin. Both capture scripts boot a throwaway `node:http` server on a random port, serve `bundles/` from it, then shut down. This is the only reason the server exists; do not remove it.

### Bundle structure (each of 8 bundles)

```
bundles/<slug>/
  README.md            Handoff README from claude.ai/design — do not edit
  chats/chat1.md       Original user intent transcript — required for handoff-cdn use
  project/             Primary HTML + any supporting JSX, CSS, images
```

The primary HTML file is self-contained: React loaded from unpkg CDN, all styles inline. Some bundles have `.jsx` sidecars loaded via `<script type="text/babel" src="...">` — these are served by the capture HTTP server and are not transpiled separately.

### Design families — two only, no mixing

Every bundle belongs to exactly one family. The family is declared in `manifest.json` and enforced by `CLAUDE.md`. Both `bin/handoff-cdn.js` and `SKILL.md` embed the token sets.

| Family | Bundles | Key rule |
|---|---|---|
| **Liquid Glass** | aerodrop, biopulse, luxar-vault, visionsynth | oklch surfaces, `backdrop-filter: blur(16px) saturate(140%)`, radius 10–32px |
| **Monochrome** | agentic-ops, orchestrator, neuralstore, frontier | #0a0b0c base, 4px baseline grid, radius ≤ 6px, one accent `#00b872` |

---

## Adding a bundle

1. Drop the handoff export under `bundles/<slug>/`
2. Add an entry to `manifest.json` (slug, title, description, family, fidelity, dir, primary, chat, preview, comparison)
3. `npm run capture` then `npm run compare` — commit both PNGs
4. Add a gallery row to `README.md`
5. Update `bin/clawkit` BUNDLES map if legacy compat is needed

CI (`.github/workflows/previews.yml`) runs both scripts on push to main and commits updated PNGs automatically.

---

## Design contract (enforced below — do not remove)

> This repo is published as the **`handoff-cdn`** npm package. When `npx handoff-cdn use <slug>` pipes a bundle into Claude Code, it includes this design contract automatically. Do not deviate from the token families below.

> Every preview in `/previews` belongs to one of two families. Pick one. Do not mix.

---

## Family 1 — Liquid Glass

**Used by:** AeroDrop · BioPulse · Luxar Vault · VisionSynth

### Tokens

```css
:root {
  --glass-bg-0:      oklch(0.09 0.04 260);
  --glass-bg-1:      oklch(0.14 0.008 270);
  --glass-panel:     oklch(1 0 0 / 0.04);
  --glass-panel-hi:  oklch(1 0 0 / 0.08);
  --glass-stroke:    oklch(1 0 0 / 0.10);
  --glass-stroke-hi: oklch(1 0 0 / 0.18);
  --wash-warm:       radial-gradient(120% 80% at 20% 20%, #1a0d18 0%, #050508 60%);
  --wash-cool:       radial-gradient(120% 80% at 80% 20%, #0d141a 0%, #050508 60%);
  --ink-100:         oklch(0.97 0.005 80);
  --ink-70:          oklch(0.78 0.008 80);
  --ink-50:          oklch(0.58 0.010 80);
  --ink-30:          oklch(0.40 0.010 80);
  --blur-sm: 8px;  --blur-md: 16px;  --blur-lg: 28px;
  --radius-sm: 10px; --radius-md: 16px; --radius-lg: 24px; --radius-xl: 32px;
  --font-display: "SF Pro Display", "Space Grotesk", -apple-system, system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;
}
```

### Rules
- Layer order: wash → glass panel → content. Never solid panel on solid bg.
- `backdrop-filter: blur(var(--blur-md)) saturate(140%)` on every panel.
- 1px hairline stroke; never use box-shadow as a border.
- Buttons: glass fill, no drop shadow. Hover bumps panel + stroke one step.
- No pure white text; cap at `--ink-100` (oklch 0.97).
- ❌ Flat brand colors. ❌ Heavy drop shadows. ❌ Border-radius < 8 or > 32.

---

## Family 2 — Monochrome

**Used by:** Agentic Ops · Orchestrator · NeuralStore · Frontier

### Tokens

```css
:root {
  --ink-0: #e9ecee;  --ink-1: #c9ced3;  --ink-2: #9aa1a8;
  --ink-3: #6f767d;  --ink-4: #4a5056;  --ink-5: #2e3338;
  --ink-6: #1c1f22;  --ink-7: #121416;  --ink-8: #0b0c0d;
  --bg: #0a0b0c;  --panel: #111315;  --panel-2: #16191c;
  --line: #23282d;  --line-hi: #2e343a;
  --live: #00b872;
  --font-display: "Chakra Petch", "Space Grotesk", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;
  --font-body:    "Helvetica Neue", Helvetica, Arial, sans-serif;
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px;
  --s-6: 24px; --s-8: 32px; --s-12: 48px; --s-16: 64px;
}
```

### Rules
- **4px baseline.** Every padding/margin/height is a multiple of 4.
- 1px lines at `--line`. Use `--line-hi` only for active/focus state.
- Typography hierarchy via weight + tracking, not size + color.
- Mono for numbers, codes, IDs, status. `--live` for live state only — never decorative.
- ❌ Multiple accents. ❌ Soft shadows. ❌ Border-radius > 6. ❌ Gradients (except hairline dividers).

---

## PR checklist

- [ ] One family chosen. No mixing.
- [ ] Bundle under `bundles/<slug>/project/`.
- [ ] Entry added to `manifest.json`.
- [ ] `npm run capture` + `npm run compare` run; both PNGs committed.
- [ ] `README.md` gallery row added.
- [ ] No external image hosts (CDN fonts OK).
- [ ] HTML renders standalone via the capture HTTP server.

<!-- Handoff-CDN Skill v1.0.0 -->
# Handoff-CDN Design Protocol

When implementing any UI from a Handoff-CDN bundle:
- Maintain pixel-perfect fidelity — no simplification or "improvements"
- Preserve all oklch() color values — do not convert to hex
- Enforce family token rules: Liquid Glass (8px baseline, blur required) or Monochrome (4px baseline, radius ≤ 6px)
- Never mix design families within a component
- Full contract: https://github.com/miikeey1100/handoff-cdn/blob/main/CLAUDE.md
<!-- /Handoff-CDN Skill -->
