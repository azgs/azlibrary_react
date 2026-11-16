## 1. Implementation

- [x] 1.1 Make the form's first field drive `q`, labelled **Search**, with help
      text describing what it searches and showing the double-quote phrase
      syntax.
- [x] 1.2 Move `title` into the expanded filter panel, ahead of Year, with help
      text saying it is the narrower, title-only option. It keeps its parameter
      name, so `?title=...` links still work.
- [x] 1.3 Rewrite the Full-Text Search help text so the two boxes are
      distinguishable: `text` searches inside documents, `q` searches what the
      library holds about a collection.
- [x] 1.4 Add `q` to `ALLOWED_URL_PARAMS` in `Home.js`, so `?q=...` prefills
      the form and reaches the API.
- [x] 1.5 Widen `filterInput` to keep Unicode letters and apostrophes, and to
      collapse internal whitespace rather than deleting it. Verified directly:
      `O'Brien` was sent as `OBrien` and is now `O'Brien`; `Cañon del Oro` was
      `Caon del Oro`; `Sonóra` was `Sonra`. `<script>` is still stripped and
      the double quote still survives, so phrase search works from the form.

## 2. Verification

Run in a browser against the dev server on :3001 and the API on :3099, the API
pointed at `devazlib`. Outbound requests read off the network panel, so these
are what actually went over the wire rather than what the form appeared to do.

- [x] 2.1 App compiles and serves. The one eslint warning
      (`no-lone-blocks`, `eqeqeq` in `Search.js`) is pre-existing; this change
      adds none.
- [x] 2.2 The Search box returns ranked results: `uranium` gives 138
      collections and the top eight all carry the term in their titles.
- [x] 2.3 Phrase search works end to end. `?q="Grand Canyon"` sends
      `q=%22Grand+Canyon%22` and returns 60 collections, against the broader
      result for the unquoted words.
- [x] 2.4 `?q=...` prefills the box and runs the search; the box showed
      `"Grand Canyon"` with its quotes intact.
- [x] 2.5 The allowlist still holds. `?title=canyon&utm_source=newsletter&fbclid=abc123`
      sent `collection_group=!ADMM&title=canyon` only, and logged
      `Dropped unexpected URL param` for both tracking keys.
- [x] 2.6 `title` works from its new place in the expanded panel and still
      answers `?title=canyon` — 50 collections, narrower than the ranked
      search, as intended.
- [x] 2.7 Full-Text Search still works: `?text=uranium` returns 545
      collections, a different set from the 138 for `q=uranium`, which is the
      distinction the help text now describes.
- [x] 2.8 Characters survive the round trip. `Cañon del Oro` went out as
      `q=Ca%C3%B1on+del+Oro` and `O'Brien` as `q=O%27Brien`; before this change
      they would have been `Caon+del+Oro` and `OBrien`.

## 3. Rollout

- [ ] 3.1 Deploy to dev **together with** `ranked-metadata-search` in
      `azlibrary_api`. The box returns 400 against an API without `q`.
- [ ] 3.2 Exercise the three layers together on dev: database vector, API
      parameter, client box. This is the end-to-end test the production gate
      waits on.
- [ ] 3.3 Review the changed meaning of the primary box with whoever owns the
      public site. Familiar queries will return more results, ordered by
      relevance rather than year.
- [~] 3.4 ~~Apply to production.~~ **GATED.** By the user's decision on
      2026-11-16 nothing reaches production until client, API and database are
      finished and tested together. This change is the last of the three, so
      the gate opens once 3.2 passes and the owners are happy with 3.3.

## 4. Follow-ups (deliberately not this change)

- [~] 4.1 ~~Show why a result matched.~~ Not here. With `q` matching abstracts,
      a result can match for reasons invisible in a card showing only title,
      year and authors. `ts_headline` snippets from the API would fix it and
      are the obvious next change — probably the single largest remaining
      improvement to how the search feels.
- [~] 4.2 ~~Remove `filterInput` entirely.~~ Not here. Client-side stripping is
      not a security control, since the API is public and accepts anything sent
      directly; escaping belongs server-side, where it already happens.
      Widening it was the contained fix. Removing it is defensible but is its
      own decision.
- [~] 4.3 ~~Retire the second OpenSpec root.~~ `azlibrary_react/openspec/`
      still exists alongside the canonical one at the repository root, holding
      a single archived change from February 2026. Harmless but confusing: two
      `config.yaml` files means `openspec` behaves differently depending on
      where it is run from.
