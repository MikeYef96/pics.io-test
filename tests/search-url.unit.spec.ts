import { expect, test } from "@playwright/test";
import { buildSearchUrl } from "./search-url";

const multiFilterParameters = [
  ["collectionIds", "redacted-id"],
  ["collectionIds", "redacted-id"],
  ["collectionIdsOperator", "oneOf"],
  ["name", "y"],
  ["nameOperator", "equals"],
  ["type", "video"],
  ["typeOperator", "equals"],
  ["keywords", "redacted-id"],
  ["keywordsOperator", "noneOf"],
  ["color", "true"],
  ["colorOperator", "isSet"],
  ["description", "sample-description"],
  ["descriptionOperator", "notEquals"],
  ["searchSource", "searchbar"],
] as const;

function getParams(url: string): URLSearchParams {
  return new URL(`https://pics.io${url}`).searchParams;
}

function semanticParams(params: URLSearchParams): Record<string, string[]> {
  return Object.fromEntries(
    [...new Set([...params.keys()])]
      .sort()
      .map((key) => [key, params.getAll(key)]),
  );
}

test("round-trips the reported multi-filter search state", () => {
  const params = getParams(buildSearchUrl(multiFilterParameters));

  expect(params.getAll("collectionIds")).toEqual([
    "redacted-id",
    "redacted-id",
  ]);
  expect(params.get("collectionIdsOperator")).toBe("oneOf");
  expect(params.get("name")).toBe("y");
  expect(params.get("nameOperator")).toBe("equals");
  expect(params.get("type")).toBe("video");
  expect(params.get("typeOperator")).toBe("equals");
  expect(params.get("keywords")).toBe("redacted-id");
  expect(params.get("keywordsOperator")).toBe("noneOf");
  expect(params.get("color")).toBe("true");
  expect(params.get("colorOperator")).toBe("isSet");
  expect(params.get("description")).toBe("sample-description");
  expect(params.get("descriptionOperator")).toBe("notEquals");
  expect(params.get("searchSource")).toBe("searchbar");
});

test("compares restored search state independent of query parameter order", () => {
  const original = getParams(buildSearchUrl(multiFilterParameters));
  const reorderedParameters = [...multiFilterParameters].sort(
    ([left], [right]) => right.localeCompare(left),
  );
  const reordered = getParams(buildSearchUrl(reorderedParameters));

  expect(semanticParams(reordered)).toEqual(semanticParams(original));
});

test("URL-encodes special characters and preserves repeated query keys", () => {
  const url = buildSearchUrl([
    ["collectionIds", "collection-a"],
    ["collectionIds", "collection-b"],
    ["description", `quotes & + # % emoji 🌄`],
    ["descriptionOperator", "notEquals"],
  ]);
  const params = getParams(url);

  expect(params.get("description")).toBe("quotes & + # % emoji 🌄");
  expect(params.getAll("collectionIds")).toEqual([
    "collection-a",
    "collection-b",
  ]);
});
