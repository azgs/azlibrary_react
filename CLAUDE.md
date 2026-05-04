# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `azlibrary_react/` (the inner directory containing `package.json`):

```bash
npm start        # Dev server on port 3001
npm run build    # Production build
npm test         # Run tests (watch mode)
npm test -- --watchAll=false  # Run tests once (CI mode)
npm test -- --testPathPattern=Search  # Run a single test file
```

No separate lint command — ESLint runs via `react-scripts` and extends `react-app` + `react-app/jest`.

## Environment Setup

Copy `env-template` to `.env` and fill in values:

```
REACT_APP_SITE=azlibrary          # or ADMM for the mining site variant
REACT_APP_AZLIB_API_URL=https://<api domain>/api/v1
REACT_APP_GA4_MEASUREMENT_ID=     # leave blank to disable analytics
```

## Architecture

This is a Create React App (JavaScript, no TypeScript) geospatial digital library for the Arizona Geological Survey. The app has two deployment variants controlled by `REACT_APP_SITE`: `azlibrary` (main AZGS collections) and `ADMM` (Arizona mining/mineral resources site).

### Routing & State

`App.js` owns the router and `FormContext` — a React Context that shares `apiSearchParams` / `setApiSearchParams` between `Home.js` and the search form components. There is no Redux or other external state library.

Routes: `/` (Home), `/item/:collectionId` (Item detail), `/contact/`, `*` (404).

### Component Pattern

`src/components/` is split into two layers:
- **`container/`** — smart components that fetch data or hold state (`Search.js`, `SearchMap.js`, `Paging.js`, `SelectCollectionGroup.js`, `SelectMineCollection.js`, `SelectFileType.js`, `AzgsApi.js`)
- **`presentation/`** — display-only components (`SearchResults.js`, `Files.js`, `Keywords.js`, `Metadata.js`, `Downloads.js`, `Breadcrumb.js`)

### API Client

`src/components/container/AzgsApi.js` exports a single Axios instance with `baseURL` set from `REACT_APP_AZLIB_API_URL`. All API calls go through this instance.

Key endpoints:
- `GET /metadata` — search with query params (title, author, year, keyword, file_type, collection_group, mine_collection, text, offset, geom, geom_method, etc.)
- `GET /metadata/{collectionId}` — collection detail
- `GET /dicts/collection_groups` / `/dicts/mine_collections` — filter dropdowns
- `GET /iso19139/{collectionId}` — ISO 19139 XML metadata export
- `GET /collections/{collectionId}` — download all files

Response shape: `{ data: [...], collectionCount, links: [...] }` for lists; `{ data: { collection_id, metadata: {...} } }` for single items.

### Map & Spatial Filtering

`SearchMap.js` uses Leaflet (`react-leaflet` v4) to render bounding boxes from search results and lets users filter by current map extent. The drawn polygon is serialized as WKT and passed to the API as the `geom` parameter. `MapZoomToggle.js` enables scroll-wheel zoom only after the map is clicked (to avoid accidental zoom when scrolling the page).

### Styling

Arizona Bootstrap (University of Arizona design system) is the primary CSS framework. The only custom stylesheet is `src/Style.css`. Material Icons are loaded from Google CDN in `public/index.html`.

## OpenSpec Workflow

This repo uses an experimental spec-driven change workflow. Specs live in `openspec/changes/`. Use `/opsx:new` to start a new change, `/opsx:propose` to generate a full proposal, and `/opsx:apply` to implement tasks.
