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
- [x] 2.4 Every link on the page resolves — **fetched, not just checked for
      form**. The first pass only verified the hrefs were well formed, which
      missed a 404. See section 7.
- [x] 2.5 The page is legible at phone width — the nav collapses and the
      content does not scroll sideways.
- [x] 2.6 Deep-linking `/about/` directly, not just clicking through, serves
      the page rather than the 404 route.

## 3. Rollout

- [ ] 3.1 Deploy both builds to the dev host alongside whatever else is
      queued, and confirm the page on `dev.library.azgs.arizona.edu` and the
      mining dev host.
- [x] 3.2 Add the `/api/v1/docs` link once `swagger-api-docs` is deployed to
      the same host, and not before. Done 2026-11-17, after both were stacked
      on dev. **This reverses the dependency** — see section 6.
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

## 6. Hard dependency on swagger-api-docs

The API answer now links `/api/v1/docs`, `?help=json`, `?help=swagger` and
`?help=html`. Two of those — the browser and `help=swagger` — exist only in
`azgs/azlibrary_api#131`.

So this page must not reach a host that #131 has not reached. Before, the link
was merely absent; now it is a 404 waiting to happen. Concretely:

- **#131 merges and deploys before this does.** Not the other way round, and
  not simultaneously to different hosts.
- If #131 is rejected or deferred, the two new bullets come back out of
  `About.js` before this ships.

Noted here rather than only in the PR because a tasks file outlives a review
thread.

## 7. A link that was well formed and still broken

The page shipped to dev linking `github.com/azgs/azlibrary_api` under the
heading "Where is the source code?", with the sentence "This site is open
source."

`azgs/azlibrary_api` is a **private** repository. That link returns 404 to
every visitor, and the claim was only ever true of the web application.

The first verification pass checked that each href was non-empty and contained
no `undefined`, and called that "every link resolves". It was not the same
thing. Fetching all nine links found it immediately:

| link | anonymous |
|---|---|
| `azgs/azlibrary_react` | 200 |
| `azgs/azlibrary_react/issues` | 200 |
| `azgs/azlibrary_api` | **404** |
| creativecommons.org licence | 200 |
| azgs.arizona.edu | 200 |
| UA Campus Repository | 200 |
| the four API links | 200 |

Fixed by linking and claiming only the web application. Whether
`azlibrary_api` should be public is a separate decision for AZGS; if it is
made public, the sentence can widen again.

Carry this forward: a link check on a page meant for the public means issuing
the request, as an anonymous client. Private repositories and internal hosts
look fine in the markup and fail only for the reader.
