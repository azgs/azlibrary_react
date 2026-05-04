## ADDED Requirements

### Requirement: Search filter URL parameters SHALL be restricted to a defined allowlist

When the `Home` page mounts, only URL query parameters whose keys appear in a fixed allowlist of recognized search-filter keys SHALL be copied into the application's search-parameter state and forwarded to the API. The allowlist SHALL match the set of input `name` attributes in `Search.js` (currently: `title`, `collection_group`, `mine_collection`, `mine_resource_id`, `text`, `year`, `author`, `keyword`, `series`, `file_type`, `latest`, `collection_id`).

#### Scenario: URL contains only allowed search-filter keys
- **WHEN** the page is loaded with `?title=Grand+Canyon&author=Smith`
- **THEN** the search form prefills with `title="Grand Canyon"` and `author="Smith"`
- **AND** the outbound `GET /metadata` request includes `title` and `author` query parameters

#### Scenario: URL contains a tracking parameter
- **WHEN** the page is loaded with `?_gl=1*139hltq*_ga*MjIw...`
- **THEN** the search-parameter state does not contain `_gl`
- **AND** the outbound `GET /metadata` request does not include `_gl`

#### Scenario: URL contains a mix of allowed and disallowed keys
- **WHEN** the page is loaded with `?title=mine&_gl=...&utm_source=email&fbclid=abc`
- **THEN** the search form prefills with `title="mine"`
- **AND** the outbound `GET /metadata` request includes `title` but does not include `_gl`, `utm_source`, or `fbclid`

#### Scenario: URL contains no parameters
- **WHEN** the page is loaded with no query string
- **THEN** the application behaves identically to the pre-existing default (no prefill, default search executes)

### Requirement: Dropped URL parameters SHALL be reported via `console.warn`

For each URL query parameter dropped because its key is not on the allowlist, the application SHALL emit a `console.warn` message that includes the dropped key and value, so that configuration drift and unexpected inbound parameters are visible to anyone with browser devtools open.

#### Scenario: A disallowed key is encountered
- **WHEN** the page is loaded with `?_gl=abc123`
- **THEN** `console.warn` is called once with a message containing `_gl` and `abc123`

#### Scenario: Multiple disallowed keys are encountered
- **WHEN** the page is loaded with `?_gl=x&utm_source=email`
- **THEN** `console.warn` is called once for `_gl` and once for `utm_source`

#### Scenario: Only allowed keys are present
- **WHEN** the page is loaded with `?title=mine`
- **THEN** `console.warn` is not called for any URL parameter
