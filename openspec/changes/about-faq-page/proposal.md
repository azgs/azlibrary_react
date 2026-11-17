## Why

The About link in the top ribbon goes to `github.com/azgs/azlibrary_react`, in
a new tab. Someone who clicks About on a library site is asking what the
collection is, whether they may use what they download, and who to ask about
it. What they get is a React repository's file listing.

Nothing on either site answers those questions. The licence appears on an item
page only when that record carries one, and then only as a bare link. The
disclaimer and the copyright line are in the footer, where nobody reads them.
That the API exists at all is visible only in a nav link shown in development
builds. The announcement box carries a sentence of context and a list of
recent changes, but it is dismissable by design — it is for news, not for the
things that stay true.

These are ordinary questions with settled answers. They are simply not
written down anywhere a visitor will find them.

## What Changes

- Add an About page at `/about`, built the way `Contact` is built: a page
  component rendered inside the existing `Layout`, so it carries the site
  header, nav, announcement box and footer without restating any of them.
- Point the nav's About link at it, with the active-state handling that Home
  and Contact already use. The GitHub link is not lost — it moves into the
  page, as the answer to a question about the source rather than as the answer
  to "About".
- Write the page as a short FAQ covering: what the site holds; who the
  Arizona Geological Survey is; what the licence permits; whether an account
  is needed; how to reach the API; how search works and why something might
  not be found; and where to report a problem.
- Branch the answers that genuinely differ between the two sites on
  `REACT_APP_SITE`, as `Layout` already does for the announcement boxes. The
  library and mining sites hold different material and have different
  provenance; the licence, the API and the organisation are common to both.

Explicitly **not** in this change:

- **Not a static HTML file.** The question was raised and answered on
  2026-11-17 — see design.md. A file in `public/` would have to re-create the
  Arizona Bootstrap header, nav and footer by hand and would then drift from
  the real ones.
- **No new licence or rights policy.** Everything the page states about
  licensing comes from what the collection already asserts: every record
  carries `CC BY-SA 4.0`, set by the `normalize-metadata-json` migration that
  reached production in November 2026, and the disclaimer is the footer's
  existing wording. The page must not be written from the API's
  `openapi.json`, which still declares the superseded `CC BY-NC-SA 4.0` —
  see design.md.
- **No change to the announcement box.** It keeps carrying news. The About
  page carries what does not change.
- **No contact-page merge.** `Contact` stays where it is; About links to it
  rather than absorbing it.

## Capabilities

### New Capabilities

- `about-page`: the site's standing self-description — what is reachable from
  the About link, which questions it answers, and how its content differs
  between the two site builds.

### Modified Capabilities

None. `url-param-handling` governs the search form's query parameters and is
untouched: `/about` takes none.

## Impact

- **Code**: a new `src/pages/About.js`; a route in `src/App.js`; the nav link
  in `src/pages/Layout.js`.
- **Both sites get the page**, because both build from this source and share
  `Layout`. The content branches where it must.
- **This page now requires `swagger-api-docs`.** The API answer links
  `/api/v1/docs` and `?help=swagger`, both of which that change adds. It was
  written without them deliberately; the links went in on 2026-11-17 once both
  were running together on dev. The consequence is a real ordering constraint
  rather than a preference: `azgs/azlibrary_api#131` must merge and deploy
  first, or this page carries two dead links. See tasks.md section 6.
- **No API or database counterpart otherwise.** This is a client-only change
  and adds no request the API does not already serve.
- **Accessibility**: the page is text and links inside the existing layout,
  which is where Arizona Bootstrap's own semantics apply. No new widget, no
  new interactive control.
- **Rollout**: dev first, with the rest of the queue. Production waits for the
  whole workflow, as always.
