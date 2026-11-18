## 1. Implementation

- [x] 1.1 Make the form's first field drive `q`, labelled **Search**, with help
      text describing what it searches and showing the double-quote phrase
      syntax.
- [x] 1.2 Move `title` into the expanded filter panel, ahead of Year, with help
      text saying it is the narrower, title-only option. It keeps its parameter
      name, so `?title=...` links still work.
- [x] 1.3 Remove the Full-Text Search field from the form. `text` **stays** in
      the URL allowlist: removing the field is about what the form offers, not
      about which filters are valid, so a hand-constructed or shared `?text=`
      URL still runs the search. (It was briefly dropped from the allowlist
      too; that went further than intended and was reverted.)
- [x] 1.3a Remove the help text under Title.
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
- [x] 2.7 Full-Text Search was verified working before it was removed:
      `?text=uranium` returned 545 collections against 138 for `q=uranium`.
      The field and the allowlist entry were then taken out; re-verified below.
- [x] 2.8 Characters survive the round trip. `Cañon del Oro` went out as
      `q=Ca%C3%B1on+del+Oro` and `O'Brien` as `q=O%27Brien`; before this change
      they would have been `Caon+del+Oro` and `OBrien`.

## 3. Rollout

- [x] 3.1 Deployed to dev 2026-11-16 together with `ranked-metadata-search`.
      Built on the host with `REACT_APP_SITE=azlibrary` and rsynced to
      `/var/www/azlibrary_react/html`, which nginx serves as
      `dev.library.azgs.arizona.edu`.

      **Deployment notes for next time.** The same source builds two sites:
      `REACT_APP_SITE=azlibrary` to `/var/www/azlibrary_react/html`, and
      `ADMM` to `/var/www/mines_react/html` for `dev.minedata` and
      `dev.mininginfo`. There is no deploy script; `.env` is edited between
      builds. The host's `.env` was on `ADMM` and was restored to `ADMM`
      afterwards. The host checkout moved from a detached HEAD at `b8a4443` to
      `ranked-search-box`. The previous library bundle is backed up at
      `/var/www/azlibrary_react/html.bak-20261116`.

      The ADMM variant was rebuilt and deployed the same day, so all three dev
      sites now carry the Search box. Previous mines bundle backed up at
      `/var/www/mines_react/html.bak-20261116`. Verified afterwards that each
      site serves its own bundle — `dev.library` on `main.94a3665f.js` built as
      `azlibrary`, `dev.minedata` on `main.3f100e6b.js` built as `ADMM` — and
      that all three return 200.

      On `dev.minedata`, `?q=copper` shows "Filter Mine Collections", prefills
      the Search box and returns **9,740** collections, exactly matching
      `collection_group=ADMM&q=copper` from the API, so the mining scope still
      applies on top of the ranked search.
- [x] 3.1a Redeployed both variants 2026-11-16 after the form changes
      (`c8c2a3c`). Verified on the live sites: the Full-Text field is gone from
      both, the Title help text is gone, and the Search help reads exactly as
      supplied. On `dev.minedata`, `?q="copper ore"` still shows "Filter Mine
      Collections" and returns 2 collections, so phrase search and the mining
      scope both survive.

      That deploy also carried `text` out of the URL allowlist, which was more
      than intended: `?text=uranium` returned the unfiltered 1,780 collections
      and logged `Dropped unexpected URL param`. Reverted — `text` is a valid
      filter with no form field. **The currently deployed bundles still have
      the dropped-allowlist behaviour and need rebuilding.** The host `.env` was restored to `ADMM` as found, and
      the original pre-change bundles remain backed up at
      `/var/www/*/html.bak-20261116`.
- [x] 3.2 **The three layers were exercised together on dev.** Through
      `https://dev.library.azgs.arizona.edu`: `?q="Grand Canyon"` prefills the
      Search box with its quotes intact and returns 60 collections led by "The
      Redwall Limestone" and "Grand Canyon Stratigraphy"; `title` works from
      the expanded panel; `?q=Cañon del Oro` keeps its `ñ` through to a 200
      from the live API.

      The clearest demonstration that the whole chain works: `q=Billingsley`
      returns **3** collections on the live site while `author=Billingsley`
      returns **0**. Those three match on their abstracts — text that was
      indexed nowhere before `add-weighted-search-vector`, unreachable before
      `ranked-metadata-search`, and untypeable before this change.
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
