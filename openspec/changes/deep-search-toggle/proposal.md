## Why

`ranked-search-box` removed the Full-Text Search field from the form and left
searching document contents as an API-only capability reachable by
constructing a `?text=` URL by hand. That was the right call for the field —
it made a person choose which box to type in before they knew where the answer
lived, and then `AND`ed the two — but it leaves a real gap on the site.

A collection's catalogue record is short. A place name that appears on page 40
of a scanned report, and nowhere in the title, keywords, authors or abstract,
is unreachable from the form. Someone searching for it gets nothing and
concludes the library does not hold it.

`deep-search-mode` in `azlibrary_api` adds `q_mode=deep`, which widens `q` to
document contents and ranks every document-only match below every catalogue
match, labelling each result so a client can tell them apart. This change is
the control that drives it and the presentation that makes it readable.

## What Changes

- Add a **default-off checkbox** to the search form that widens the search box
  into document contents. Unchecked, the form behaves exactly as it does
  today.
- **Modified capability** `q_mode` joins the URL parameter allowlist, so a
  deep search can be linked and shared like any other filter.
- **New capability** The result list separates the two kinds of match: a
  heading before the first document-only result, so a run of page-40 hits is
  never presented as though it were a run of catalogue matches.
- Use the API's metadata match count for an honest empty state — "no catalogue
  matches, 190 found inside documents" rather than a bare number that invites
  the reader to treat all 196 as equivalent.

Explicitly **not** in this change:

- **No change to the default search.** The box, its label and its help text
  stay as `ranked-search-box` left them. An unchecked form sends no `q_mode`
  and gets exactly today's results in today's order.
- **No snippets.** A document-tier result still gives no clue *which* words
  matched, because they are on a page the reader cannot see. `ts_headline` is
  the answer and it is a separate change in the API, noted as a follow-up
  there.
- **No return of the Full-Text Search field.** `text` remains a URL-only
  filter, unchanged. The checkbox is not that field coming back: it widens one
  box rather than adding a second, and it `OR`s rather than `AND`s.
- **No auto-escalation.** Ticking the box stays the reader's decision. See
  design.md in `deep-search-mode`.

## Capabilities

### New Capabilities

- `search-results-list`: what the result list shows and how it groups results.
  Nothing specifies it today — `ranked-search-box` deliberately left the
  result list alone — and the snippet work that is likely to follow will want
  somewhere to live.

### Modified Capabilities

- `collection-search-form`: gains the reach control. The capability is added
  by `ranked-search-box`, which is not yet archived; this requirement is
  additive and changes none of its existing ones.
- `url-param-handling`: the allowlist gains `q_mode`. The existing requirement
  pins the allowlist to the set of input `name` attributes in `Search.js`, so
  adding a control changes that set by definition.

## Impact

- **Code**: `src/components/container/Search.js` (the checkbox and its
  value mapping), `src/pages/Home.js` (allowlist),
  `src/components/presentation/SearchResults.js` (the grouping heading).
- **API dependency**: requires `deep-search-mode` in `azlibrary_api`, which
  requires `ranked-metadata-search`, which requires `kitchensink_search` from
  `add-weighted-search-vector` in `azlibrary_database`. A checked box against
  an API without `q_mode` returns 400.
- **Both site variants.** The form is shared, so the checkbox appears in the
  ADMM build as well as the library build. Mine collections hold documents
  too, so the behaviour is wanted in both; it is called out because it means
  two builds to verify, not one.
- **User-visible**: a new control in the form, and a heading that can appear
  part-way down the result list. Nothing changes for anyone who leaves the box
  alone.
- **Rollout**: dev only, and gated. Production waits until all three layers
  are finished and tested together.
