#!/bin/bash
set -uo pipefail

# Installs the team's Claude Code plugins and the gstack skills bundle in
# Claude Code on the web sessions. Local sessions are untouched.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

log() { echo "[session-start] $*"; }

add_marketplace() {
  local out
  if out=$(claude plugin marketplace add "$1" 2>&1); then
    log "marketplace added: $1"
  else
    # Already-added is the common, benign case; anything else gets surfaced.
    log "marketplace $1 not added: $(echo "$out" | tail -1)"
  fi
}

install_plugin() {
  local out
  if out=$(claude plugin install "$1" 2>&1); then
    log "installed $1"
  else
    log "WARN: could not install $1: $(echo "$out" | tail -1)"
  fi
}

# Plugin versions are not SHA-pinned: the Claude Code CLI installs whatever
# the marketplace currently publishes, so these installs trust the three
# marketplace repos below on an ongoing basis. Fork them into your own org
# and point these at the forks if you need a review gate.
add_marketplace obra/superpowers
add_marketplace anthropics/claude-plugins-official
add_marketplace thedotmack/claude-mem

install_plugin superpowers@superpowers-dev
install_plugin frontend-design@claude-plugins-official
install_plugin code-review@claude-plugins-official
install_plugin security-guidance@claude-plugins-official
install_plugin claude-mem@thedotmack

# gstack is a skills bundle, not a plugin: clone, pin to a reviewed SHA,
# verify, then run its setup. Bump GSTACK_SHA deliberately to upgrade.
# The web sandbox network policy blocks Playwright's Chromium download, so
# browser-driven skills (/browse, /qa) stay unavailable here; everything
# else in gstack works.
GSTACK_REPO="https://github.com/garrytan/gstack.git"
GSTACK_SHA="421460f03ac9f917a3bf02934e5be30ff52d2e25"
GSTACK_DIR="$HOME/.claude/skills/gstack"
GSTACK_LOG="$HOME/.claude/gstack-setup.log"

install_gstack() {
  if [ ! -d "$GSTACK_DIR/.git" ]; then
    git clone --single-branch "$GSTACK_REPO" "$GSTACK_DIR" 2>&1 | tail -1 \
      || { log "WARN: could not clone gstack"; return; }
  fi

  # Trust the checkout only if it is actually our pinned repo and SHA --
  # a directory merely existing at this path is not enough.
  local origin
  origin=$(git -C "$GSTACK_DIR" remote get-url origin 2>/dev/null)
  if [ "$origin" != "$GSTACK_REPO" ]; then
    log "WARN: $GSTACK_DIR origin is '$origin', expected '$GSTACK_REPO'; refusing to set up gstack"
    return
  fi

  if [ "$(git -C "$GSTACK_DIR" rev-parse HEAD 2>/dev/null)" != "$GSTACK_SHA" ]; then
    git -C "$GSTACK_DIR" fetch --quiet origin "$GSTACK_SHA" 2>/dev/null
    git -C "$GSTACK_DIR" checkout --quiet --detach "$GSTACK_SHA" 2>/dev/null \
      || { log "WARN: pinned gstack SHA $GSTACK_SHA not reachable; refusing to set up gstack"; return; }
  fi

  if [ -f "$GSTACK_DIR/.setup-done-$GSTACK_SHA" ]; then
    log "gstack already installed at $GSTACK_SHA"
    return
  fi

  if (cd "$GSTACK_DIR" && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 ./setup >"$GSTACK_LOG" 2>&1); then
    touch "$GSTACK_DIR/.setup-done-$GSTACK_SHA"
    log "installed gstack at $GSTACK_SHA (setup log: $GSTACK_LOG)"
  elif grep -q "Host not in allowlist" "$GSTACK_LOG" 2>/dev/null; then
    # Only the Chromium download failed (blocked by the sandbox network
    # policy). Non-browser skills work, so don't re-run setup every session.
    touch "$GSTACK_DIR/.setup-done-$GSTACK_SHA"
    log "installed gstack at $GSTACK_SHA without browser support (download blocked by network policy; log: $GSTACK_LOG)"
  else
    log "WARN: gstack setup failed. Last lines of $GSTACK_LOG:"
    tail -5 "$GSTACK_LOG" 2>/dev/null | sed 's/^/[session-start]   /'
  fi
}

install_gstack

log "done"
exit 0
