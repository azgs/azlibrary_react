# Migrate to Arizona Bootstrap 5

**Status:** stub / deferred — placeholder to track future work.

## Context

`arizona-bootstrap` is referenced in `package.json` as an unpinned GitHub dep
(`github:az-digital/arizona-bootstrap`). The upstream project moved from a
Bootstrap 4 base (last working: `2.0.18`, commit `350041a0…`) to a Bootstrap 5
base (`5.1.3`, commit `b50d6369…`).

A fresh `npm install` against the unpinned reference pulled the BS5 version and
broke the UI in several visible ways:

- Buttons render rounded instead of square (BS5 default `border-radius`).
- Close button on the info window is the wrong glyph and misplaced
  (`<span aria-hidden="true">&times;</span>` is BS4; BS5 expects
  `<button class="btn-close">`).
- Home / nav icons render incorrectly (icon-set swap between major versions).
- Collapse-style buttons no longer work — most visibly the
  "Expand Form For More Filter Options" button in `Search.js` does nothing
  (BS5 plugin listens for `data-bs-toggle`, not `data-toggle`).

As an immediate fix we pinned `arizona-bootstrap` to commit
`350041a01c42883155fa0299253155df75083c2b` (the last BS4-era release). That
restores function but locks us out of forward UA design-system updates.

## Goal

Migrate the application markup from Bootstrap 4 to Bootstrap 5 so we can
unpin and track current Arizona Bootstrap.

## Scope (sketch — refine when picking this up)

- Sweep BS4 → BS5 data-attribute renames across all JSX:
  - `data-toggle` → `data-bs-toggle`
  - `data-target` → `data-bs-target`
  - `data-dismiss` → `data-bs-dismiss`
- Replace BS4 close-button markup with `<button class="btn-close">` in
  `Layout.js` (info bubbles, modals, alerts).
- Audit utility-class renames (e.g. `ml-*` / `mr-*` → `ms-*` / `me-*`,
  `.form-row` removed, `.custom-control` → `.form-check`,
  `.btn-block` → `.d-grid` wrapper, etc.).
- Audit form/card/badge/jumbotron/media-object usages that BS5 changed or
  removed.
- Re-verify map controls, search form expand/collapse, mobile nav toggler,
  and any modals.
- Re-pin to a specific BS5-era arizona-bootstrap SHA after the migration
  lands. Do **not** leave the dep unpinned.

## Non-goals

- No functional changes to search, mapping, or API behavior.
- No design refresh beyond what BS5 + UA theme produces by default.

## Notes

- Reference: https://getbootstrap.com/docs/5.0/migration/
- Confirm whether `arizona-bootstrap` 5.x ships its own JS bundle or expects
  Bootstrap's. The current import (`import 'arizona-bootstrap'`) may need
  to change.
- Watch for `popper.js` (BS4) vs `@popperjs/core` (BS5) for any tooltip /
  popover usage we add later.
