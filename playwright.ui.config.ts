import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";

const storageState = process.env.PLAYWRIGHT_STORAGE_STATE;

if (!storageState || !existsSync(storageState)) {
  throw new Error(
    "Set PLAYWRIGHT_STORAGE_STATE to a valid local Playwright storage-state file. See README.md.",
  );
}

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report/ui", open: "never" }],
  ],
  use: {
    baseURL: "https://pics.io",
    storageState,
    browserName: "chromium",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
