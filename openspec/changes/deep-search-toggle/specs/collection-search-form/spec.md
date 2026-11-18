## Purpose

Extends the search form with a control over how far the primary search box
reaches.

## ADDED Requirements

### Requirement: The form SHALL offer a control that widens the search into document contents

The form SHALL carry a switch that widens the primary search box to match the
extracted text of documents in addition to collection metadata. It SHALL be
off by default, and its label SHALL say that it searches inside documents, so
that what it does is legible without the reader running a search to find out.
It SHALL be drawn as a switch rather than a plain checkbox, matching the map's
own extent control, because it changes how the search behaves rather than
filtering on a field.

#### Scenario: Unchecked is today's search
- **GIVEN** the switch is off
- **WHEN** a term is submitted in the primary search box
- **THEN** the request carries no reach parameter
- **AND** the results are what that term returned before this control existed

#### Scenario: Checked widens the search
- **GIVEN** the switch is on
- **WHEN** a term is submitted in the primary search box
- **THEN** the request asks the API for the wider search
- **AND** collections whose documents contain the term are included alongside those whose metadata contains it

#### Scenario: Default state on a fresh visit
- **WHEN** the page is opened with no query string
- **THEN** the switch is off

#### Scenario: The control is visible without expanding the form
- **WHEN** the form is rendered with the advanced filters collapsed
- **THEN** the switch is visible, because it modifies the box above it rather than filtering on a field

#### Scenario: Clearing the form
- **GIVEN** the switch is on
- **WHEN** the reader clears the filters
- **THEN** the checkbox returns to unchecked along with every other field
