// @ts-check
import { defineConfig } from 'astro/config';

// ---------------------------------------------------------------------------
// DEPLOYMENT SETTINGS  (edit these two lines when you create your repo)
//
// For a FREE user site — repo named  <your-username>.github.io  — use:
//     site: 'https://<your-username>.github.io'
//     base: '/'                     // served at the root, nothing else to do
//
// For a PROJECT site — any other repo name, e.g.  "site" — use:
//     site: 'https://<your-username>.github.io'
//     base: '/<repo-name>'          // served under a subpath
// ---------------------------------------------------------------------------

export default defineConfig({
  site: 'https://karrie-huang.github.io',
  base: '/',                        // <-- keep "/" for a <username>.github.io repo
});
