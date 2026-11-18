## Purpose

Defines what the collection search form offers: which API parameter each field
drives, what each one searches, and what the form tells the user about them.

## ADDED Requirements

### Requirement: The primary field SHALL search all collection metadata, ranked

The form's first and most prominent field SHALL drive the API's `q` parameter,
matching a collection when the term appears in its title, keywords, authors,
series or abstract, with results ordered most-relevant first.

#### Scenario: Term in an abstract
- **GIVEN** a collection whose abstract mentions a term and whose title does not
- **WHEN** a user types that term into the primary field and applies the filters
- **THEN** that collection appears in the results

#### Scenario: Title matches rank first
- **GIVEN** one collection with the term in its title and another with it only in its abstract
- **WHEN** a user searches that term in the primary field
- **THEN** the title match appears above the abstract match

#### Scenario: Quoted phrase
- **WHEN** a user types a quoted phrase into the primary field
- **THEN** the quotes reach the API intact and the phrase is matched as a phrase

### Requirement: Field help text SHALL describe what the field searches

Each search field's help text SHALL describe what that field actually matches.
No field SHALL advise a technique the underlying parameter does not support.

#### Scenario: Primary field help
- **WHEN** a user reads the help under the primary search field
- **THEN** it says the field searches titles, keywords, authors and abstracts
- **AND** it does not tell the user to type a partial title

#### Scenario: Help points at the rest of the form
- **WHEN** a user reads the help under the primary search field
- **THEN** it tells them where to find the remaining search options

### Requirement: Full-text document search SHALL be a valid filter without a form field

Searching the extracted text of documents is an advanced capability with no
field in the form, but it SHALL remain a usable filter: a hand-constructed or
shared `?text=` URL SHALL run that search.

#### Scenario: No full-text field
- **WHEN** a user views the form, expanded or collapsed
- **THEN** there is no field that searches inside document contents

#### Scenario: A text URL parameter arrives
- **WHEN** the page is loaded with `?text=uranium`
- **THEN** the results are filtered to collections whose documents match
- **AND** the outbound `GET /metadata` request includes `text=uranium`

#### Scenario: The API keeps the capability
- **WHEN** a client calls `GET /metadata?text=uranium` directly
- **THEN** the API answers it as before; removing the field changes the form only

#### Scenario: The filter can be cleared
- **GIVEN** the page was loaded with `?text=uranium`
- **WHEN** the user clears the filters
- **THEN** the text filter is no longer applied

### Requirement: Single-field filters SHALL remain available

Searching one named field deliberately SHALL remain possible. `title`,
`author`, `keyword` and `series` SHALL each keep a field in the form and SHALL
keep driving their existing API parameters.

#### Scenario: Title filter still present
- **WHEN** a user opens the expanded filter options
- **THEN** a title field is present and drives the `title` parameter

#### Scenario: Existing links keep working
- **WHEN** a user opens a saved link of the form `?title=Grand+Canyon`
- **THEN** the title field prefills and the search runs as before

### Requirement: Search terms SHALL reach the API unmangled

Characters that occur in names and places SHALL NOT be stripped from a search
term before it is sent. Apostrophes and letters carrying diacritics SHALL
survive.

#### Scenario: Apostrophe in a name
- **WHEN** a user searches for `O'Brien`
- **THEN** the term sent to the API is `O'Brien`, not `OBrien`

#### Scenario: Accented place name
- **WHEN** a user searches for `Cañon del Oro`
- **THEN** the term sent to the API retains the `ñ`

#### Scenario: Quoted phrase survives
- **WHEN** a user searches for `"Grand Canyon"`
- **THEN** the double quotes reach the API, so the phrase is matched as a phrase
