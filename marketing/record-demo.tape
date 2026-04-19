# VHS tape — record the ClawBridge demo GIF
# Install VHS: brew install vhs   OR   go install github.com/charmbracelet/vhs@latest
# Run: vhs marketing/record-demo.tape
# Output: marketing/demo.gif  (drop into README at the GIF placeholder)

Output marketing/demo.gif

Set Shell bash
Set FontSize 14
Set FontFamily "JetBrains Mono"
Set Width 1200
Set Height 500
Set Theme "Dracula"
Set Padding 20
Set TypingSpeed 60ms
Set PlaybackSpeed 0.8

# Opening pause
Sleep 1s

# Show what ClawBridge does
Type "# ClawBridge — stream a design bundle into Claude Code"
Sleep 500ms
Enter
Sleep 300ms

# List available bundles
Type "npx clawbridge list"
Sleep 500ms
Enter
Sleep 2s

# Use a bundle
Type "npx clawbridge use aerodrop | claude"
Sleep 500ms
Enter
Sleep 4s

# Show it working
Type "# Done. Claude Code is now implementing AeroDrop at 99% fidelity."
Sleep 2s
Enter

Sleep 1s
