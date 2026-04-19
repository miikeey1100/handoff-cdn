# r/ClaudeAI — ClawBridge technical post

**Title:** I built a Design-as-Code CDN that lets Claude Code stream high-fidelity UIs instantly

---

## Body

Hey r/ClaudeAI — sharing something I've been building around Claude Design handoff bundles.

**The problem:** Claude Design exports full HTML prototypes — complete with tokens, layout, and intent. But the workflow to get them into Claude Code was always manual: copy HTML, copy tokens, write a prompt, hope Claude Code doesn't hallucinate the colors.

**The solution:** ClawBridge — a protocol that turns a GitHub repo of bundles into a live CDN, and a CLI that assembles the full implementation brief automatically.

```bash
npx clawbridge use aerodrop | claude
```

**Repo:** https://github.com/miikeey1100/Claude-Design-Handoff-Vault

### How the prompt is structured

`npx clawbridge use <slug>` outputs:

```
═══════════════════════════════════════
  ClawBridge Protocol · aerodrop · v1.0
  Family: Liquid Glass  ·  Fidelity: 99%
═══════════════════════════════════════

## Design Contract (Liquid Glass tokens)
  --glass-panel:  oklch(1 0 0 / 0.04) + blur(16px) saturate(140%)
  --glass-stroke: oklch(1 0 0 / 0.10)
  ...

## Original Design Intent (chat transcript — 60 lines)
  [user's actual intent from Claude Design session]

## Primary Design File: AeroDrop.html
  [full HTML prototype — ~800 lines]

## ClawBridge Implementation Directive
  1. Fidelity is non-negotiable. Target: 99% CSS match.
  2. Preserve all oklch() values.
  3. Token family: Liquid Glass. Match every radius, blur, spacing.
  ...
```

Claude Code gets the source, the tokens, and a binding contract. No vagueness.

### The Skill layer

The really useful part: `npx clawbridge skill install` writes the design contract into your project's `CLAUDE.md`. Every Claude Code session in that directory will automatically know both token families (Liquid Glass + Monochrome), enforce oklch preservation, and apply the correct spacing baseline — without any flags.

### The CDN registry

`manifest.json` is the protocol's registry:

```json
{
  "protocol": "clawbridge",
  "version": "1.0.0",
  "cdn": "https://raw.githubusercontent.com/miikeey1100/Claude-Design-Handoff-Vault/main",
  "bundles": [
    { "slug": "aerodrop", "fidelity": 99, "family": "Liquid Glass", ... },
    ...
  ]
}
```

Machine-readable, stable URL, fetchable by any tool. ClawBridge reads it at runtime.

### Technical choices worth discussing

1. **Zero runtime deps** — the CLI uses only `node:https`, `node:fs`, `node:process`. No npm install needed to run.
2. **Local manifest fallback** — if the CDN is unreachable, reads the local `manifest.json` automatically.
3. **Playwright comparison screenshots** — `npm run compare` re-renders every bundle with a fidelity badge overlay injected via `page.evaluate()` before capture. No image manipulation library.
4. **Why GitHub Raw as CDN** — no server, no infra, no rate limiting for this traffic level. Applying for Anthropic OSS grant to fund a proper CDN if stars hit 5K.

### Questions I'd like feedback on

1. Is the `CLAUDE.md` skill approach the right mechanism, or is there a better Claude Code primitive for this?
2. Worth adding a `npx clawbridge new` command to export from Claude Design directly?
3. Anyone done CSS fidelity scoring programmatically? The scores are currently manual — curious if there's a headless approach.

★ If this solves a workflow you have — **star the repo**. Pushing for 5K to apply for the Anthropic OSS grant.

---

*Flair: `Showcase` or `Tool`*
*Post time: Tuesday 2:00pm GMT (after HN + r/VibeCoding — stagger 30 min each)*
