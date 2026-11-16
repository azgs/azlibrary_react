## MODIFIED Requirements

### Requirement: Search filter URL parameters SHALL be restricted to a defined allowlist

When the `Home` page mounts, only URL query parameters whose keys appear in a fixed allowlist of recognized search-filter keys SHALL be copied into the application's search-parameter state and forwarded to the API. The allowlist SHALL match the set of input `name` attributes in `Search.js` (currently: `q`, `title`, `collection_group`, `mine_collection`, `mine_resource_id`, `year`, `author`, `keyword`, `series`, `file_type`, `latest`, `collection_id`). `text` is deliberately absent: the form no longer offers full-text document search, which is an API-only capability..

#### Scenario: URL contains the ranked search parameter
- **WHEN** the page is loaded with `?q=uranium`
- **THEN** the primary search field prefills with `uranium`
- **AND** the outbound `GET /metadata` request includes `q=uranium`

#### Scenario: URL contains only allowed search-filter keys
- **WHEN** the page is loaded with `?title=Grand+Canyon&author=Smith`
- **THEN** the search form prefills with `title="Grand Canyon"` and `author="Smith"`
- **AND** the outbound `GET /metadata` request includes `title` and `author` query parameters

#### Scenario: URL contains the retired text parameter
- **WHEN** the page is loaded with `?text=uranium`
- **THEN** the search-parameter state does not contain `text`
- **AND** the outbound `GET /metadata` request does not include `text`

#### Scenario: URL contains a tracking parameter
- **WHEN** the page is loaded with `?_gl=1*139hltq*_ga*MjIw...`
- **THEN** the search-parameter state does not contain `_gl`
- **AND** the outbound `GET /metadata` request does not include `_gl`

#### Scenario: URL contains a mix of allowed and disallowed keys
- **WHEN** the page is loaded with `?q=mine&_gl=...&utm_source=email&fbclid=abc`
- **THEN** the search form prefills with `q="mine"`
- **AND** the outbound `GET /metadata` request includes `q` but does not include `_gl`, `utm_source`, or `fbclid`

#### Scenario: URL contains no parameters
- **WHEN** the page is loaded with no query string
- **THEN** the application behaves identically to the pre-existing default (no prefill, default search executes)
