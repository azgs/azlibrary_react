## 1. Implementation

- [ ] 1.1 Add `src/pages/About.js`, following `Contact.js`: a page component
      with a `Breadcrumb`, rendered inside the existing `Layout`.
- [ ] 1.2 Route it at `/about/` in `src/App.js`, beside `/contact/`.
- [ ] 1.3 Change the nav entry in `src/pages/Layout.js` from the external
      GitHub anchor to a `<Link to="/about">`, with the `pathname`-based
      active class that Home and Contact use.
- [ ] 1.4 Write the shared answers: the organisation; the licence
      (`CC BY-SA 4.0`, linked — **not** the `CC BY-NC-SA 4.0` the API schema
      still declares, see design.md); access with no account or key; the API
      (address, `/api/v1`, formats, `?help=json`); how search works and why a
      scanned document may not be findable; support, linking `/contact/` and
      `azgs-info@arizona.edu`; and the repository link the nav used to carry.
- [ ] 1.5 Write the per-site holdings answer, branched on
      `REACT_APP_SITE`, reusing the wording already in the two announcement
      boxes. Keep every shared answer outside the branch.
- [ ] 1.6 Link the footer's existing disclaimer rather than restating it, so
      there is one copy of that text.

## 2. Verification

Run both builds locally — `REACT_APP_SITE=azlibrary` and `REACT_APP_SITE=ADMM`.

- [ ] 2.1 About opens in the same tab, inside the site chrome, on both builds.
- [ ] 2.2 The nav entry shows active on `/about/` and not elsewhere.
- [ ] 2.3 The holdings answer differs between the two builds; every other
      answer is identical. Diff the rendered text of the two.
- [ ] 2.4 Every link on the page resolves: the licence, the Campus Repository,
      `azgs.arizona.edu`, the repository, `/contact/`, and the API links.
- [ ] 2.5 The page is legible at phone width — the nav collapses and the
      content does not scroll sideways.
- [ ] 2.6 Deep-linking `/about/` directly, not just clicking through, serves
      the page rather than the 404 route.

## 3. Rollout

- [ ] 3.1 Deploy both builds to the dev host alongside whatever else is
      queued, and confirm the page on `dev.library.azgs.arizona.edu` and the
      mining dev host.
- [ ] 3.2 Add the `/api/v1/docs` link once `swagger-api-docs` is deployed to
      the same host, and not before.
- [ ] 3.3 Production is gated on the whole workflow.
