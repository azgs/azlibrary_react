## Context

The form has one search box, `q`, wired to a ranked search over collection
metadata. `deep-search-mode` in `azlibrary_api` adds `q_mode=deep`, which
widens that same parameter to the text inside documents, sorts every
document-only match below every metadata match, and labels each result
`"metadata"` or `"document"` so a client can tell them apart. This change is
the control and the presentation.

## Decisions

### A switch beside the box, not a mode-switching button

The alternative considered was a button whose label changes — "Search" versus
"Search Deep" — or a segmented toggle on the primary action. Both put the
state inside the action, so the only way to learn which search you are about
to run is to read the thing you are about to click. A control beside the box
it modifies states it plainly.

It is drawn as a **switch** (Bootstrap's `custom-control custom-switch`),
matching the map's "Filter results to map extent" control rather than the
plain checkboxes in the advanced panel. That is more than a resemblance: the
form already draws this distinction, using plain checkboxes for filters on a
field — `latest`, "Only show most recent version of items" — and a switch for
the one control that changes how the search itself behaves. `q_mode` is the
second of those, so the switch is the consistent choice rather than merely a
tidier-looking one. Underneath it is the same `input type="checkbox"`, so none
of the value mapping below changes.

One thing to carry forward: `custom-switch` is Bootstrap 4. The pending
`migrate-az-bootstrap-5` change renames it to `form-switch`, and will need to
move this control and the map's together.

It also serialises for free. The form's machinery turns input `name`
attributes into query parameters, so a checkbox named `q_mode` becomes a
shareable `?q_mode=deep` link with no special handling, and keeps the
`url-param-handling` invariant — "the allowlist SHALL match the set of input
`name` attributes in `Search.js`" — literally true rather than nearly true.

### Default off, because the corpus is uneven

8,936 of production's 20,639 documents (43%) hold an empty tsvector: scanned
pages that were never OCR'd. Deep search therefore reaches into some
collections and not others, for reasons that have nothing to do with what the
reader asked and are invisible from the results.

Defaulting the box on would bake that bias into every search — collections
whose PDFs happened to extract cleanly would always be favoured, and nobody
would see why. As an explicit action it is honest: the reader asked for a
wider net and got one. This is the same reasoning recorded in
`deep-search-mode`, and it is the main argument for OCR being worth more than
any further query work.

### The checkbox must not emit a boolean

`handleChange` in `Search.js` maps any checkbox to `e.target.checked`:

```js
const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
```

That is right for `latest`, which the API accepts as `true`/`false`. It is
wrong here: `q_mode` is an enumerated parameter taking `metadata` or `deep`,
and `?q_mode=true` is a 400 by design — `deep-search-mode` rejects
unrecognised values rather than falling back silently.

So the control needs a value mapping: checked emits `"deep"`, unchecked emits
`""`. The empty string then disappears on its own, because
`buildAndSubmitQuery` in `Home.js` already skips falsy values:

```js
Object.keys(params).forEach(key => {
  const value = params[key];
  if (value) { urlParams.append(key, filterInput(value)); }
})
```

An unchecked box therefore sends no `q_mode` at all, which is what makes the
default path byte-identical to today's request rather than merely equivalent.
`filterInput` passes `"deep"` through untouched.

The same mapping runs in reverse when the page loads from a URL: the box is
checked when `q_mode` is `"deep"`.

### The grouping heading needs no offset, and no new data

The obvious reading of "insert a divider where the tiers change" is that the
list must know how far into the result set the page starts, and that
`SearchResults` would need the `offset` that currently lives in `Home.js`.

It does not, because of a property the API guarantees: every metadata match
sorts before every document-only match, across the whole result set. So within
any page, the two kinds cannot interleave. The rule reduces to one line of
intent:

> render the heading immediately before the first result whose `match` is
> `"document"`.

On a mixed page that lands it mid-list. On a later page that holds only
document matches, the first result *is* the first document match, so the
heading lands at the top — which is exactly the behaviour wanted for a page
that would otherwise read as a continuation of the catalogue matches. No
offset, no page arithmetic, no second code path.

`SearchResults` already receives the whole `results` object, so `data` and
`metadataMatchCount` are both in hand and no prop plumbing is needed either.

### `metadataMatchCount` is for the empty state

With the heading rule above, the count is not needed to place the divider. It
earns its place in the sentence the reader sees when a widened search matched
nothing in the catalogue: "no collection records matched; 190 results were
found inside documents" rather than a bare "190", which invites the reader to
treat page-40 hits as catalogue matches and then wonder why the titles look
unrelated.

### Label wording is the user's call

The label needs to say that the search will look inside the documents
themselves, in the register of the help text already under the search box.
Something in the shape of "Also search the text inside documents". The exact
wording is left to the user, who has revised this form's wording before; task
1.1 records it as needing sign-off rather than inventing it here.

## Risks

- **The heading is the whole feature.** Without it, a widened search returning
  six catalogue matches and 190 document matches reads as a list that has gone
  wrong — unrelated titles, no visible reason for any of them. The checkbox
  and the heading ship together or not at all.
- **No snippet means no explanation.** Even with the heading, a document-tier
  result cannot say *why* it matched; the words are on a page the reader
  cannot see from the list. This is the largest remaining gap and it is
  `ts_headline` work in the API, noted as a follow-up in `deep-search-mode`.
- **Two builds.** The form is shared between the library and ADMM variants, so
  both need rebuilding and both need checking. ADMM is the one more likely to
  be forgotten.
- **Deep searches are slower and much larger.** A widened search can return an
  order of magnitude more collections, which lands on paging. Nothing breaks,
  but a reader who ticks the box and sees the count jump from 6 to 196 should
  be able to tell at a glance that 190 of those are a different kind of thing
  — which is, again, the heading.
