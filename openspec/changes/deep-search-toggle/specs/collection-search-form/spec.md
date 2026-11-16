## Purpose

Extends the search form with a control over how far the primary search box
reaches.

## ADDED Requirements

### Requirement: The form SHALL offer a control that widens the search into document contents

The form SHALL carry a checkbox that widens the primary search box to match
the extracted text of documents in addition to collection metadata. It SHALL
be unchecked by default, and its label SHALL say that it searches inside
documents, so that what it does is legible without the reader running a search
to find out.

#### Scenario: Unchecked is today's search
- **GIVEN** the checkbox is unchecked
- **WHEN** a term is submitted in the primary search box
- **THEN** the request carries no reach parameter
- **AND** the results are what that term returned before this control existed

#### Scenario: Checked widens the search
- **GIVEN** the checkbox is checked
- **WHEN** a term is submitted in the primary search box
- **THEN** the request asks the API for the wider search
- **AND** collections whose documents contain the term are included alongside those whose metadata contains it

#### Scenario: Default state on a fresh visit
- **WHEN** the page is opened with no query string
- **THEN** the checkbox is unchecked

#### Scenario: The control is visible without expanding the form
- **WHEN** the form is rendered with the advanced filters collapsed
- **THEN** the checkbox is visible, because it modifies the box above it rather than filtering on a field

#### Scenario: Clearing the form
- **GIVEN** the checkbox is checked
- **WHEN** the reader clears the filters
- **THEN** the checkbox returns to unchecked along with every other field
