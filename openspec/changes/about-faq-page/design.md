## A page component, not a static HTML file

The question asked was whether this should be static HTML in the Arizona
Bootstrap style. It should not, and the reason is already sitting in the
repository: `Contact` is exactly this page with different words in it.

`Contact` is a component under `src/pages/`, routed in `App.js` and rendered
through `Layout`'s `<Outlet />`. Because the whole application imports
`arizona-bootstrap`, it *is* in the Arizona Bootstrap style without doing
anything to be — and it gets the red university header, the nav with its
active states, the announcement box and the footer disclaimer for free.

A file in `public/about.html` would be served outside the React tree, which
means hand-copying the header markup, the nav, the announcement box and the
footer into it. From that moment there are two copies of the site chrome. The
next change to the nav updates one of them. This is the same failure the API
side of this work is about — a hand-maintained copy of something generated
elsewhere — and it is not worth introducing here to save a route definition.

The one thing static HTML would buy is a page that renders without
JavaScript. The rest of the site does not render without JavaScript either,
so an About page that did would be an island.

## Shared content, branched where it differs

`Layout` already branches the announcement box on
`process.env.REACT_APP_SITE`, and already demonstrates the trap: the recent-
changes list had to be lifted into a shared `searchChanges` constant precisely
because two hand-kept copies drift.

The About page takes that shape from the start. Answers that hold for both
sites — the organisation, the licence, the API, support, how search works —
are written once. Only "what does this site hold" branches, because the two
sites genuinely hold different things from different sources:

- the library build publishes AZGS materials, with the Campus Repository as
  an alternate route to the same publications;
- the mining build publishes material originally compiled by the now-defunct
  Arizona Department of Mines and Mineral Resources, now extended by the AZGS
  Mineral Resources and Bedrock Geology Group.

Both of those sentences already exist, in the two announcement boxes. The
About page is where they belong permanently; the boxes are dismissable and
are for news.

## Where the facts come from

Nothing on this page is invented. Each answer traces to something the system
already asserts:

| Answer | Source |
|---|---|
| Licence is `CC BY-SA 4.0` | `normalize-metadata-json`, which set it on all 23,003 rows and reached production |
| No account needed | no access-rights or embargo field exists anywhere in the API; every documented read route is unauthenticated |
| Formats | `json`, `csv`, `ReSciColl`, `geojson`, `xml`, from the metadata route's format handling |
| API address and shape | `data.azgs.arizona.edu`, versioned at `/api/v1`, CORS open to all origins |
| Disclaimer and copyright | the footer's existing wording, linked rather than restated |
| Scanned documents are not searchable | 8,936 of production's 20,639 documents hold an empty text vector |
| Mining provenance | the ADMM announcement box |

Where a fact is not established — there is no access-rights model in this API,
so there is no tiered-access story to tell — the page says the simple true
thing rather than inventing a policy.

**One source had to be rejected.** The obvious place to read the licence from
is the API's own schema: `AZGS_license` in `metadata/openapi.json` and
`collections/openapi.json` declares a single permitted value. It is wrong. It
still says `CC BY-NC-SA 4.0`, while the collection was relicensed to
`CC BY-SA 4.0` in November 2026 and every row in production now says so. The
NonCommercial clause was never correct for AZGS material, and a page telling
visitors they may not use this material commercially would be a worse error
than any other on it.

The licence therefore comes from the database side — the
`metadata-json-format` spec and the migration that enforced it — not from the
API schema. That the API schema is wrong is a defect in its own right and is
not this change's to fix; it is recorded so that nobody later "corrects" this
page back to the stale value by checking it against `?help=json`.

## The one ordering constraint

The API answer wants to link `/api/v1/docs`, which `swagger-api-docs` adds in
the API repository. The two changes are independent and neither blocks the
other, but a host that has this page and not that route will carry a dead
link.

So the page links `?help=json`, which has existed for years, and gains the
documentation link when the API side is deployed to the same host. That is one
line of content, not a dependency worth building machinery around.
