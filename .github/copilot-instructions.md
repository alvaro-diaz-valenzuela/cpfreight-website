# Copilot instructions for cpfreight-website

Summary
- Small static marketing site built with plain HTML, CSS and minimal inline JS. Pages live in the repository root (index.html, about.html, services.html, sustainability.html, career.html, contact.html).

Build / test / lint
- No build, test or lint toolchain detected.
- Run locally: open index.html in a browser or serve with a simple HTTP server:
  - python3 -m http.server 8000
  - or: npx http-server . -p 8000
- No test runner is present; single-test guidance: N/A.

High-level architecture
- Root-level static pages: each page is a self-contained HTML file that imports shared CSS/JS.
- CSS:
  - style.css — global site stylesheet, defines CSS variables (e.g. --primary-blue) and header/hero/footer layout.
  - inner.css — styles for inner/content pages (about, contact, career, sustainability).
- JS:
  - Minimal inline scripts (index.html) initialize Swiper slider, sticky header, counters, and sidebar open/close logic.
  - Third-party UI libs are loaded via CDN: Bootstrap 5 (CSS + bundle JS), Swiper, Bootstrap Icons, Google Fonts.
- Assets:
  - Most images are referenced by absolute URLs to the production CDN (cpfreightforwarders.com). There is no local asset pipeline.

Key conventions and patterns
- Page filenames map directly to routes (index.html → /, about.html → /about.html). Keep names and links consistent.
- inner pages include both style.css and inner.css; index.html includes only style.css.
- Global variables: use :root CSS variables in style.css for colors/spacing — prefer these for new components.
- JS placement: existing custom JS lives inline near the end of index.html. When adding more JS, prefer adding a new file (e.g. assets/js/site.js) and include it before </body> following the same pattern.
- Use CDN versions for libraries to keep the repo small; if adding a build step later, document the change in this file.
- Avoid committing large media — images are hosted externally; follow the existing external-URL pattern unless adding a dedicated assets folder.

Files to check before changes
- index.html (homepage + core inline scripts)
- style.css (global variables & component layout)
- inner.css (inner pages overrides)

If you update the site
- Keep markup compatible with Bootstrap 5 (current CDN). Update CDN links and initialization code together (e.g., Swiper options) when upgrading libraries.

MCP servers
- This is a static web site. Would you like an MCP server configured for browser testing (Playwright)?

---
Created by Copilot CLI helper.
