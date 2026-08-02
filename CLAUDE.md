# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The public website for Project Phasor (project-phasor.com) — pure HTML/CSS/JS, no frameworks, no build step, no package.json, no tests. Files are served exactly as committed.

## Running locally

There is no build. Serve the repo root with any static server:

```bash
python3 -m http.server 8080
```

A `.claude/launch.json` config named `phasor-site` does exactly this — prefer starting it via the browser preview tools rather than Bash. Then open `http://localhost:8080/` (main site) and `http://localhost:8080/demo.html` (demo page).

## Deployment

Pushing to `main` deploys the whole repo to GitHub Pages via `.github/workflows/` (note: `deploy.yml` and `static.yml` are duplicate workflows that both deploy on push). `vercel.json` also exists and provides the `/demo` → `/demo.html` rewrite used by links in `index.html`; that rewrite only works on Vercel, not on GitHub Pages.

## Architecture

Two independent pages that share only the visual identity (palette, Google Fonts: Cormorant Garamond / DM Mono / Jost):

- **`index.html`** — the main marketing site. Pulls in root-level `style.css`, `cursor-trail.css`, `machine.css` and scripts `main.js` (scroll-reveal via `.reveal` class + IntersectionObserver), `hero-shader.js`, `cursor-trail.js`, `machine.js`. Hero backgrounds are the `aurora_*.mp4` videos at repo root.
- **`demo.html`** — a self-contained two-panel demo page ("The Minimalist"), all CSS/JS inline, no external libraries. Panel 1 renders `events_bg.mp4` (repo root) through a canvas honeycomb of digit glyphs with a pointer-driven reveal and size/speed sliders; Panel 4 is a results scatter + bar ranking built in SVG from data inline in the script. Animation loops are gated by IntersectionObserver and there is a `prefers-reduced-motion` static path. Note: `overflow-x` on html/body must stay `clip` (not `hidden`) or position:sticky breaks. The previous M7 demo page (Three.js, ~940KB of base64 backgrounds) is in git history before Aug 2026 if ever needed.

Static assets live at the **repo root** (`style.css`, `main.js`, `logo.png`, etc.), not under `assets/` — the file-structure diagram in README.md is outdated, as is its font list. `assets/` holds only a spare logo copy and an SVG.

## Conventions

- CSS custom properties at the top of each stylesheet/`<style>` block define the palette; reuse them instead of hard-coding colors.
- Scroll-reveal on the main site: add the `reveal` class; `main.js` staggers siblings automatically.
- Site copy is carefully voiced (short, lowercase-mono kickers, serif italic emphasis) — match the existing register when editing text.
