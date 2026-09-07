# kiki101robo.github.io

Personal portfolio site for Kirti Kishore. Plain HTML/CSS/JS, no build step, no dependencies except Google Fonts.

## What's inside
- `index.html` — page content (hero, about, experience, featured projects, contact)
- `style.css` — all styling, light/dark theme via CSS variables
- `script.js` — theme toggle + live GitHub repo pull

The **"All Repositories"** section fetches your public repos directly from the GitHub API in the visitor's browser
(`https://api.github.com/users/kiki101robo/repos`), so any new repo you push shows up automatically with no
edits needed here. It skips forks and skips repos already listed in "Featured Projects".

## Deploy on GitHub Pages

1. Create a new **public** repository named exactly `kiki101robo.github.io` (this exact name is what makes
   GitHub serve it as your user site).
2. Push these three files (`index.html`, `style.css`, `script.js`) to the root of that repo's default branch:
   ```bash
   git init
   git add index.html style.css script.js README.md
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/kiki101robo/kiki101robo.github.io.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Build and deployment → Source** → select `Deploy from a branch`,
   branch `main`, folder `/ (root)`. Save.
4. Wait a minute or two — your site goes live at `https://kiki101robo.github.io`.

## Adding project demo videos

Every featured project card has an empty video slot that shows a "Video coming soon" placeholder until you
fill it in. In `index.html`, find the `<div class="project-video" data-video="">` for that project and set
`data-video` to one of:

- **YouTube**: any YouTube URL (`https://youtu.be/...`, `https://www.youtube.com/watch?v=...`, etc.) or just
  the bare 11-character video ID.
- **A local video file**: e.g. `data-video="videos/protocall-demo.mp4"` after adding that file to the repo
  (keep clips short/compressed — GitHub caps individual files at 100MB and Pages isn't meant for heavy media).
  Optionally add `data-poster="videos/protocall-poster.jpg"` for a thumbnail shown before playback.
- **Anything else embeddable** (e.g. a Vimeo URL) — it's dropped into a generic iframe.

No other edits needed — `script.js` picks up whichever kind of link you used and renders the right embed.

## Customizing

- **Add/remove a featured project**: duplicate a `<article class="project-card">` block in `index.html`
  (inside `<section id="projects">`), and add or remove its name from the `FEATURED_REPOS` set at the top of
  `script.js` so it isn't duplicated in the auto-pulled list below.
- **Resume link**: add a button in the hero or contact section, e.g.
  `<a href="resume.pdf" class="btn btn-ghost">Resume</a>`, after dropping a `resume.pdf` file into the repo.
- **Colors**: edit the `--accent` / `--accent-2` variables at the top of `style.css` (dark theme) and under
  `html[data-theme="light"]` (light theme).
- **Custom domain**: add a `CNAME` file containing your domain, then configure DNS per GitHub's docs.

## Notes
- No phone number is included on the public page by default — only email, GitHub, and LinkedIn.
- The ProtoCall project card has no repo link since it's unpublished research; swap in the paper link once
  UIST 2026 publishes it.
