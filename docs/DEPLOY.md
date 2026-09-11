# Getting the site online, and keeping it there

The address is **https://karrie-huang.github.io**. It is free, it has no expiry,
and it updates itself every time a change is pushed to GitHub.

## How it works, in one paragraph

The site is *static*: it is turned into plain HTML files once, at build time, and
those files are served. There is no server running anywhere, nothing to pay for,
and nothing that can go down other than GitHub itself. `.github/workflows/deploy.yml`
tells GitHub to rebuild and republish on every push to the `main` branch. Nothing
else is involved.

## First-time setup

Four steps, in order. Two of them are on the GitHub website; two are commands.

### Step 1 — rename the GitHub account to `karrie-huang`

The free address is always `<your-username>.github.io`, so the username *is* the
address. The account is currently `kayaqua27`.

On **github.com**, signed in: click your picture, top right → **Settings** →
scroll to the bottom of the left sidebar → **Account** → **Change username**.
Enter `karrie-huang` and confirm.

**What this breaks:** links to your old repositories under `kayaqua27` stop
working. GitHub does redirect them for a while, but do not rely on it. If you
have shared a repository link with anyone, re-send it afterwards.

### Step 2 — create the repository

Still on github.com: **+** in the top right → **New repository**.

- **Repository name:** `karrie-huang.github.io` — exactly this, all lowercase. The
  name has to match the username or the free address will not work.
- **Public.** Private repositories cannot use free GitHub Pages.
- Leave every checkbox unticked. No README, no .gitignore, no licence — this
  folder already has them, and a tick here causes a conflict on the first push.

Click **Create repository**.

### Step 3 — push this folder to it

In **Terminal**, one block at a time. Each should finish without printing the
word `error`.

```bash
cd ~/Downloads/karrie-site
```

(Wherever the folder actually is on the machine you are using — this path is the
one it happens to have on Karrie's laptop, not a requirement.)

```bash
git remote add origin https://github.com/karrie-huang/karrie-huang.github.io.git
```

```bash
git push -u origin main
```

The last one asks for your GitHub username and password. **The password field
wants a Personal Access Token, not your account password** — GitHub stopped
accepting passwords here in 2021, and the error it gives if you type your real
password says "Support for password authentication was removed", which reads like
a bug and is not one. To get a token: github.com → your picture → **Settings** →
**Developer settings** (very bottom of the sidebar) → **Personal access tokens** →
**Tokens (classic)** → **Generate new token (classic)**. Tick **repo**, generate,
and copy the string it shows you *once*. Paste that as the password.

### Step 4 — turn Pages on

In the new repository on github.com: **Settings** → **Pages** (left sidebar) →
under **Build and deployment**, set **Source** to **GitHub Actions**.

That is the last manual step. Within a minute or two the site is live at
https://karrie-huang.github.io.

## A note on the email in your commits

Every commit records an author email, and on a public repository that email is
public. This repo is set to use `karrie-huang@users.noreply.github.com`, an
address GitHub provides for exactly this reason — it works for commits and
delivers nowhere.

It is set for this folder only. If you ever clone the repo somewhere else, run
this once inside the new copy:

```bash
git config user.email "karrie-huang@users.noreply.github.com"
```

**Working result:** it prints nothing. Check it took with `git config user.email`.

## Every change after that

```bash
git add -A && git commit -m "what changed" && git push
```

The site updates itself about a minute later.

## Checking whether a change is live

The **Actions** tab of the repository lists every build. A green tick means the
new version is published; a red cross means the build failed and **the previous
version is still live** — a failed deploy never takes the site down.

If the build fails, the same failure will happen locally, which is much easier to
read:

```bash
npm run build
```

## The base path

`astro.config.mjs` holds two settings that must agree with the repository name:

- Repository named `karrie-huang.github.io` → `site: 'https://karrie-huang.github.io'`,
  `base: '/'`. This is the current setup.
- Any other repository name, e.g. `site` → the address becomes
  `https://karrie-huang.github.io/site/`, and `base` must be `'/site'`.

Getting `base` wrong produces a site whose pages all 404 while the homepage looks
fine. See `AGENTS.md` → "The base-path trap" for the matching rule in the code.

## Custom domain, if you ever want one (~£10/yr)

Buy the domain, then: add a file `public/CNAME` containing only the domain
(`karriehuang.com`, no `https://`, no trailing slash), set `site` to
`https://karriehuang.com` and `base` to `'/'`, point the domain's DNS at GitHub
Pages, and enter the domain under **Settings → Pages → Custom domain**. The
github.io address keeps working and redirects.
