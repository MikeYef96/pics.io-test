import { expect, test } from "../fixtures";

test("filters the selected collection to video assets", async ({
  collectionId,
  searchPage,
}) => {
  await searchPage.openCollectionFilters();
  await expect(searchPage.collectionFilter).toBeVisible();
  await searchPage.selectVideoFilter();

  await expect
    .poll(() => searchPage.urlParams().get("type"))
    .toBe("video");
  expect(searchPage.urlParams().get("collectionIds")).toBe(collectionId);
  expect(searchPage.urlParams().get("searchSource")).toBe("searchbar");
  await expect(searchPage.videoResult).toBeVisible();
});

test("restores a video filter from the URL and resets it", async ({
  collectionId,
  searchPage,
}) => {
  await searchPage.openFilteredSearch([
    ["type", "video"],
    ["searchSource", "searchbar"],
    ["collectionIds", collectionId],
  ]);
  await searchPage.openFilters();
  await expect(searchPage.typeFilter).toBeVisible();

  await searchPage.resetFilters();
  await expect
    .poll(() => searchPage.urlParams().get("type"))
    .toBeNull();
  expect(searchPage.urlParams().get("collectionIds")).toBe(collectionId);
});

test("restores multi-filter URL state and selected type after reload", async ({
  page,
  collectionId,
  searchPage,
}) => {
  const query = [
    ["collectionIds", collectionId],
    ["collectionIdsOperator", "oneOf"],
    ["name", "y"],
    ["nameOperator", "equals"],
    ["type", "video"],
    ["typeOperator", "equals"],
    ["color", "true"],
    ["colorOperator", "isSet"],
    ["description", "sample-description"],
    ["descriptionOperator", "notEquals"],
    ["searchSource", "searchbar"],
  ] as const;

  await searchPage.openFilteredSearch(query);
  await page.reload({ waitUntil: "domcontentloaded" });

  await expect
    .poll(() => searchPage.urlParams().getAll("collectionIds"))
    .toEqual([collectionId]);
  expect(searchPage.urlParams().get("colorOperator")).toBe("isSet");
  expect(searchPage.urlParams().get("descriptionOperator")).toBe("notEquals");

  await searchPage.openFilters();
  await expect(searchPage.typeFilter).toBeVisible();
});
