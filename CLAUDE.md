# CLAUDE.md — Vault Design Contract

> This repo is published as the **`clawkit`** npm package. When `npx clawkit use <slug>` pipes a bundle into Claude Code, it includes this design contract automatically. Do not deviate from the token families below.

> Read this before adding, editing, or refactoring **any** UI in this repo.
> Every preview in `/previews` belongs to one of two families. Pick one. Do not mix.

---

## Family 1 — Liquid Glass

**Used by:** AeroDrop · BioPulse · Luxar Vault · VisionSynth

The aesthetic: deep, almost-black backgrounds with translucent panels floating above radial color washes. Soft blur, low-saturation glow, oklch everywhere.

### Tokens

```css
:root {
  /* Surfaces */
  --glass-bg-0:     oklch(0.09 0.04 260);   /* deepest */
  --glass-bg-1:     oklch(0.14 0.008 270);
  --glass-panel:    oklch(1 0 0 / 0.04);    /* glass fill */
  --glass-panel-hi: oklch(1 0 0 / 0.08);    /* hover/active */
  --glass-stroke:   oklch(1 0 0 / 0.10);    /* hairline */
  --glass-stroke-hi:oklch(1 0 0 / 0.18);

  /* Wash (always behind glass, never in front) */
  --wash-warm:      radial-gradient(120% 80% at 20% 20%, #1a0d18 0%, #050508 60%);
  --wash-cool:      radial-gradient(120% 80% at 80% 20%, #0d141a 0%, #050508 60%);

  /* Ink */
  --ink-100:        oklch(0.97 0.005 80);
  --ink-70:         oklch(0.78 0.008 80);
  --ink-50:         oklch(0.58 0.010 80);
  --ink-30:         oklch(0.40 0.010 80);

  /* Effects */
  --blur-sm: 8px;  --blur-md: 16px;  --blur-lg: 28px;
  --radius-sm: 10px; --radius-md: 16px; --radius-lg: 24px; --radius-xl: 32px;

  /* Type */
  --font-display: "SF Pro Display", "Space Grotesk", -apple-system, system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;
}
```

### Rules
- **Always** layer: wash → glass panel → content. Never solid panel on solid bg.
- `backdrop-filter: blur(var(--blur-md)) saturate(140%)` on every panel.
- 1px hairline stroke; never use box-shadow as a border.
- Buttons: glass fill, no drop shadow. Hover bumps panel + stroke one step.
- No pure white text; cap at `--ink-100` (oklch 0.97).

### Don't
- ❌ Flat brand colors (#0066FF etc.). Use oklch washes.
- ❌ Heavy drop shadows. Use stroke + blur for elevation.
- ❌ Border-radius < 8 or > 32.

---

## Family 2 — Monochrome

**Used by:** Agentic Ops · LogicChain (Orchestrator) · NeuralStore · Frontier

The aesthetic: industrial-minimal. Silver/ink ladders, hairline grids, terminal-grade type. Everything snaps to a 4px baseline.

### Tokens

```css
:root {
  /* Ink ladder (dark mode) */
  --ink-0: #e9ecee;  --ink-1: #c9ced3;  --ink-2: #9aa1a8;
  --ink-3: #6f767d;  --ink-4: #4a5056;  --ink-5: #2e3338;
  --ink-6: #1c1f22;  --ink-7: #121416;  --ink-8: #0b0c0d;

  /* Surfaces */
  --bg:      #0a0b0c;
  --panel:   #111315;
  --panel-2: #16191c;
  --line:    #23282d;
  --line-hi: #2e343a;

  /* Light mode (NeuralStore) */
  --paper:   #ffffff;
  --paper-ink: #000000;
  --paper-line: rgba(0,0,0,0.06);

  /* Single accent — earned, not decorative */
  --live: #00b872;             /* status only */

  /* Type */
  --font-display: "Chakra Petch", "Space Grotesk", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;
  --font-body:    "Helvetica Neue", Helvetica, Arial, sans-serif;

  /* Spacing — 4px baseline, no exceptions */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px;
  --s-6: 24px; --s-8: 32px; --s-12: 48px; --s-16: 64px;
}
```

### Rules
- **4px baseline.** Every padding/margin/height is a multiple of 4. No 5, 7, 13.
- 1px lines, color `--line`. Use `--line-hi` only for active/focus.
- Typography hierarchy is **weight + tracking**, not size + color.
- Mono for numbers, codes, IDs, status. Display for headings. Body for prose.
- `--live` is the **only** color token. Reserve for live state. Never decorative.

### Don't
- ❌ Multiple accent colors. One. Earned.
- ❌ Soft shadows. Lines only.
- ❌ Border-radius > 6. Square is correct.
- ❌ Gradients (except 1px hairline gradient on dividers).

---

## Pull request checklist

Before opening a PR that touches a bundle or adds a new one:

- [ ] Picked **one** family. Tokens above are the source of truth.
- [ ] Added/updated the bundle under `bundles/<slug>/project/`.
- [ ] Re-ran `npm run capture` and committed the new `previews/<slug>.png`.
- [ ] Updated the gallery row in `README.md` (slug, title, family).
- [ ] No external image hosts in HTML (CDN fonts OK; images must be local).
- [ ] HTML renders standalone via the capture HTTP server (no extra build step).

If unsure which family to use, look at the closest existing bundle in `/previews` and match it. When in doubt, **Monochrome**.
