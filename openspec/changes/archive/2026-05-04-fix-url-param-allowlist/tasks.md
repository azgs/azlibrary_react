## 1. Implementation

- [x] 1.1 In `azlibrary_react/src/pages/Home.js`, define a `const ALLOWED_URL_PARAMS` (a `Set` of strings) near the top of the file containing the keys: `title`, `collection_group`, `mine_collection`, `mine_resource_id`, `text`, `year`, `author`, `keyword`, `series`, `file_type`, `latest`, `collection_id`. Verify against `Search.js` form field `name` attributes before committing.
- [x] 1.2 Inside the `useEffect` on mount (around lines 50-58), modify the `rrSearchParams.forEach` callback so it only assigns to `initialParams[key]` when `ALLOWED_URL_PARAMS.has(key)`. For keys not in the allowlist, call `console.warn(\`Dropped unexpected URL param: ${key}=${value}\`)`.

## 2. Manual verification

- [x] 2.1 Start dev server (`npm start` from `azlibrary_react/`). Load `http://localhost:3001/?title=Grand+Canyon` and confirm: form prefills with "Grand Canyon", network panel shows `GET /metadata?...&title=Grand%20Canyon`, no `console.warn` fires.
- [x] 2.2 Load `http://localhost:3001/?_gl=1*139hltq*test&utm_source=email&title=mine`. Confirm: form prefills with `title=mine` only; network panel shows `title=mine` but no `_gl` or `utm_source`; `console.warn` fires once each for `_gl` and `utm_source`.
- [x] 2.3 Load the original failing URL pattern (`?_gl=...&_gcl_au=...&_ga=...&_ga_7PV3540XS3=...`) and confirm the API call returns `200`, not `400`.
- [x] 2.4 Verify regression-free: load with no params, exercise the search form, paginate, and use the map filter. Behavior should be identical to before the change.
