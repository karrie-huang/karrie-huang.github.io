# karrie-huang.github.io

[![Build](https://github.com/karrie-huang/karrie-huang.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/karrie-huang/karrie-huang.github.io/actions/workflows/deploy.yml)

Live at **https://karrie-huang.github.io**

Astro 5, static, no framework, no server. Fonts: Spectral and Archivo, self-hosted.
Deployed by GitHub Actions to GitHub Pages on every push to `main`.

**All reader-facing prose lives in `src/content/*.yaml`**, validated at build
time by `src/content.config.ts` (Zod, with plain-English messages) and edited
through Pages CMS via `.pages.yml`. Adding a field means touching all three.
Straight quotes are converted to typographic ones at build.

```bash
npm install
npm run dev          # http://localhost:4321
npm run check        # astro check
npm run check:tokens # no literal font-size/margin/padding outside global.css
npm run build
```

```
src/
  content/
    site.yaml            # name, headline, standfirst, LinkedIn
    about.yaml           # bio, experience, elsewhere, education
    work.yaml            # the lots; first is the lead
    case-studies/*.yaml  # one file = one page at /work/<name>
  content.config.ts      # the schema — what shape each file must be
  lib/lots.ts            # how a lot's action and italic line are derived
  pages/                 # index, work/index, work/[slug], about
  components/            # Header, Footer, Lot, CaseStudy
  layouts/Base.astro     # <head>, header, footer, theme script
  styles/global.css      # the design: colours, type, spacing tokens
.pages.yml               # Pages CMS — the editing forms
public/og.png            # share card (source: scripts/og-card.html; permanent)
.github/workflows/deploy.yml
```

Rules for working in this repository: [`AGENTS.md`](AGENTS.md).
