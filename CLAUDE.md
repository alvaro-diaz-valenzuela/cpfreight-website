# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static marketing website for C P Freight Forwarders LLP — a freight forwarding and logistics company. No build step, no package manager, no framework.

## Running Locally

```bash
python3 -m http.server 8000
# or
npx http-server . -p 8000
```

Open `http://localhost:8000` in a browser. Must serve over HTTP (not `file://`) because `i18n.js` uses `fetch()` to load translation files.

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via `.github/workflows/deploy-pages.yml`. The entire repo root is published as-is.

## Architecture

### Pages

All pages are in the repo root. Each is a self-contained HTML file:

- `index.html` — homepage; contains all inline JS (Swiper slider, sticky header, counter animation, sidebar open/close, ticker)
- `about.html`, `services.html`, `sustainability.html`, `career.html`, `contact.html` — inner pages

Inner pages include both `style.css` and `inner.css`. The homepage includes only `style.css`.

### CSS

- `style.css` — global stylesheet; defines CSS custom properties (colors, fonts, spacing) at `:root`
- `inner.css` — overrides and section styles for inner pages

Key CSS variables defined in `style.css`:
- `--primary-blue: #004b84`, `--primary-blue-dark: #003563`
- `--font-manrope`, `--font-dmsans`
- `--section-py: 80px`

Always use these variables for new components; don't hardcode colors or fonts.

### JavaScript

No bundler or module system. All JS is either inline (in `index.html`) or loaded as a plain script (`assets/js/i18n.js`). Third-party libraries are loaded from CDN:
- Bootstrap 5.3 (CSS + bundle JS)
- Swiper 11
- Bootstrap Icons 1.11
- Google Fonts (Manrope, DM Sans)

New custom JS should go in `assets/js/` and be included via `<script src="...">` before `</body>`.

### i18n System (`assets/js/i18n.js`)

Two supported languages: English (`en`) and Spanish (`es`). Translation files live in `assets/i18n/en.json` and `assets/i18n/es.json`.

**How it works:**

1. On load, `i18n.js` fetches `en.json` and builds a reverse map (English text → key).
2. It then loads the current language file (from `localStorage` or browser language detection).
3. `apply()` runs two passes:
   - **Explicit**: translates elements with `data-i18n="key"` attributes.
   - **Auto-match**: translates elements whose exact text content matches an English value in the reverse map, then stamps `data-i18n` on them.

**When to use `data-i18n`:** Prefer explicit `data-i18n` attributes for new content. Auto-match works only when the element's `textContent` exactly equals an English value in `en.json`.

**When element has child elements** (e.g. `<a>Home <span>×</span>`): `apply()` replaces only the first non-empty text node, preserving child elements. Keep this in mind when nesting markup inside translatable elements.

**Adding new translatable strings:**
1. Add the key/value to `assets/i18n/en.json`.
2. Add the corresponding translation to `assets/i18n/es.json`.
3. Add `data-i18n="your.key"` to the HTML element (or rely on auto-match if the text is unique).

**Special attribute translation:** Use `data-i18n-attr="placeholder"` (or any attribute name) alongside `data-i18n` to translate an attribute instead of text content.

### Images

All images are loaded from the external CDN (`https://cpfreightforwarders.com/assets/img/...`). The only local image is `assets/cpf-logo.jpeg`. Do not commit large media files; follow the external-URL pattern.

## Git Commits

Never add a `Co-Authored-By` trailer to commit messages in this repo.

## Key Conventions

- The `active` class on `<li class="nav-item">` and the `active-dot` span mark the current page in the nav — update these when editing pages.
- When adding a new nav link or page, update the header block in **all six HTML files** to keep navigation consistent.
- Keep CDN versions consistent across all pages. When upgrading a library, update every `<link>` and `<script>` tag that references it and verify initialization options (e.g., Swiper API changes between major versions).
- The `data-i18n` auto-match mechanism is fragile if English text is not unique across the page — prefer explicit `data-i18n` for new content.
