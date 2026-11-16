## 1. Implementation

- [ ] 1.1 **Agree the checkbox label with the user** before writing it. It
      needs to say the search will look inside the documents themselves, in
      the register of the existing help text — something in the shape of "Also
      search the text inside documents". The user has revised this form's
      wording before; do not invent it.
- [ ] 1.2 Add the checkbox to `Search.js`, named `q_mode`, outside the
      `#advancedSearch` collapse so it is visible with the form collapsed.
      Follow the existing `latest` checkbox markup.
- [ ] 1.3 Map its value: checked emits `"deep"`, unchecked emits `""`. A bare
      `e.target.checked` would send `?q_mode=true`, which the API rejects by
      design. Unchecked must send no `q_mode` at all — `buildAndSubmitQuery`
      already drops falsy values, so an empty string is enough.
- [ ] 1.4 Check the box on load when the URL carries `q_mode=deep`.
- [ ] 1.5 Add `q_mode` to `ALLOWED_URL_PARAMS` in `Home.js`.
- [ ] 1.6 In `SearchResults.js`, render a heading immediately before the first
      result whose `match` is `"document"`. No offset or page arithmetic — the
      API guarantees the two kinds never interleave, so this one rule handles
      the mid-page case and the whole-page case alike. See design.md.
- [ ] 1.7 Use `metadataMatchCount` for the empty-catalogue state: say that no
      collection records matched and the results were found inside documents,
      rather than reporting a bare total.

## 2. Verification

Both variants, built and served, against a dev API carrying
`deep-search-mode`.

- [ ] 2.1 **The unchecked form is unchanged.** A set of searches returns
      identical results in identical order with and without this change, and
      the outbound request carries no `q_mode`. This is the regression that
      matters most.
- [ ] 2.2 Checking the box finds a collection by document text that the
      unchecked form does not return.
- [ ] 2.3 The heading appears between the two kinds on a mixed page, above the
      first result on a page of document matches only, and not at all on a
      page of catalogue matches only.
- [ ] 2.4 Paging through a widened result set keeps the heading correct on
      every page.
- [ ] 2.5 `?q=x&q_mode=deep` prefills the box and checks the control; the box
      is unchecked for `?q=x` alone.
- [ ] 2.6 Clear filters returns the checkbox to unchecked.
- [ ] 2.7 The empty-catalogue state reads correctly for a term that matches
      only inside documents.
- [ ] 2.8 The checkbox composes with the advanced filters and with `latest`.
- [ ] 2.9 **The ADMM build.** Everything above, in the mining variant.
- [ ] 2.10 A widened search for a common term still renders in reasonable
      time; note the result count and the observed wait.

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
