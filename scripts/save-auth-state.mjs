import { mkdir, access, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { chromium } from "@playwright/test";

const statePath = resolve("playwright/.auth/user.json");

try {
  await access(statePath);
  throw new Error(
    `Refusing to overwrite existing auth state: ${statePath}. Move it aside or remove it first if you intend to replace it.`,
  );
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();

try {
  const page = await context.newPage();
  await context.addInitScript(() => {
    const addConfirmationButton = () => {
      if (!document.body || document.querySelector("#playwright-auth-state-confirm")) {
        return;
      }

      const button = document.createElement("button");
      button.id = "playwright-auth-state-confirm";
      button.type = "button";
      button.textContent = "Save signed-in test state";
      button.style.cssText =
        "position:fixed;right:16px;bottom:16px;z-index:2147483647;padding:12px;background:#1f2937;color:white;border:2px solid white;border-radius:6px;cursor:pointer";
      button.addEventListener("click", () => {
        button.setAttribute("data-confirmed", "true");
      });
      document.body.append(button);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", addConfirmationButton, {
        once: true,
      });
    } else {
      addConfirmationButton();
    }
  });
  await page.goto("https://pics.io/search", { waitUntil: "domcontentloaded" });
  console.log(
    "Sign in in this separate Playwright Chromium window, then click “Save signed-in test state” at the bottom right. The existing VS Code browser tab is separate. Your password is not read or recorded.",
  );
  await page
    .locator("#playwright-auth-state-confirm[data-confirmed='true']")
    .waitFor({ state: "visible", timeout: 10 * 60 * 1000 });

  const currentUrl = new URL(page.url());
  if (
    currentUrl.origin !== "https://pics.io" ||
    /^\/(login|signup|forgot)(\/|$)/i.test(currentUrl.pathname)
  ) {
    throw new Error(
      `The browser is not on an authenticated Pics.io page (${currentUrl.origin}${currentUrl.pathname}). No state was saved.`,
    );
  }

  await mkdir(dirname(statePath), { recursive: true });
  const state = await context.storageState();
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, {
    flag: "wx",
    mode: 0o600,
  });
  console.log(`Saved local Playwright state to ${statePath}`);
  console.log("The file is git-ignored; do not share or commit it.");
} finally {
  await context.close();
  await browser.close();
}
