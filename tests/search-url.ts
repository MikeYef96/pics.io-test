export function buildSearchUrl(
  parameters: ReadonlyArray<readonly [string, string]>,
): string {
  const query = new URLSearchParams();
  for (const [key, value] of parameters) {
    query.append(key, value);
  }
  return `/search?${query}`;
}
