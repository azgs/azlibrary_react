## MODIFIED Requirements

### Requirement: Search filter URL parameters SHALL be restricted to a defined allowlist

When the `Home` page mounts, only URL query parameters whose keys appear in a fixed allowlist of recognized search-filter keys SHALL be copied into the application's search-parameter state and forwarded to the API. The allowlist SHALL match the set of input `name` attributes in `Search.js` (currently: `q`, `title`, `collection_group`, `mine_collection`, `mine_resource_id`, `text`, `year`, `author`, `keyword`, `series`, `file_type`, `latest`, `collection_id`). `text` is in the allowlist despite having no field in the form: full-text document search is an advanced capability reachable by constructing the URL directly..

#### Scenario: URL contains the ranked search parameter
- **WHEN** the page is loaded with `?q=uranium`
- **THEN** the primary search field prefills with `uranium`
- **AND** the outbound `GET /metadata` request includes `q=uranium`

#### Scenario: URL contains only allowed search-filter keys
- **WHEN** the page is loaded with `?title=Grand+Canyon&author=Smith`
- **THEN** the search form prefills with `title="Grand Canyon"` and `author="Smith"`
- **AND** the outbound `GET /metadata` request includes `title` and `author` query parameters

#### Scenario: URL contains a parameter with no form field
- **WHEN** the page is loaded with `?text=uranium`
- **THEN** the search-parameter state contains `text`
- **AND** the outbound `GET /metadata` request includes `text=uranium`
- **AND** no field in the form displays it, since none exists

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
