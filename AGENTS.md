# Working in this repo — for any AI assistant, or any person

Every AI coding tool reads this file (`AGENTS.md`); `CLAUDE.md` beside it is a
one-line pointer here. If your tool reads a different filename, read this one.

The website for **https://karrie-huang.github.io**. Astro, static, no database,
no server, no JavaScript framework. Builds to plain HTML, served free by GitHub
Pages.

## Read this first

**This repository is deliberately incomplete.** It holds the site and nothing
else. Every specification, design decision, verification procedure and piece of
source material lives in a **separate private repository**,
`karrie-huang/karrie-site-notes` — including `docs/STATE.md`, which is the
handoff file and outranks any chat transcript.

**If you do not have that repository, ask the owner for it before making
non-trivial changes.** Do not reconstruct the reasoning by guessing; a great deal
of what looks arbitrary here was decided deliberately and measured.

```bash
git clone https://github.com/karrie-huang/karrie-site-notes.git
```

## Why the split exists

This repo is public — free GitHub Pages requires it. Anything committed here is
published, not just the pages: every file, and every commit message, readable
by anyone who guesses the URL, which a `.github.io` address makes trivial.

**So: never record here what the site deliberately does not say, and never
describe the owner.** Reasoning, drafts, working notes and anything about the
person go in the notes repo. When you push a change here, push the reasoning
there.

**Commit messages here are public too.** A message describes the change —
"Update about.yaml", "Retune display size for the longer headline" — and
nothing else: not what was removed, not why something is absent, not who the
owner is or how she works, no co-author trailers, no notes to a future reader.
The history was reduced to a single commit on purpose; keep it boring.

## The rules that protect this site

Enough to work safely without the notes repo. Everything else is over there.

- **All prose a reader sees lives in `src/content/*.yaml`.** It is edited
  through Pages CMS (`.pages.yml` defines the forms) or by hand on GitHub, never
  through code. The shape of each file is enforced by
  `src/content.config.ts`, which turns a wrong shape into a sentence rather than
  a stack trace and converts straight quotes to typographic ones. **Adding a
  field means three places:** the YAML, the schema, and `.pages.yml`. Never put
  a reader-facing string in a component.
- **The build must fail readably.** When you add validation, check the message
  by breaking a file on purpose and reading what comes out. A clean build after
  a bad edit is a bug.
- **Never write a raw `font-size`, `margin` or `padding` in a component.** Use
  `var(--text-*)` / `var(--space-*)` from `src/styles/global.css`. There are zero
  literal values outside that file, enforced by `npm run check:tokens`, and that
  property is what keeps the design editable from one file.
- **Prefix every internal link with `import.meta.env.BASE_URL`.** Today `base` is
  `/`, so a bare `/work` also works — which is exactly why an un-prefixed link
  breaks silently if the site ever moves to a subpath.
- **Don't publish an email address**, on the page or in commit metadata. Commits
  here are authored as `karrie-huang@users.noreply.github.com`; set the same on
  any new machine.
- **Don't add a JavaScript framework.** Two `<script is:inline>` blocks are the
  whole client-side budget: the pre-paint theme setter and the theme toggle.

## Verification bar

- Any change: `npm run check` and `npm run build` must pass.
- Anything a reader would see: load the page, both themes, at a phone width.
- Anything touching links: follow them.

The owner's guides — `README.md`, `RECOVERY.md`, `docs/EDITING.md` — live in
the notes repo, not here. If you change how editing works, change them there
in the same piece of work.
