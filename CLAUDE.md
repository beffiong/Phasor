# Phasor — CLAUDE.md

## What this project is
Phasor is the marketing/community website for **Project Phasor**, a neuromorphic computing initiative building bio-inspired AI (compilers, virtual machines, governance) for power-constrained autonomous systems — spacecraft, defense aircraft, and self-driving cars.

Live site: https://www.project-phasor.com

## Tech stack
- **Pure HTML / CSS / JS** — no framework, no build step, no package manager
- Google Fonts loaded via CDN (Cormorant Garamond, DM Mono, Jost)
- GitHub Actions auto-deploys to GitHub Pages on push to `main`
- Vercel handles `/demo` route rewrite (see `vercel.json`)

## File map
```
index.html          — single-page site (all sections)
demo.html           — standalone demo page
style.css           — main styles
machine.css         — "machine mode" (ML-readable) styles
cursor-trail.css    — cursor trail effect styles
main.js             — scroll-reveal animations + nav behaviour
machine.js          — human/machine toggle logic
hero-shader.js      — WebGL hero section shader
cursor-trail.js     — pixel cursor trail effect
logo.png            — site logo
aurora_background.mp4   — hero video background
aurora_episodes.mp4     — episodes section video
physics_signal_chart.svg — inline SVG chart
assets/             — duplicates of css/js/images (legacy, prefer root files)
.github/workflows/  — deploy.yml (GitHub Pages), static.yml (alternate)
```

## Page sections (in order)
1. `#hero` — headline + CTA button → /demo
2. `.sec-backed` — backer logos (NVIDIA Inception, Open Neuromorphic, Founder's Inc, Anthropic)
3. `#thesis` — core neuromorphic computing thesis
4. `#markets` — target spaces (spacecraft, defense, autonomous vehicles)
5. `#episodes` — video/content episodes with aurora_episodes.mp4
6. `#community` — Discord, mailing list, LinkedIn, blog links

## Navigation
- Desktop: logo + nav-links + `.nav-cta` (See the demo →)
- Mobile: burger button → `.mob` overlay (toggled by `toggleMenu()` / `closeMob()`)
- Nav style transitions dark→light as user scrolls past the hero section

## Key behaviours
- **Scroll reveal**: `.reveal` elements animate in via IntersectionObserver; stagger delay computed per sibling group (`--reveal-delay` CSS var, max 360ms)
- **Machine mode**: toggled by `machine.js`; adds/removes class on `<body>` to switch to a data-dense, ML-readable layout
- **Cursor trail**: canvas-based pixel trail, defined in `cursor-trail.js` + `cursor-trail.css`
- **Hero shader**: WebGL shader in `hero-shader.js` overlaid on the video background

## Deployment
- Push to `main` → GitHub Actions runs `.github/workflows/deploy.yml` → deploys to GitHub Pages automatically
- No build step needed; all changes to HTML/CSS/JS files are immediately deployable

## Development rules
- No npm, no bundler — edit files directly
- Keep JS in vanilla ES5-compatible style (no arrow functions, no `const`/`let` in older files — match the existing code style per file)
- Do not add frameworks or external dependencies without explicit approval
- Test changes by opening the HTML file in a browser or using a simple static server (`python3 -m http.server`)
- The `/demo` route is served from `demo.html` locally and via Vercel rewrite in production

## Common tasks for agents
- **Add a new section**: add the HTML to `index.html`, styles to `style.css`, add `.reveal` class to elements you want animated in
- **Update copy/text**: edit directly in `index.html`
- **Add a backer logo**: add to the `.sec-backed` section in `index.html` and add the image to the repo root or `assets/images/`
- **Style changes**: edit `style.css`; machine-mode overrides go in `machine.css`
- **Fix mobile layout**: check `.mob`, nav burger, and media queries at the bottom of `style.css`
- **Update community links**: find `#community` section in `index.html`
