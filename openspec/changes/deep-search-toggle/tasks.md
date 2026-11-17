## 1. Implementation

- [x] 1.1 **Agreed with the user on 2026-11-17**: the label reads "Include
      document **text** in this search", and the caveat about scanned
      documents appears only once the switch is on — "Many older documents are
      scanned images, and their text cannot be searched." — so the collapsed
      form stays clean and the explanation is there when it becomes relevant.

      "text" rather than "contents", settled on review: the search reaches the
      extracted text and nothing else, so "contents" would promise the
      images, maps and figures in a document as well.
- [x] 1.2 Add the control to `Search.js`, named `q_mode`, outside the
      `#advancedSearch` collapse so it is visible with the form collapsed.
      Drawn as a switch, matching the map's extent control rather than the
      plain checkboxes in the advanced panel — the form already reserves the
      switch for a control that changes how the search behaves. Same
      `input type="checkbox"` underneath, so task 1.3 is unaffected.
- [x] 1.3 Map its value: checked emits `"deep"`, unchecked emits `""`. A bare
      `e.target.checked` would send `?q_mode=true`, which the API rejects by
      design. Unchecked must send no `q_mode` at all — `buildAndSubmitQuery`
      already drops falsy values, so an empty string is enough.
- [x] 1.4 Check the box on load when the URL carries `q_mode=deep`.
- [x] 1.5 Add `q_mode` to `ALLOWED_URL_PARAMS` in `Home.js`.
- [x] 1.6 In `SearchResults.js`, render a heading immediately before the first
      result whose `match` is `"document"`. No offset or page arithmetic — the
      API guarantees the two kinds never interleave, so this one rule handles
      the mid-page case and the whole-page case alike. See design.md.
- [x] 1.7 Use `metadataMatchCount` for the empty-catalogue state: say that no
      collection records matched and the results were found inside documents,
      rather than reporting a bare total.

- [x] 1.8 Announce the change in the dismissable notice at the top of both
      sites. The library site's box existed but was switched off with a
      literal `&& false`; it is now enabled, and its previous change list —
      the minedata migration and the open-in-new-tab change — was dropped on
      the user's instruction, both having been live long enough that calling
      them recent was misleading. The mining site's box was already showing,
      with a commented-out "Recent Changes" section that is now in use. Both lists come from one `searchChanges` constant in `Layout.js`,
      since the two sites run the same form and two hand-kept copies would
      drift.

## 2. Verification

Both variants driven in a browser against a local API carrying
`deep-search-mode`, itself against `devazlib`.

- [x] 2.1 **The unchecked form is unchanged.** `?q=lithification` with the box
      unchecked issues `GET /metadata?collection_group=…&q=lithification` —
      no `q_mode` on the request at all, which is the empty-string mapping
      doing its job rather than sending `q_mode=metadata`.
- [x] 2.2 Checking the box widens the search: `q=Chiricahua` returns 16
      collections, and the same search with the box ticked returns 155.
- [x] 2.3 The heading lands where the tiers meet, in all three cases.
      `q=bentonitic` puts it after two results on page 1; `q=Chiricahua` puts
      it mid-list on page 2, after the sixteenth metadata match; page 3 of
      that search opens with it above the first result, with no offset passed
      to the component.
- [x] 2.4 Paging keeps it correct across pages 1, 2 and 3 of the same search.
- [x] 2.5 `?q=Chiricahua&q_mode=deep` prefills the box, ticks the control and
      shows the caveat; `?q=Chiricahua` alone leaves it unticked.
- [x] 2.6 Clear filters returns the checkbox to unchecked, drops the caveat
      and strips the query string.
- [x] 2.7 The empty-catalogue state reads correctly: `q=piezometer` with the
      box ticked shows "No collection records matched. All 5 results were
      found inside documents."

      **Testing changed the design here.** The first implementation drew the
      grouping heading as well, so a search with no catalogue matches said the
      same thing twice on every page. The heading is now suppressed when
      `metadataMatchCount` is 0: there is no boundary to mark in a list that
      is entirely document matches, and the sentence above the list already
      says so.
- [x] 2.8 The checkbox composes with the advanced filters and with the
      collection-group filter each variant applies.
- [x] 2.9 **The ADMM build.** Checkbox, caveat, URL prefill and the
      empty-catalogue sentence all behave as in the library build —
      `q=lithification` with the box ticked reports 13 results, none of them
      catalogue matches.
- [x] 2.10 Deep searches return in reasonable time through the form; the
      widest term tried, `q=copper`, was indistinguishable from a plain search
      in use. The measured database cost is in `deep-search-mode` task 2.12.

## 3. Rollout

- [ ] 3.1 Build both variants and deploy to dev. There is no deploy script;
      `.env` is switched between `REACT_APP_SITE=azlibrary`
      (`/var/www/azlibrary_react/html`) and `ADMM`
      (`/var/www/mines_react/html`), with the build run once for each.

      **Note:** dev is currently serving bundles built before commit
      `0171501`, which restored `text` to the allowlist. Rebuilding for this
      change picks that fix up at the same time.
- [ ] 3.2 Review the new control with whoever owns the public site before it
      goes further than dev.
- [~] 3.3 ~~Apply to production.~~ **GATED.** By the user's decision on
      2026-11-16 nothing reaches production until client, API and database are
      finished and tested together. This change additionally requires
      `deep-search-mode` in `azlibrary_api`.

## 4. Follow-ups (deliberately not this change)

- [~] 4.1 ~~Show why a document result matched.~~ `ts_headline` snippets are
      the missing half of this feature — a document-tier result names a
      collection whose title may look unrelated, and the matching words are on
      a page the reader cannot see. API work; noted as a follow-up in
      `deep-search-mode`.
- [~] 4.2 ~~Retire the second OpenSpec root.~~ This repository has both
      `openspec/` and `azlibrary_react/openspec/`. The root one is live; the
      nested one is a stray. Unrelated to search, but it will mislead someone.
- [~] 4.3 ~~A deploy script for the two builds.~~ Both variants are built and
      copied by hand from the same working tree with `.env` edited between
      runs, which is a sequence that is easy to get half-right — and getting
      it half-right means one site silently serves the other's bundle.
