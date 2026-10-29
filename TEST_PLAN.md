# Pics.io search and filters — test plan

## Scope and reason

Test the search page's collection scope, asset-type filter, URL state, and reset
behaviour. Search is a frequent DAM workflow, and its URL state makes useful
regressions reproducible. Uploading, transcoding, saved searches, authentication,
and team management are out of scope.

## What I observed

- The supplied collection URL opens the `My team library` scope; the trial
  account shows four assets.
- Applying **Type = Video** shows one video and produces URL parameters
  `type=video`, `searchSource=searchbar`, and the collection ID.
- The applied URL omits the original `collectionIdsOperator=oneOf`. Confirm
  with the product team whether that is intentional before treating it as a bug.
- While editing filters, `POST /searches/suggest` is sent; the result search
  does not run until the **Search** button is clicked. Verify the suggest
  payload and distinguish it from the search request when checking network
  behavior.
- A multi-filter URL was observed with two collection IDs and filters for name,
  type, keywords, color, and description:

  ```text
  /search?collectionIds=redacted-id&collectionIds=redacted-id&collectionIdsOperator=oneOf&name=y&nameOperator=equals&type=video&typeOperator=equals&keywords=redacted-id&keywordsOperator=noneOf&color=true&colorOperator=isSet&description=sample-description&descriptionOperator=notEquals&searchSource=searchbar
  ```

  The combined result looked unexpected during exploration, but the expected
  result set and each operator's semantics have not been independently
  confirmed. Treat this as a reproducible investigation, not a confirmed bug.
- Reloading restores the selected filters from the URL query parameters. This
  is expected state restoration; test that the controls and results agree with
  the URL.
- The collection details panel reports **Asset count: 0** while search shows
  four assets. This may count only direct assets; verify expected semantics.

These are observations from the current trial account, not guarantees about
other accounts or environments.

## Coverage and priority

| Priority | Scenarios |
|---|---|
| **P0** | Open search in the selected collection; apply Type = Video and verify the URL and matching result; reload a filtered URL and restore the selected filter; Reset removes the type filter but preserves collection scope. |
| **P1** | Reproduce the multi-filter URL and compare results with agreed filter/operator semantics; verify suggest versus submitted-search requests; special characters; empty results; malformed URL parameters; failed/slow requests; keyboard access and visible focus. |
| **P2** | Less-used filters and operators; mobile layout; Firefox/WebKit and real-device checks; accessibility audit; performance with a larger dataset. |

Prioritise P0 because a wrong result or lost scope affects the core workflow.
Keep P1 exploratory until expected behaviour and stable test data are agreed.

## Automation and tools

The committed, credential-free Playwright tests cover URL serialization,
repeated collection IDs, operator parameters, encoding, and parameter-order
independence. They do **not** exercise the authenticated Pics.io page or prove
the actual result set, request timing, UI restoration, or reset behavior. Keep
those P0/P1 product flows as manual checks until a safe, authorized test account
and stable fixture are available. Keep visual judgement, real mobile devices,
and broad operator combinations manual as well.

Use browser DevTools for request and timing inspection, QASE for cases, and Jira
for confirmed defects. Check that filter editing triggers suggestions without
mistaking them for an applied search; click **Search** and inspect the separate
search request and results. An AI assistant can help brainstorm cases and
review selectors, but verify suggestions against the live product and trace.

## Measures and reporting

- P0 pass rate: 100% for release sign-off.
- Smoke suite: target under 3 minutes; monitor retries and investigate every
  flaky test rather than accepting retries as normal.
- Search latency and requests per action: record a baseline before setting
  regression thresholds. Use a larger dataset for meaningful load conclusions.
- Report tested build, browser, pass/fail by priority, open questions, and
  release risks. Attach a reproducible URL, screenshot, and Playwright trace to
  confirmed defects.
