## Context

`Search.js` renders one form. Its first field is `title`; a `text` field sits
below the collection-group selector; `author`, `keyword`, `series`, `year`,
`file_type`, `latest` and `collection_id` live in a collapsed panel. `Home.js`
owns the state, filters every value through `filterInput`, and builds the
`GET /metadata` query string.

## Decisions

### `q` takes the primary position and `title` moves into the panel

The alternative was adding `q` as a third box alongside `title` and
`text`. Rejected: three search boxes with overlapping meanings is worse than
two, and the field users reach for first should be the one that searches
everything. `title` is a precision tool — "canyon" matches 202 collections as
a title and far more as a general term — so it belongs with the other
single-field filters rather than in front.

This is the most reversible decision here. If it turns out users want the title
box back in front, it is a block move in one file; nothing else depends on the
ordering.

`title` keeps its parameter name, so saved links and bookmarks of the form
`?title=...` keep working, which the spec pins down.

### `text` stays where it is and keeps its own field

`q` and `text` search different things: `q` searches what the library *says*
about a collection, `text` searches what is *in* its documents. Neither
subsumes the other — a term in a scanned report's body is invisible to `q`, and
a keyword assigned by a cataloguer appears in no document. Collapsing them
would lose one or the other, so both stay, with help text that says which is
which.

### `filterInput` is widened, not removed

It currently strips everything outside `a-zA-Z0-9 ’½.-;"=–,:`, which removes
apostrophes and every accented letter. "O'Brien" is searched as "OBrien";
"Cañon del Oro" as "Caon del Oro". Both miss, and the user gets no indication
why. For a library of Arizona geology, losing `ñ` is not an edge case.

The filter is presumably there as input sanitising, but client-side stripping
is not a security control: the API is public and anyone can call it directly
with any string. Whatever protection is needed belongs server-side, where the
text parameters already escape quotes before building the `tsquery`.

So the regex is widened to keep apostrophes and Unicode letters while still
dropping control characters and the brackets and semicolons that have no place
in a search term. Removing the filter entirely is a defensible next step but a
separate decision, and leaving it is the smaller change.

The double quote stays allowed, which is what makes phrase search reachable
from the form at all.

### Dependency across three repositories

`q` only works against an API that implements it, which only works against a
database that has `kitchensink_search`:

```
azlibrary_react  ranked-search-box        (this change)
        needs
azlibrary_api    ranked-metadata-search   (committed, not deployed)
        needs
azlibrary_database add-weighted-search-vector (applied to devazlib only)
```

Against an API without `q`, the request returns 400 and the page shows its
generic error. There is no graceful degradation and none is built: the three
changes are meant to ship together, and a feature-detect for a parameter that
will always exist after the first deploy is cost without benefit.

## Risks

- **The main search box changes meaning.** It will return more results than
  before and order them by relevance rather than year. That is the point, but
  anyone used to the current behaviour will notice, and the result count on a
  familiar query will jump.
- **Relevance is unvalidated against real users.** The weights come from field
  semantics, not from measurement, and there is still no search telemetry. The
  ordering looks right in spot-checks; whether it is right for AZGS staff and
  the public is unknown.
- **No snippets.** With `q` matching abstracts, a result can match for reasons
  invisible in a list showing only title, year and authors. `ts_headline`
  snippets would fix that and are the obvious next change.
- **Widening `filterInput` lets more through.** Deliberate, and the API escapes
  what it receives, but it is a change to what reaches the server from the
  public site and should be read as such in review.
