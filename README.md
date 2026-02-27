# Project Phasor Website

Official website for **Project Phasor** — an open-source collaborative initiative building shared neuromorphic computing infrastructure (compilers, virtual machines, and governance standards).

🌐 **Live site:** [project-phasor.org](https://www.project-phasor.org)

---

## Tech Stack

- Pure HTML, CSS, JavaScript — no frameworks, no build step
- Google Fonts (Libre Baskerville + DM Mono + Outfit)
- GitHub Actions for automatic deployment to GitHub Pages

---

## Local Development

Just open `index.html` in your browser — no server needed.

```bash
# Or use a simple local server (recommended to avoid CORS):
npx serve .
# or
python3 -m http.server 3000
```

---

## Deploying to GitHub Pages

### 1. Create a new GitHub repository

Go to [github.com/new](https://github.com/new) and create a new **public** repository.
Name it whatever you like (e.g. `project-phasor-site`).

### 2. Push this code

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The site will auto-deploy on every push to `main`

Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

---

## Connecting Your Squarespace Domain

Once the site is live on GitHub Pages:

1. Go to your **Squarespace Domains** panel
2. Click on your domain → **DNS Settings**
3. Add these records:

| Type  | Host | Value                          |
|-------|------|-------------------------------|
| A     | @    | `185.199.108.153`              |
| A     | @    | `185.199.109.153`              |
| A     | @    | `185.199.110.153`              |
| A     | @    | `185.199.111.153`              |
| CNAME | www  | `YOUR_USERNAME.github.io`      |

4. In GitHub repo **Settings → Pages → Custom Domain**, enter your domain
5. Check **Enforce HTTPS** (GitHub provides a free SSL certificate)

DNS propagation can take up to 48 hours but usually completes within 30 minutes.

---

## Updating the Site

Edit `index.html`, `assets/css/style.css`, or `assets/js/main.js` locally, then:

```bash
git add .
git commit -m "Update site content"
git push
```

The GitHub Action will automatically redeploy within ~60 seconds.

---

## Adding Your Logo

Replace the SVG logo-mark in the `<nav>` section of `index.html` with your own:

```html
<!-- Find this in index.html and swap the SVG or add an img tag: -->
<div class="logo-mark">
  <img src="assets/images/logo.svg" alt="Project Phasor" width="18" height="18" />
</div>
```

Place your logo file in `assets/images/`.

---

## File Structure

```
project-phasor/
├── index.html              # Main site (single page)
├── assets/
│   ├── css/
│   │   └── style.css       # All styles
│   ├── js/
│   │   └── main.js         # Interactions & animations
│   └── images/             # Add your logo/assets here
├── .github/
│   └── workflows/
│       └── deploy.yml      # Auto-deploy to GitHub Pages
└── README.md
```

---

## Community

- 🌐 [project-phasor.org](https://www.project-phasor.org)
- 💬 [Discord](https://discord.com/invite/jh9VQaNUdW)
- 📬 [Mailing List](https://groups.google.com/g/project-phasor-interest)
- 🔗 [LinkedIn](https://www.linkedin.com/company/project-phasor)
