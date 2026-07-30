# Website Josh

Static site and lead-magnet funnel for Josh Roche. Everything in this repo deploys publicly. Internal material (strategy brief, magnet sources, products) lives one level up in the workspace, outside the repo.

## Local Preview

```bash
npm run dev
```

Then open `http://127.0.0.1:3000`.

## Routes

Public site + funnel (linked from Instagram, posts, and each other):

- `/website` — Josh Roche main website
- `/capacity-audit` — The Capacity Audit (four-domain constraint assessment, entry point 1)
- `/off-switch` — The Off Switch free guide + email capture (entry point 2)
- `/coaching` — The core 1:1 coaching offer page
- `/downloads/the-off-switch.pdf` — the free guide, delivered on opt-in
- `/` — redirects to `/website` (vercel.json)

## Funnel logic

Both lead magnets capture to the **same Kit form** and bridge into the offer stack.
The audit finds the visitor's weakest domain (their constraint) and, when it is
Mental, points straight at The Off Switch. Everything ladders toward `/coaching`.

Shared machinery lives in `assets/`:

- `funnel.css` — all funnel/modal/result/landing/offer components (extends `styles.css`)
- `audit.js` — the assessment engine, scoring, and result rendering
- `capture.js` — the Off Switch email capture
- `kit.js` — the shared Kit subscribe helper

The guide PDF is authored in `../lead-magnets/off-switch/` (print HTML + master PDF live there, render command in that folder's README). `downloads/the-off-switch.pdf` is the deployed copy — replace it from the master after every re-render.

## Before launch — two placeholders to fill

1. **Kit form** — put Josh's real form ID + public API key in `assets/kit.js`
   (`window.KIT.FORM_ID` / `window.KIT.API_KEY`). Both magnets use the same form.
2. **Calendly** — drop Josh's booking embed into the `.calendly-slot` block in
   `coaching.html` (marked with a comment). A `mailto:` fallback is live until then.

## Vercel

Static site. Import this repository into Vercel, leave the build command empty, and deploy from the repository root. `cleanUrls` is on and `/` redirects to `/website`.
