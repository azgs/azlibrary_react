## Context

`Home.js` (`useEffect` on mount, around lines 35-64) reads URL query parameters with react-router's `useSearchParams`, copies every key/value into `apiSearchParams`, then `buildAndSubmitQuery` (lines 66-94) iterates `apiSearchParams` and appends each key to the outbound `GET /metadata` request.

The AZGS API rejects unknown query keys with `400 Bad Request`. Until commit `6704816` (GTM → GA4 migration), the previous GTM container's gtag.js stripped the inbound `_gl` linker parameter from the URL before React's `useEffect` ran, masking the fact that `Home.js` had no allowlist. With `react-ga4` initialized without `allow_linker`, gtag no longer strips `_gl`, and the latent bug became user-visible.

Restoring linker config is being considered separately. This change addresses the underlying class of bug — *any* unrecognized URL param leaking to the API — independently.

## Goals / Non-Goals

**Goals:**
- Stop unrecognized URL query parameters from being forwarded to `GET /metadata`.
- Make dropped params visible (not silent) so configuration drift surfaces in browser devtools.
- Preserve all existing behavior for params that *are* legitimate search filters (URL → form prefill → API).

**Non-Goals:**
- GA cross-domain linker configuration. Tracked in a separate proposal.
- Refactoring the URL → form-state → API plumbing in `Home.js`.
- Removing the `console.log` debug statements already in `Home.js`.
- Adding remote telemetry (Sentry, GA events) for dropped params. Console-only is sufficient for now.
- Validating param *values*. The existing `filterInput` regex stays as-is; this change is about *keys*.

## Decisions

### Allowlist over denylist

Allowlist accepted URL params; drop everything else.

**Why over denylist:** A denylist (block `_gl`, `_gcl_au`, `utm_*`, `fbclid`, ...) is whack-a-mole. Any future tracking decoration breaks the API again. The set of accepted API search keys is small and stable, so an allowlist is simpler to keep correct.

**Trade-off:** When a legitimate new search param is added to the form, the allowlist must be updated. The `console.warn` (below) makes this immediately visible during development.

### Allowlist contents derived from `Search.js` form fields

The set of input `name` attributes in `Search.js` is the source of truth for what a user can set via the form, and therefore what should be honored from a shared URL:

```
title, collection_group, mine_collection, mine_resource_id,
text, year, author, keyword, series, file_type, latest, collection_id
```

Defined as a single `const ALLOWED_URL_PARAMS` near the top of `Home.js`. Not exported — kept local until a second consumer appears.

**Excluded from the URL allowlist (set by app state, not by URL):**
- `offset` — page offset is set by the `Paging` component as users navigate; the initial mount always starts at 0. A user-supplied `?offset=20` would be ignored by the form but is ultimately harmless if forwarded; for simplicity we exclude it from URL ingestion. Open question below.
- `geom`, `geom_method` — set by the map component, not URL.
- `collection_group` set by `REACT_APP_SITE` — `buildAndSubmitQuery` already overrides whatever value `apiSearchParams.collection_group` has, so URL-supplied values are effectively ignored anyway. The allowlist still includes `collection_group` so the form-controlled select (used in non-ADMM mode) keeps working when prefilled from URL.

### Filter at the copy site, not at the API call site

The filter goes inside the existing `rrSearchParams.forEach` block (Home.js:50-58), gating the assignment into `initialParams`. Filtering at this point means `apiSearchParams` itself never contains junk, so any future code path that reads `apiSearchParams` (paging, refetch, etc.) is also clean.

**Alternative considered:** Filtering inside `buildAndSubmitQuery`. Rejected — would leave `apiSearchParams` polluted in React state and require duplicating the filter at every consumer.

### `console.warn` for dropped keys

```js
console.warn(`Dropped unexpected URL param: ${key}=${value}`);
```

Placed in the `else` branch of the allowlist check.

**Why warn over log:** The existing file uses `console.log` for routine debug output. `console.warn` separates "this is unexpected" from "this is normal trace." Default browser devtools highlight warnings, which is the visibility the user asked for.

**Why not GA event / Sentry / other remote channel:** No remote observability infra is wired up in this app today. Adding it for this purpose would be larger than the fix itself. Console-only is fine; can be revisited if a real telemetry channel arrives.

## Risks / Trade-offs

- **Risk:** A legitimate URL-driven search key is omitted from the allowlist and silently (well, console-warned) dropped, breaking link-sharing for that filter. → **Mitigation:** Derive the list directly from `Search.js` form `name` attributes; verify by hand against `Search.js` during implementation; the `console.warn` makes any drop visible during testing and to anyone who notices it in devtools.
- **Risk:** Allowlist drifts out of sync as the form gains new fields. → **Mitigation:** When form fields are added, the dev will see the warning in console while testing. Long-term, a unit test that asserts allowlist ⊇ `Search.js` form `name`s would close the loop, but is out of scope here.
- **Trade-off:** The fix masks (in user-facing terms) the underlying GA linker config gap. The `console.warn` partially mitigates by keeping the signal visible to anyone debugging. The separate linker proposal will close the loop on the root cause.

## Migration Plan

Single deploy. No data migration. No feature flag — the change is small, easily reversible by reverting the commit, and the failure mode of the fix (over-dropping a legitimate param) is recoverable by adding to the allowlist.

## Open Questions

- Should `offset` be included in the allowlist so deep-links can land on a non-zero page? Today the form/UI doesn't generate such links; pagination is purely interactive. Default answer: **no**, exclude — keeps the surface minimal. Easy to add later if needed.
- Should the allowlist live in `Home.js` or be co-located with `Search.js` (which is closer to the source of truth for form fields)? Default answer: **leave in `Home.js`** for now since that's where it's consumed. Revisit if a second consumer appears.
