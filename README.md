# pics.io-test

## Pics.io search URL tests

A small Playwright/TypeScript suite that safely checks search URL state
serialization locally. It covers repeated collection IDs, filter/operator
pairs, parameter-order-independent comparisons, and URL encoding. These tests
do not make network requests or verify Pics.io's live UI, filtering results,
suggestion API, or reload behavior.

See [TEST_PLAN.md](./TEST_PLAN.md) for scope, priorities, and the exploratory
coverage to follow up manually.

## Test structure

- `tests/search-url.ts` builds search URLs while preserving repeated keys.
- `tests/search-url.unit.spec.ts` checks URL serialization and round-trip
  semantics.

## Requirements

- Node.js 20+

## Install

```powershell
npm install
```

## Run

No account, browser installation, credentials, or environment variables are
needed:

```powershell
npm run typecheck
npm test
```

Open the HTML report with `npm run report`.

The GitHub Actions workflow runs the same local checks on pushes, pull requests,
and manual dispatch. The live Pics.io flows listed in the plan remain manual;
no credentials or private assets are required by this repository.

## AI assistance

Claude produced the initial test-plan draft. Copilot in VS Code helped condense
the plan and scaffold/review the URL test structure. The URL format and
multi-filter example were observed in the live Pics.io trial page; these local
tests validate serialization only, not the site's server-side results.
