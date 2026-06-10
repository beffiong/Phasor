#!/bin/bash
set -uo pipefail

# Installs the team's Claude Code plugins and the gstack skills bundle in
# Claude Code on the web sessions. Local sessions are untouched.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

log() { echo "[session-start] $*"; }

add_marketplace() {
  claude plugin marketplace add "$1" >/dev/null 2>&1 \
    || log "marketplace $1 already added or unreachable"
}

install_plugin() {
  if claude plugin install "$1" >/dev/null 2>&1; then
    log "installed $1"
  else
    log "WARN: could not install $1"
  fi
}

add_marketplace obra/superpowers
add_marketplace anthropics/claude-plugins-official
add_marketplace thedotmack/claude-mem

install_plugin superpowers@superpowers-dev
install_plugin frontend-design@claude-plugins-official
install_plugin code-review@claude-plugins-official
install_plugin security-guidance@claude-plugins-official
install_plugin claude-mem@thedotmack

# gstack is a skills bundle, not a plugin: clone + setup on first run only.
# The web sandbox network policy blocks Playwright's Chromium download, so
# browser-driven skills (/browse, /qa) stay unavailable here; everything
# else in gstack works.
GSTACK_DIR="$HOME/.claude/skills/gstack"
if [ ! -d "$GSTACK_DIR" ]; then
  if git clone --single-branch --depth 1 \
      https://github.com/garrytan/gstack.git "$GSTACK_DIR" >/dev/null 2>&1; then
    if (cd "$GSTACK_DIR" && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 ./setup >/dev/null 2>&1); then
      log "installed gstack"
    else
      log "WARN: gstack setup finished with errors (expected for the browser download)"
    fi
  else
    log "WARN: could not clone gstack"
  fi
else
  log "gstack already installed"
fi

log "done"
exit 0
