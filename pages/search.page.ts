import { expect, type Locator, type Page } from "@playwright/test";
import { buildSearchUrl } from "../utils/search-url";

export class SearchPage {
  readonly collectionFilter: Locator;
  readonly typeFilter: Locator;
  readonly videoResult: Locator;
  private readonly typeFilterButton: Locator;

  constructor(
    private readonly page: Page,
    private readonly collectionId: string,
  ) {
    this.collectionFilter = page.getByRole("button", {
      name: "Collection",
      exact: true,
    });
    this.typeFilter = page.getByRole("button", { name: "Video", exact: true });
    this.typeFilterButton = page.getByRole("button", {
      name: "Type",
      exact: true,
    });
    this.videoResult = page.getByRole("img", {
      name: /This video demonstrates the core workflow of Pics\.io/,
    });
  }

  async openCollectionFilters(): Promise<void> {
    await this.gotoSearch([
      ["collectionIds", this.collectionId],
      ["collectionIdsOperator", "oneOf"],
    ]);
    await this.openFilters();
  }

  async openFilters(): Promise<void> {
    await expect(this.collectionFilter).toBeVisible({ timeout: 15_000 });
  }

  async openFilteredSearch(
    parameters: ReadonlyArray<readonly [string, string]>,
  ): Promise<void> {
    await this.gotoSearch(parameters);
  }

  async selectVideoFilter(): Promise<void> {
    await this.typeFilterButton.click();
    await this.page.getByRole("combobox").last().click();
    await this.page.getByRole("option", { name: "Video", exact: true }).click();
  }

  async resetFilters(): Promise<void> {
    await this.page.getByText("Reset filters", { exact: true }).click();
  }

  urlParams(): URLSearchParams {
    return new URL(this.page.url()).searchParams;
  }

  private async gotoSearch(
    parameters: ReadonlyArray<readonly [string, string]>,
  ): Promise<void> {
    await this.page.goto(buildSearchUrl(parameters), {
      waitUntil: "domcontentloaded",
    });
    await expect(this.page).not.toHaveURL(/\/login(?:\?|$)/);
  }
}
