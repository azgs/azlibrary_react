## 1. Implementation

- [x] 1.1 Add `src/pages/About.js`, following `Contact.js`: a page component
      with a `Breadcrumb`, rendered inside the existing `Layout`.
- [x] 1.2 Route it at `/about/` in `src/App.js`, beside `/contact/`.
- [x] 1.3 Change the nav entry in `src/pages/Layout.js` from the external
      GitHub anchor to a `<Link to="/about">`, with the `pathname`-based
      active class that Home and Contact use.
- [x] 1.4 Write the shared answers: the organisation; the licence
      (`CC BY-SA 4.0`, linked — **not** the `CC BY-NC-SA 4.0` the API schema
      still declares, see design.md); access with no account or key; the API
      (address, `/api/v1`, formats, `?help=json`); how search works and why a
      scanned document may not be findable; support, linking `/contact/` and
      `azgs-info@arizona.edu`; and the repository link the nav used to carry.
- [x] 1.5 Write the per-site holdings answer, branched on
      `REACT_APP_SITE`, reusing the wording already in the two announcement
      boxes. Keep every shared answer outside the branch.
- [x] 1.6 Link the footer's existing disclaimer rather than restating it, so
      there is one copy of that text.

## 2. Verification

Run both builds locally — `REACT_APP_SITE=azlibrary` and `REACT_APP_SITE=ADMM`.

- [x] 2.1 About opens in the same tab, inside the site chrome, on both builds.
- [x] 2.2 The nav entry shows active on `/about/` and not elsewhere.
- [x] 2.3 The holdings answer differs between the two builds; every other
      answer is identical. Diff the rendered text of the two.
- [x] 2.4 Every link on the page resolves: the licence, the Campus Repository,
      `azgs.arizona.edu`, the repository, `/contact/`, and the API links.
- [x] 2.5 The page is legible at phone width — the nav collapses and the
      content does not scroll sideways.
- [x] 2.6 Deep-linking `/about/` directly, not just clicking through, serves
      the page rather than the 404 route.

## 3. Rollout

- [ ] 3.1 Deploy both builds to the dev host alongside whatever else is
      queued, and confirm the page on `dev.library.azgs.arizona.edu` and the
      mining dev host.
- [ ] 3.2 Add the `/api/v1/docs` link once `swagger-api-docs` is deployed to
      the same host, and not before.
- [ ] 3.3 Production is gated on the whole workflow.

## 4. Two decisions taken during implementation

**The API links use `REACT_APP_AZLIB_API_URL`, not a hostname.** design.md
named `data.azgs.arizona.edu`; the client already resolves the API per
environment through that variable, so writing the host into the page would
have made the links wrong on dev and locally. Verified that none of them
renders as `undefined`.

**The search answer does not name the "Include document text" switch.** This
branch is cut from `main`, which does not have it — `ranked-search-box` is
still unmerged. The answer describes what the search covers and the
scanned-document limitation, both true today and both sufficient for the
spec's scenario. When `ranked-search-box` merges, that answer should gain a
sentence naming the switch.

Related: both branches edit `src/pages/Layout.js`. The regions differ (the nav
entry here, the announcement box there), so a conflict is unlikely, but they
should not be merged blind.

## 5. Verified on 2026-11-17

Both variants built and driven in a browser at `localhost:3001`.

- Library build: `h1` reads "About the AZGS Library", holdings name the
  Document Repository and the Campus Repository.
- Mining build: `h1` reads "About AZGS Mining Info", holdings name
  minedata.azgs.arizona.edu and the Dept. of Mines & Mineral Resources.
- Both: the same eight sections, `CC BY-SA 4.0` present, no occurrence of
  "NonCommercial" anywhere on the page.
- Nav entry carries `nav-item active` on `/about/` and on `/about`, and
  routes in the same tab.
- 12 links, none empty, none containing `undefined`.
- 375px wide: `scrollWidth === innerWidth`, no horizontal overflow.

Not verified: external URLs were checked for form, not fetched.
