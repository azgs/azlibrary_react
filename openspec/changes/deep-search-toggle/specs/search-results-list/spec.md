## Purpose

Defines what the result list shows for a set of search results, and how it
groups results that matched in different ways.

## ADDED Requirements

### Requirement: The result list SHALL distinguish document matches from catalogue matches

Where results include collections matched only by the text inside their
documents, the list SHALL mark where those begin, so a run of document matches
is never presented as though it were a continuation of the catalogue matches.
The marking SHALL be derived from what the API reports about each result, not
inferred by the client.

#### Scenario: A page holding both kinds
- **GIVEN** a page of results whose first four matched on metadata and whose remainder matched only inside documents
- **WHEN** the list is rendered
- **THEN** a heading appears between the fourth result and the fifth
- **AND** no heading appears above the first result

#### Scenario: A page holding only document matches
- **GIVEN** a later page of results, every one of which matched only inside documents
- **WHEN** the list is rendered
- **THEN** the heading appears above the first result, so the page is not read as a continuation of the catalogue matches

#### Scenario: A page holding only catalogue matches
- **GIVEN** a page of results all of which matched on metadata
- **WHEN** the list is rendered
- **THEN** no heading appears

#### Scenario: A search that was not widened
- **GIVEN** a search made with the reach control unchecked
- **WHEN** the list is rendered
- **THEN** no heading appears, because every result matched on metadata

### Requirement: An empty catalogue result SHALL be described, not just counted

Where a widened search matched nothing in collection metadata but matched
inside documents, the list SHALL say so, rather than reporting a single total
that invites the reader to treat every result as a catalogue match.

#### Scenario: Nothing matched the catalogue
- **GIVEN** a widened search matching 190 collections, none of them on metadata
- **WHEN** the results are rendered
- **THEN** the reader is told that no collection records matched and that the results were found inside documents

#### Scenario: A mixed result set
- **GIVEN** a widened search matching 196 collections, 6 of them on metadata
- **WHEN** the results are rendered
- **THEN** the total remains 196
