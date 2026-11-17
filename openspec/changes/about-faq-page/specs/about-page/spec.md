## Purpose

Defines the site's standing self-description: the page reached from the About
link, the questions it is expected to answer, and how it differs between the
library and mining builds. It exists so that a visitor's first questions —
what is this, may I use it, who runs it — are answered on the site rather
than inferred from a code repository.

## ADDED Requirements

### Requirement: The About link SHALL lead to a page on this site

The About entry in the top navigation SHALL route to an About page within the
application, rendered inside the shared layout so that it carries the same
header, navigation and footer as every other page. It SHALL NOT navigate away
to an external destination, and it SHALL show the same active state as the
other in-site navigation entries when that page is open.

#### Scenario: Following the About link
- **WHEN** a visitor clicks About in the top navigation
- **THEN** the About page opens within the site, in the same tab
- **AND** the site header, navigation and footer are present

#### Scenario: Active state
- **GIVEN** the visitor is on the About page
- **WHEN** the navigation is rendered
- **THEN** the About entry is marked active, as Home and Contact are on their own pages

#### Scenario: The repository is still reachable
- **WHEN** a visitor looks for the source code
- **THEN** the About page links to the project's repository

### Requirement: The About page SHALL answer the questions a visitor arrives with

The page SHALL state what the site holds, who operates it, the terms under
which material may be reused, whether an account is required, how the material
may be reached programmatically, and where to report a problem. Each answer
SHALL reflect what the system actually does rather than restating intent.

#### Scenario: Reuse terms
- **WHEN** a visitor reads the licensing answer
- **THEN** it names the licence that collections are published under
- **AND** it links to that licence's own text

#### Scenario: Access
- **WHEN** a visitor reads the access answer
- **THEN** it states that the material is public and requires no account or key

#### Scenario: Programmatic access
- **WHEN** a developer reads the API answer
- **THEN** it names the API's address and links to its documentation
- **AND** it names the response formats the API can return

#### Scenario: Reporting a problem
- **WHEN** a visitor reads the support answer
- **THEN** it leads to the site's contact route and an email address

#### Scenario: Why something was not found
- **WHEN** a visitor reads the search answer
- **THEN** it explains what the search covers
- **AND** it says that documents which were never text-extracted cannot be searched by their contents

### Requirement: The page SHALL describe the site the visitor is actually on

The two builds publish different material from different sources. The About
page SHALL describe the holdings and provenance of the build serving it, while
answers that hold for both — the operating organisation, the licence, the API,
support — SHALL be stated once and shared.

#### Scenario: Library build
- **GIVEN** the build configured as the library site
- **WHEN** a visitor reads what the site holds
- **THEN** it describes the Arizona Geological Survey's published materials

#### Scenario: Mining build
- **GIVEN** the build configured as the mining site
- **WHEN** a visitor reads what the site holds
- **THEN** it describes the mining material and names where that material came from

#### Scenario: Shared answers are not duplicated per build
- **WHEN** either build renders an answer that is true of both sites
- **THEN** that answer comes from one shared definition rather than a per-build copy
