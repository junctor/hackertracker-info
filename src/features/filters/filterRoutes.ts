export type FilterDestination = "schedule" | "content";

export const FILTER_DESTINATION_PARAM = "for";

export function parseFilterDestination(value: string | null): FilterDestination {
  return value === "content" ? "content" : "schedule";
}

function buildConferenceCollectionPath(
  confSlug: string,
  collection: "filters" | FilterDestination,
  params: URLSearchParams,
): string {
  const query = params.toString();
  return `/${encodeURIComponent(confSlug)}/${collection}/${query ? `?${query}` : ""}`;
}

export function buildFilterPath(
  confSlug: string,
  destination: FilterDestination,
  destinationParams: URLSearchParams,
): string {
  const params = new URLSearchParams(destinationParams);
  params.set(FILTER_DESTINATION_PARAM, destination);
  return buildConferenceCollectionPath(confSlug, "filters", params);
}

export function buildFilterDestinationPath(
  confSlug: string,
  destination: FilterDestination,
  filterParams: URLSearchParams,
): string {
  const params = new URLSearchParams(filterParams);
  params.delete(FILTER_DESTINATION_PARAM);
  return buildConferenceCollectionPath(confSlug, destination, params);
}
