# VHS tape — cinematic Handoff-CDN demo
# Install: brew install vhs  OR  go install github.com/charmbracelet/vhs@latest
# Run: vhs marketing/record-demo.tape

Output marketing/demo-terminal.gif

Require vhs >= 0.7.0

Set Shell "bash"
Set FontSize 14
Set FontFamily "JetBrains Mono"
Set Width 900
Set Height 500
Set Theme "Catppuccin Mocha"
Set Padding 24
Set FrameRate 30
Set PlaybackSpeed 0.8

# ── Act 1: The problem ──────────────────────────────────────────

Sleep 1s
Type "# You've done this before."
Sleep 2s
Enter
Sleep 500ms

Type `claude "build me a dark dashboard with glass panels and green accents"`
Sleep 2s
Enter
Sleep 3s

Type "# Claude guesses. Generic gray. Wrong green. Wrong font."
Sleep 2s
Enter
Sleep 1s

Type "# There's a better way."
Sleep 2.5s
Enter
Sleep 1.5s

Ctrl+C

# ── Act 2: The reveal ───────────────────────────────────────────

Sleep 800ms
Type "npx handoff-cdn list"
Sleep 500ms
Enter
Sleep 2s

# output appears — 8 bundles with families
Sleep 3s

# ── Act 3: The command ──────────────────────────────────────────

Sleep 800ms
Type "npx handoff-cdn use agentic-ops | claude"
Sleep 1s
Enter
Sleep 1s

# streaming begins
Type "# Fetching bundle from GitHub Raw..."
Sleep 500ms
Enter
Sleep 1.5s

Type "# ✓ HTML prototype      31 KB"
Sleep 300ms
Enter
Sleep 500ms
Type "# ✓ Intent transcript    4 KB"
Sleep 300ms
Enter
Sleep 500ms
Type "# ✓ Token contract      47 tokens locked"
Sleep 300ms
Enter
Sleep 1s

Type "# Claude is implementing — not guessing."
Sleep 3s
Enter
Sleep 2s

# ── Act 4: The payoff ───────────────────────────────────────────

Sleep 500ms
Type "# #0a0b0c base. #00b872 accent. 4px grid. Exact."
Sleep 3s
Enter
Sleep 2s

Type "# npx handoff-cdn use <slug> | claude"
Sleep 3s
Enter
Sleep 4s
