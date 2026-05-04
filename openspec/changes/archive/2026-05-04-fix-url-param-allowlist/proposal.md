## Why

`Home.js` blindly forwards every URL query parameter to the AZGS API, which rejects unknown keys with `400 Bad Request`. This breaks search for any visitor whose link carries tracking decorations (`_gl`, `_gcl_au`, `utm_*`, `fbclid`, etc.) — currently observable on `mininginfo.azgs.arizona.edu` because inbound `_gl` from cross-domain GA linker is no longer being stripped after the GTM → GA4 migration. The 400 is user-facing breakage, not just developer noise.

## What Changes

- Filter URL query parameters through an allowlist before copying them into `apiSearchParams`. Only keys the API understands as search filters reach the API.
- Log dropped keys via `console.warn` so unexpected params (config drift, new tracking params, missing GA linker config) surface in browser devtools instead of disappearing silently.
- No change to existing form behavior: every param a user can set via the search form continues to flow through.
- **Out of scope:** restoring GA cross-domain linker (`allow_linker`, `linker.domains`). Tracked separately; blocked on the AZGS-family GA Measurement ID inventory.

## Capabilities

### New Capabilities
- `url-param-handling`: defines which URL query parameters are accepted as search filters when `Home` mounts, and what happens to ones that are not.

### Modified Capabilities
<!-- None: there are no existing specs in openspec/specs/. -->

## Impact

- Code: `azlibrary_react/src/pages/Home.js` (the `useEffect` at lines ~35-64 and the `buildAndSubmitQuery` flow it feeds).
- Behavior: shared/bookmarked links carrying tracking params no longer error. Links carrying genuine search params behave identically to today.
- API: stops sending unknown query keys to `GET /metadata`. No API contract change.
- Dependencies: none added.
- Observability: new `console.warn` lines in browser devtools when dropped params are encountered.
