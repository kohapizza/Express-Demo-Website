# Express — ACL 2026 System Demo Website

Static demo website for the paper
**"Express: Taming the Branching Problem in Formal Natural Language Inference"**
submitted to ACL 2026 System Demonstrations.

---

## File structure

```
demo/
├── index.html          ← Single-page demo site (all sections)
├── style.css           ← Styles — CSS variables at the top for easy re-theming
├── script.js           ← Lightbox, video fallback, mobile nav, active-nav highlight
├── README.md           ← This file
└── assets/
    ├── figure_branching.png    ← Figure 1 from the paper (branching structure)
    ├── baseline_scroll.png     ← Screenshot: conventional exhaustive output
    ├── feature_substring.png   ← Screenshot: substring analysis UI
    ├── feature_branch.png      ← Screenshot: interactive branch selection UI
    ├── feature_export.png      ← Screenshot: proof search query export screen
    ├── eval_table1.png         ← Table 1: search space comparison
    ├── eval_table2.png         ← Table 2: user study results
    ├── eval_table3.png         ← Table 3: Likert scale results
    ├── demo90s.mp4             ← Short demo video (90 sec) — NOT INCLUDED, add manually
    └── demo3min.mp4            ← Full walkthrough video (3 min) — NOT INCLUDED, add manually
```

> **Placeholder images** currently exist in `assets/` as solid-color PNGs.
> **Videos** are not included — see the replacement instructions below.

---

## Local preview

No build step required. Open directly in a browser:

```bash
# Option A — Python built-in server (recommended, avoids CORS issues)
cd /path/to/demo
python3 -m http.server 8080
# → open http://localhost:8080

# Option B — Open file directly (some browsers restrict local video/font loading)
open index.html   # macOS
```

---

## GitHub Pages deployment

1. Push this `demo/` directory to your GitHub repository.
2. Go to **Settings → Pages**.
3. Set **Source** to the branch and folder containing `demo/` (or move files to `docs/` if preferred).
4. GitHub Pages will serve `index.html` at `https://<user>.github.io/<repo>/`.

If you keep the folder as `demo/`:
- **Branch**: `main` (or whichever branch has the files)
- **Folder**: `/demo`

Or copy all files under `demo/` directly into the repository root and set Pages to `/` (root).

---

## How to replace images

Each image is a placeholder (solid color PNG). Replace with real screenshots from Express.

| File | What to put here |
|---|---|
| `assets/figure_branching.png` | Figure 1 from the paper — the branching structure diagram |
| `assets/baseline_scroll.png` | Screenshot of the conventional exhaustive HTML output (long vertical dump) |
| `assets/feature_substring.png` | Screenshot: substring analysis UI — e.g., "Taro ran" → 32 candidates |
| `assets/feature_branch.png` | Screenshot: interactive branch selection — collapsible cards with one highlighted |
| `assets/feature_export.png` | Screenshot: proof search query export screen with Save button |
| `assets/eval_table1.png` | Table 1 from the paper (search space comparison) — cropped/screenshot |
| `assets/eval_table2.png` | Table 2 from the paper (user study results) |
| `assets/eval_table3.png` | Table 3 from the paper (Likert results) |

**Tips:**
- Use PNG or WebP at ~1200–1600px wide for sharpness on retina displays.
- Keep the same filenames — no HTML edits needed.
- If you want to use different filenames, update the `src` attributes in `index.html` (each `<img>` has a `src="assets/XXX.png"` attribute).

---

## How to add demo videos

Add video files to `assets/`:

```
assets/demo90s.mp4     ← 90-second short demo
assets/demo3min.mp4    ← 3-minute full walkthrough
```

The site detects missing videos automatically and shows a styled placeholder.
Once the files are present (with these exact names), the video players appear without any code changes.

**Encoding recommendation:**
```bash
# Re-encode for web (H.264, web-optimized, 1080p)
ffmpeg -i input.mov \
  -c:v libx264 -crf 22 -preset slow \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  -vf "scale=1920:-2" \
  assets/demo90s.mp4
```

---

## How to update the paper PDF link

The "Paper PDF" button in the hero section links to `ACL_Saeki.pdf`.
Place the PDF in the `demo/` directory (same folder as `index.html`) and rename it `ACL_Saeki.pdf`.
Or update the `href` attribute on the button in `index.html`:

```html
<!-- Find this line in index.html and update the href -->
<a href="ACL_Saeki.pdf" class="btn btn-ghost" ...>Paper PDF</a>
```

---

## How to update author/contact information

After the paper is de-anonymized:

1. **Footer contact email** — search for `placeholder@example.com` in `index.html` and replace.
2. **BibTeX** — find the `<pre class="bibtex">` block in the footer and update author, title, venue.
3. **GitHub link** — currently points to `https://github.com/DaisukeBekki/lightblue`; update if needed.
4. **Demo URL** — update the `og:url` meta tag once the site is live.

---

## Design customization

CSS variables are defined at the top of `style.css`:

```css
:root {
  --accent:       #2563EB;   /* Main blue — change to re-theme the entire site */
  --accent-light: #EFF6FF;
  --accent-dark:  #1E40AF;
  --max-w:        1100px;    /* Max content width */
  ...
}
```

Changing `--accent` alone is enough to shift the color scheme site-wide.
