# pics.io-test

## Pics.io search and filter tests

A Playwright/TypeScript suite for Pics.io search, with three browser tests for
filtering and restoring search state. A separate URL unit suite runs locally
and in CI without credentials. Browser tests use a locally configured
collection read-only and require a local signed-in storage-state file.

## Test structure

- `utils/search-url.ts` builds search URLs while preserving repeated keys.
- `tests/search-url.unit.spec.ts` checks URL serialization and round-trip
  semantics.
- `pages/search.page.ts` contains the search page object.
- `tests/fixtures.ts` provides the search page and collection ID.
- `tests/browser/search.spec.ts` contains live search/filter scenarios.

## Requirements

- Node.js 20+

## Install

```powershell
npm install
```

## Run

```powershell
npm run typecheck
npm test
```

## Run browser tests

Create a local storage-state file with the helper. It opens a separate visible
browser for direct sign-in and saves state only after you click its confirmation
button. It does not read or record your password. Do not commit or share the
state file; `.gitignore` excludes the `playwright/.auth` directory.

```powershell
npm run auth:setup
```

Sign in in the opened browser and click “Save signed-in test state” at the
bottom right once the authenticated app is visible.

Set `PICSIO_COLLECTION_ID` in the current PowerShell session to a collection
you can access, then run the browser tests:

```powershell
$env:PLAYWRIGHT_STORAGE_STATE = "playwright\.auth\user.json"
$env:PICSIO_COLLECTION_ID = "<your collection ID>"
npm run test:ui
```

The browser suite fails with a clear setup error if the local state file is
missing. It is intentionally not part of the credential-free default suite or
CI. Open the report with `npm run report`.

## AI assistance

Claude produced the initial test-plan draft. Copilot in VS Code helped condense
the plan and review the test structure. The URL format and filter behavior were
observed in the live Pics.io trial page. The unit tests validate URL
serialization; the browser tests cover the described UI flows when run with
local signed-in state.
