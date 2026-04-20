# Handoff-CDN — Claude Skill

Handoff-CDN is usable as a **permanent Claude Skill**: a design-token contract baked into your project's `CLAUDE.md` so Claude Code enforces Liquid Glass and Monochrome fidelity rules on every session — no flags required.

## Install (1 command)

```bash
npx handoff-cdn skill install
```

This appends the Handoff-CDN contract block to `./CLAUDE.md` (creates it if absent). From that point, every Claude Code session in that directory inherits the protocol.

## What the skill enforces

When the Handoff-CDN skill block is present in `CLAUDE.md`, Claude Code will:

- **Know both token families** — Liquid Glass and Monochrome — and apply the correct one per bundle
- **Refuse oklch→hex conversions** — all color values preserved as authored
- **Enforce spacing baselines** — 4px grid for Monochrome, 8px for Liquid Glass
- **Cap Monochrome radius** at 6px; enforce minimum 10px for Liquid Glass
- **Label PRs** with the design family in the title (e.g. `[Liquid Glass] feat: AeroDrop mobile nav`)
- **Block design mixing** — a component may not use tokens from both families

## Manual install (copy into your CLAUDE.md)

```markdown
<!-- Handoff-CDN Skill v1.0 -->
# Handoff-CDN Design Protocol

When implementing any UI from a Handoff-CDN bundle:
- Maintain pixel-perfect fidelity — no simplification or "improvements"
- Preserve all oklch() color values — do not convert to hex
- Enforce family token rules: Liquid Glass (8px baseline, blur required) or Monochrome (4px baseline, radius ≤ 6px)
- Never mix design families within a component
- Full contract: https://github.com/miikeey1100/handoff-cdn/blob/main/CLAUDE.md
<!-- /Handoff-CDN Skill -->
```

## Token reference

### Liquid Glass
```css
--glass-bg:      oklch(0.09 0.04 260)
--glass-panel:   oklch(1 0 0 / 0.04)  /* + backdrop-filter: blur(16px) saturate(140%) */
--glass-stroke:  oklch(1 0 0 / 0.10)
--ink-100:       oklch(0.97 0.005 80)
--font-display:  "SF Pro Display", "Space Grotesk", system-ui
--font-mono:     "JetBrains Mono", monospace
--radius:        10px / 16px / 24px / 32px
```

### Monochrome
```css
--bg:      #0a0b0c    --panel: #111315    --line: #23282d
--ink-0:   #e9ecee    --ink-2: #9aa1a8    --ink-5: #2e3338
--live:    #00b872    /* one accent — live/status states only */
--font-display:  "Chakra Petch", "Space Grotesk", system-ui
--font-mono:     "JetBrains Mono", monospace
--baseline: 4px
```

## Use with any bundle

```bash
# Stream a bundle into Claude Code with the skill active
npx handoff-cdn use aerodrop | claude

# Or inline
claude -p "$(npx handoff-cdn use visionsynth)"
```

## Uninstall

Remove the `<!-- Handoff-CDN Skill -->` block from `CLAUDE.md`. The skill has no other footprint.

---

> Handoff-CDN Protocol v1.0 · https://github.com/miikeey1100/handoff-cdn
