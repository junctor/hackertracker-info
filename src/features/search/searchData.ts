import type { ConferenceSlug } from "@/lib/conferences";

export type UniversalSearchResultType = "content" | "person" | "organization";

export type UniversalSearchResult = {
  id: number;
  norm: string;
  text: string;
  type: UniversalSearchResultType | string;
};

const TYPE_LABELS: Record<UniversalSearchResultType, string> = {
  content: "Content",
  person: "Person",
  organization: "Organization",
};

const TYPE_TONES: Record<UniversalSearchResultType, string> = {
  content: "primary",
  person: "secondary",
  organization: "warning",
};

export function normalizeSearchQuery(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getSearchResultLabel(type: string): string {
  if (isKnownSearchType(type)) return TYPE_LABELS[type];

  const normalized = type.trim().replace(/[_-]+/g, " ");
  if (!normalized) return "Unknown";
  return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getSearchResultTone(type: string): string {
  return isKnownSearchType(type) ? TYPE_TONES[type] : "critical";
}

export function getSearchResultHref(confSlug: ConferenceSlug, result: UniversalSearchResult) {
  switch (result.type) {
    case "content":
      return `/${confSlug}/content/?id=${result.id}`;
    case "person":
      return `/${confSlug}/people/?id=${result.id}`;
    case "organization":
      return `/${confSlug}/organization/?id=${result.id}`;
    default:
      return `/${confSlug}`;
  }
}

export function filterSearchResults(
  results: UniversalSearchResult[],
  rawQuery: string,
): UniversalSearchResult[] {
  const query = normalizeSearchQuery(rawQuery);
  if (!query) return [];

  return results.filter((result) => result.norm.includes(query));
}

function isKnownSearchType(type: string): type is UniversalSearchResultType {
  return type === "content" || type === "person" || type === "organization";
}
