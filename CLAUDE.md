# Phasor

Static marketing/landing site (plain HTML/CSS/JS, deployed on Vercel). No build
step, no package manager, no test suite — edit files directly and preview
`index.html`.

## gstack

gstack is installed at `~/.claude/skills/gstack`. Use the `/browse` skill from
gstack for all web browsing; never use `mcp__claude-in-chrome__*` tools.

Available skills: /office-hours, /plan-ceo-review, /plan-eng-review,
/plan-design-review, /design-consultation, /design-shotgun, /design-html,
/review, /ship, /land-and-deploy, /canary, /benchmark, /browse,
/connect-chrome, /qa, /qa-only, /design-review, /setup-browser-cookies,
/setup-deploy, /setup-gbrain, /retro, /investigate, /document-release,
/document-generate, /codex, /cso, /autoplan, /plan-devex-review,
/devex-review, /careful, /freeze, /guard, /unfreeze, /gstack-upgrade, /learn.

Note: in Claude Code on the web, the sandbox network policy blocks the
Chromium download, so browser-driven skills (/browse, /qa, /connect-chrome,
/design-review) only work in local sessions.
