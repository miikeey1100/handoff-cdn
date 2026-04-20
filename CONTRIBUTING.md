# Contributing to Handoff-CDN

Thanks for adding to the protocol. Here's how to submit a bundle.

## Quick path

```bash
git clone https://github.com/miikeey1100/handoff-cdn
cd handoff-cdn
npm run setup                    # installs playwright-chromium
```

## 1. Export from Claude Design

Go to [claude.ai/design](https://claude.ai/design), finish your design, and export the handoff bundle. Drop it under `bundles/<your-slug>/`:

```
bundles/<slug>/
  README.md           (the Claude Design handoff README — keep as-is)
  chats/
    chat1.md          (your conversation transcript — required)
  project/
    YourDesign.html   (primary file)
    *.jsx             (supporting components if any)
    *.css             (token files if any)
```

## 2. Pick a family — no mixing

Every bundle must belong to exactly **one** design family. Read [CLAUDE.md](CLAUDE.md) for the full contract.

| Family | When to use |
|---|---|
| **Liquid Glass** | oklch deep backgrounds, frosted panels, backdrop-filter blur |
| **Monochrome** | silver/ink ladder, 4px baseline, ≤6px radius, one accent only |

**If you mixed families: fix it before submitting.** A PR with mixed tokens will be closed.

## 3. Add your bundle to manifest.json

```json
{
  "slug": "your-slug",
  "title": "YourApp — Short Description",
  "description": "One or two sentences from the chat transcript describing what was built and its key features.",
  "family": "Liquid Glass",
  "fidelity": 95,
  "tags": ["mobile", "react", "relevant-tags"],
  "dir": "bundles/your-slug",
  "primary": "project/YourDesign.html",
  "chat": "chats/chat1.md",
  "preview": "previews/your-slug.png",
  "comparison": "previews/comparisons/your-slug.png"
}
```

**Fidelity score:** Be honest. Score based on how completely the HTML covers the design intent — color tokens, radii, blur, spacing, type, interactive states.

## 4. Capture screenshots

```bash
npm run capture    # regenerates previews/<slug>.png (1920×1080 @2x)
npm run compare    # regenerates previews/comparisons/<slug>.png (with fidelity badge)
```

Both scripts auto-detect new entries from `manifest.json`. Commit both PNGs.

## 5. Update README gallery

Add a row to the correct gallery table in [README.md](README.md):

```markdown
| ![YourSlug](previews/comparisons/your-slug.png) | **YourApp**<br>Short tagline | Liquid Glass | **95% CSS Match** | `npx handoff-cdn use your-slug` |
```

Elite Tier (top table) = fidelity ≥ 97%. Extended Library (bottom table) = everything else.

## 6. Update `bin/handoff-cdn.js` (if your primary file has a non-standard path)

The CLI reads all routing from `manifest.json`, so in most cases no change is needed. Only update if your bundle has unusual file paths that `handoff-cdn` can't infer.

## 7. Open a PR

Title: `feat(bundle): <slug> — <short description>`

Include in the PR body:
- [ ] Family declared and no mixing
- [ ] `manifest.json` entry added with description
- [ ] `previews/<slug>.png` committed
- [ ] `previews/comparisons/<slug>.png` committed
- [ ] README gallery row added
- [ ] Fidelity score is honest

CI will re-run `npm run compare` on the PR and upload the screenshots as a build artifact. Reviewers check the fidelity badge screenshot before merging.

## Rules

- **One family per bundle.** Non-negotiable.
- **No external image hosts.** Images must be in `bundles/<slug>/project/`. Google Fonts CDN is fine.
- **HTML must render standalone** via the compare script's HTTP server — no extra build step.
- **Chat transcript is required.** It's what Claude Code reads for user intent. If you lost it, reconstruct it honestly.
- **No AI-generated screenshots as "originals".** The HTML prototype IS the source of truth.

## Questions

Open a Discussion on GitHub. Don't open an Issue for contribution questions.
