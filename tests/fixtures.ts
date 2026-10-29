import { test as base, expect } from "@playwright/test";
import { SearchPage } from "../pages/search.page";

type SearchFixtures = {
  collectionId: string;
  searchPage: SearchPage;
};

export const test = base.extend<SearchFixtures>({
  collectionId: async ({}, use) => {
    const collectionId = process.env.PICSIO_COLLECTION_ID;
    if (!collectionId) {
      throw new Error(
        "Set PICSIO_COLLECTION_ID to a collection ID you can access before running browser tests.",
      );
    }
    await use(collectionId);
  },

  searchPage: async ({ page, collectionId }, use) => {
    await use(new SearchPage(page, collectionId));
  },
});

export { expect };
