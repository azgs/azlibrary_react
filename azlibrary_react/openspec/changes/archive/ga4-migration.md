# Migrate from Google Tag Manager to Google Analytics 4

## Status: Complete (2026-02-05)

## Problem

The application currently uses Google Tag Manager (GTM) via `react-gtm-module` for analytics. We want to migrate to Google Analytics 4 (GA4) directly to:

1. Simplify the analytics stack by removing the GTM middleman
2. Enable React Router integration for automatic page view tracking
3. Track site variant (AZGS Library vs ADMM) as a user property for segmented analysis

## Current State

- GTM is initialized in `src/index.js` using `react-gtm-module`
- GTM container ID is configured via `REACT_APP_GTMID` environment variable
- No custom events or page view tracking beyond GTM's default behavior
- No differentiation between AZGS Library and ADMM site variants in analytics

## Proposed Solution

### 1. Replace GTM package with GA4 package

- Remove: `react-gtm-module`
- Add: `react-ga4`

### 2. Initialize GA4 with site variant user property

In `src/index.js`:
- Initialize GA4 with measurement ID from environment variable
- Set user property for site variant (`azlibrary` or `ADMM`)

### 3. Add React Router page view tracking

In `src/App.js`:
- Add a small `PageTracker` component that uses `useLocation()` to detect route changes
- Send page view events to GA4 on each navigation
- Note: A separate component is required (rather than a pure inline effect in `App`) because `useLocation()` must be called inside the `<BrowserRouter>` context. The `PageTracker` component is defined in the same file to keep things simple and avoid adding new files.

## Files to Change

| File | Change |
|------|--------|
| `package.json` | Remove `react-gtm-module`, add `react-ga4` |
| `src/index.js` | Replace GTM init with GA4 init + user properties |
| `src/App.js` | Add page view tracking on route changes |
| `env-template` | Replace `REACT_APP_GTMID` with `REACT_APP_GA4_MEASUREMENT_ID` |
| `openspec/config.yaml` | Update tech stack documentation |

## Tasks

- [x] Install `react-ga4` and remove `react-gtm-module` (5 min)
- [x] Update `src/index.js` with GA4 initialization and site variant user property (15 min)
- [x] Add page view tracking in `src/App.js` (20 min)
- [x] Update `env-template` with new environment variable (5 min)
- [x] Update `openspec/config.yaml` documentation (5 min)
- [x] Test page view tracking across all routes (15 min)
- [x] Test both site variants (AZGS Library and ADMM) (15 min)

## Estimated Effort

**Total: ~1.5 hours**

## Testing

1. Verify GA4 receives page view events when navigating between routes:
   - Home → Item detail → Home
   - Home → Contact → Home
   - Direct URL access to `/item/:collectionId`

2. Verify user property is set correctly:
   - `site_variant: "azlibrary"` for default site
   - `site_variant: "ADMM"` for ADMM site

3. Verify no analytics errors in console when `REACT_APP_GA4_MEASUREMENT_ID` is not set

## Future Enhancements (Out of Scope)

- Track search events (queries, filters)
- Track file download clicks
- Track map interactions (zoom, pan, extent filter)
