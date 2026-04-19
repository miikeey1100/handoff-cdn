# r/VibeCoding — ClawBridge post

**Title:** I built a Design-as-Code CDN that lets Claude Code stream high-fidelity UIs instantly

---

## Body

okay so this started as a personal problem.

i kept exporting beautiful designs from claude.ai/design and then losing them. they'd sit in a folder doing nothing because getting them *into* claude code meant copy-pasting hundreds of lines of html, tokens, context — every single time.

so i built a protocol. it's called **ClawBridge**.

```bash
npx clawbridge use aerodrop | claude
```

that one command:
1. hits a github raw CDN and fetches the full HTML prototype
2. grabs the original chat transcript (what the user actually wanted)
3. injects the complete token contract for the design family
4. formats it all as a structured brief and pipes it into claude code

claude code gets a **complete, constrained brief**. not a vague "make it look like this". the actual source, the actual tokens, the actual intent — with explicit rules: don't simplify, don't convert oklch() to hex, don't add features.

### the fidelity badge you see in the previews

every bundle has a "Code Fidelity" score. it's an honest measurement:

| bundle | score | what it covers |
|---|---|---|
| AeroDrop | 99% | all JSX components + tokens.css + every interactive state |
| Luxar Vault | 98% | full glass panel system + smart swap modal |
| Agentic Ops | 97% | monochrome silver ladder exact, terminal grid |
| VisionSynth | 97% | timeline panel + glass cards + amber accent tokens |

the screenshots in `/previews/comparisons/` are captured by playwright with a fidelity badge injected at runtime — no photoshop.

### two design families, no mixing allowed

**liquid glass** 🫧 — oklch backgrounds, radial washes, `backdrop-filter: blur(16px) saturate(140%)`. four tokens for glass:
```css
--glass-panel:   oklch(1 0 0 / 0.04);
--glass-stroke:  oklch(1 0 0 / 0.10);
/* + backdrop-filter: blur(16px) saturate(140%) */
```

**monochrome** ⚙️ — silver/ink ladder, 4px baseline, one accent (`#00b872`). radius maxes at 6px. if you need 7px you are wrong.

CLAUDE.md bans mixing. the skill enforces it automatically:
```bash
npx clawbridge skill install  # writes the contract to your CLAUDE.md
```

### it's a protocol not just a CLI

the CDN is `manifest.json` — machine-readable, stable, fetchable:
```bash
npx clawbridge manifest        # full registry JSON
npx clawbridge info luxar-vault  # metadata + preview URLs
```

third-party tools can build on it.

### star for the grant

trying to apply for anthropic's OSS grant to keep this free and add `npx clawbridge new` (export your own design to the CDN). need 5,000 stars.

→ https://github.com/miikeey1100/Claude-Design-Handoff-Vault

8 bundles now. goal is 32 by EOY. every star = one more bundle slot.

---

*Post flair: `Show r/VibeCoding` or `Tool`*
*Best time: Tuesday 1:30pm GMT — catches HN morning wave + US east coast peak (see launch-window.md)*
