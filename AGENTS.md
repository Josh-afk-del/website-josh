# Website repo — quick facts

The master instructions live one level up in `../AGENTS.md`. Read that first. This file only holds repo specifics.

- Static site, no build step. `npm run dev` serves at `http://127.0.0.1:3000`.
- `cleanUrls` is on (vercel.json): `/coaching` serves `coaching.html`. Link without `.html`.
- Routes and funnel logic are documented in `README.md`.
- Publishing = commit + push to `main`. Vercel deploys automatically.
- PDF guides are authored and rendered in `../lead-magnets/<name>/`; only the finished PDF gets copied into `downloads/` for deploy.
- `/` redirects to `/website` (vercel.json).
- Everything in this folder is public once deployed. Private material belongs one level up (`../strategy-brief/`, `../products/`, `../lead-magnets/`).
