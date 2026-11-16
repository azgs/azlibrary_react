## Why

The site's primary search field is wired to `title`, and the help text under it
tells users that "the most effective search method is to type a **partial**
title". That is not what the parameter does: `title` matches whole words
against the title only, so a partial *word* finds nothing, and a term that
appears in a collection's abstract, keywords or author list finds nothing
either however it is typed.

The API now offers `q`, a single relevance-ranked search across title,
keywords, authors, series and abstract, weighted so a title match outranks a
keyword match outranks an abstract match. On dev, 98.4% of collections hold at
least one indexed term that no previous per-field search could reach, almost
all of it in abstracts. None of that is reachable from the site today.

Separately, `filterInput` in `Home.js` strips every character outside
`a-zA-Z0-9 ’½.-;"=–,:` before a term reaches the API. That silently removes
apostrophes and accented letters, so "O'Brien" is searched as "OBrien" and
"Cañon del Oro" as "Caon del Oro" — both guaranteed to miss.

## What Changes

- The primary search field becomes `q`, labelled **Search**, with help text
  that describes what it actually searches.
- **BREAKING (layout)** `title` moves from the primary position into the
  expanded filter panel, next to the other single-field filters. It keeps
  working and keeps its name, so existing links with `?title=` are unaffected.
- **Modified capability** `q` is added to the URL parameter allowlist, so
  `?q=...` prefills the form and reaches the API like any other filter.
- **BREAKING (form)** The **Full-Text Search** field is removed from the form
  entirely. Searching the extracted text of documents stays available on the
  API, as an advanced caller-only capability, but the site no longer offers it.
  `text` is dropped from the URL allowlist to match, so a `?text=` link is now
  treated like any other unrecognised parameter.
- `filterInput` stops removing apostrophes and letters with diacritics.

Explicitly **not** in this change:

- No result-list changes. Relevance ordering arrives from the API; the result
  cards, paging and map are untouched. Snippets showing *why* a result matched
  are a separate and worthwhile change.
- No removal of `filterInput`. Client-side stripping is not a security control
  — anyone can call the API directly — but widening it is a contained fix and
  removing it is a separate decision.
- No autocomplete, facets or "did you mean". Those were weighed in the same
  review and remain follow-ups.

## Capabilities

### New Capabilities

- `collection-search-form`: what the search form offers, which parameter each
  field drives, and what each one searches.

### Modified Capabilities

- `url-param-handling`: the allowlist gains `q`. The existing requirement pins
  the allowlist to the set of input `name` attributes in `Search.js`, so adding
  a field changes that set by definition.

## Impact

- **Code**: `src/components/container/Search.js` (the fields),
  `src/pages/Home.js` (allowlist, `filterInput`).
- **API dependency**: `q` requires the `ranked-metadata-search` change in
  `azlibrary_api`, which in turn requires `kitchensink_search` from
  `add-weighted-search-vector` in `azlibrary_database`. All three must reach an
  environment together; `q` against an API without it returns 400.
- **User-visible**: the main search box changes what it searches, so it returns
  more results than the `title` box it replaces, ranked rather than ordered by
  year. The Full-Text Search box disappears. Anyone used to either will notice,
  and any shared link carrying `?text=` will now return unfiltered results
  rather than the full-text search it used to run.
- **Rollout**: dev only, and gated. Production waits until all three layers are
  finished and tested together.
