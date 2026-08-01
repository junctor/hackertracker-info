import type { ConferenceSlug } from "@/lib/conferences";

import {
  conferenceCollectionPath,
  conferenceMenuPath,
  contentPath,
  organizationPath,
  personPath,
} from "@/lib/routes";

export type UniversalSearchResultType = "content" | "person" | "organization" | "tag";

export type SearchDataItem = {
  contentCount?: number;
  contentIds?: number[];
  id: number;
  norm: string;
  text: string;
  type: UniversalSearchResultType | string;
};

export type UniversalSearchResult = SearchDataItem & {
  matchedTag?: TagSearchResult;
};

export type TagSearchResult = SearchDataItem & {
  contentCount: number;
  contentIds: number[];
  type: "tag";
};

export type SearchResults = {
  tagMatches: TagSearchResult[];
  directMatches: UniversalSearchResult[];
  tagAssociatedContentMatches: UniversalSearchResult[];
  totalCount: number;
};

const TYPE_LABELS: Record<UniversalSearchResultType, string> = {
  content: "Content",
  person: "Person",
  organization: "Organization",
  tag: "Tag",
};

const TYPE_TONES: Record<UniversalSearchResultType, string> = {
  content: "primary",
  person: "secondary",
  organization: "warning",
  tag: "teal",
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
      return contentPath(confSlug, result.id);
    case "person":
      return personPath(confSlug, result.id);
    case "organization":
      return organizationPath(confSlug, result.id);
    case "tag":
      return tagContentHref(confSlug, result.id);
    default:
      return conferenceMenuPath(confSlug);
  }
}

export function buildSearchContentLookup(
  results: readonly SearchDataItem[],
): ReadonlyMap<number, SearchDataItem> {
  const contentById = new Map<number, SearchDataItem>();

  for (const result of results) {
    if (result.type === "content") {
      contentById.set(result.id, result);
    }
  }

  return contentById;
}

export function filterSearchResults(
  results: readonly SearchDataItem[],
  rawQuery: string,
  contentById: ReadonlyMap<number, SearchDataItem> = buildSearchContentLookup(results),
): SearchResults {
  const query = normalizeSearchQuery(rawQuery);
  if (!query) return emptySearchResults();

  const tagMatches: TagSearchResult[] = [];
  const directMatches: UniversalSearchResult[] = [];

  for (const result of results) {
    if (!result.norm.includes(query)) {
      continue;
    }

    if (isTagSearchResult(result)) {
      tagMatches.push(result);
    } else if (result.type !== "tag") {
      directMatches.push(result);
    }
  }

  tagMatches.sort((left, right) => compareSearchResults(left, right, query));
  directMatches.sort((left, right) => compareSearchResults(left, right, query));

  const directContentIds = new Set(
    directMatches.filter((result) => result.type === "content").map((result) => result.id),
  );
  const associatedSeenIds = new Set<number>();
  const tagAssociatedContentMatches: UniversalSearchResult[] = [];

  for (const tag of tagMatches) {
    for (const contentId of tag.contentIds) {
      if (directContentIds.has(contentId) || associatedSeenIds.has(contentId)) {
        continue;
      }

      const content = contentById.get(contentId);
      if (!content) continue;

      associatedSeenIds.add(contentId);
      tagAssociatedContentMatches.push({ ...content, matchedTag: tag });
    }
  }

  return {
    tagMatches,
    directMatches,
    tagAssociatedContentMatches,
    totalCount: tagMatches.length + directMatches.length + tagAssociatedContentMatches.length,
  };
}

function isKnownSearchType(type: string): type is UniversalSearchResultType {
  return type === "content" || type === "person" || type === "organization" || type === "tag";
}

export function tagContentHref(confSlug: ConferenceSlug, tagId: number) {
  const params = new URLSearchParams();
  params.set("tag_group", String(tagId));
  return `${conferenceCollectionPath(confSlug, "content")}?${params.toString()}`;
}

function emptySearchResults(): SearchResults {
  return {
    tagMatches: [],
    directMatches: [],
    tagAssociatedContentMatches: [],
    totalCount: 0,
  };
}

function isTagSearchResult(result: SearchDataItem): result is TagSearchResult {
  return (
    result.type === "tag" &&
    Array.isArray(result.contentIds) &&
    typeof result.contentCount === "number"
  );
}

function compareSearchResults(left: SearchDataItem, right: SearchDataItem, query: string) {
  return (
    searchRank(left, query) - searchRank(right, query) ||
    left.text.localeCompare(right.text) ||
    left.id - right.id
  );
}

function searchRank(result: SearchDataItem, query: string) {
  const isExact = result.norm === query;
  const isPrefix = result.norm.startsWith(query);

  if (result.type === "tag") {
    if (isExact) return 0;
    if (isPrefix) return 1;
    return 2;
  }

  if ((result.type === "person" || result.type === "organization") && isExact) return 3;
  if (result.type === "content" && isExact) return 4;
  if (isPrefix) return 5;
  return 6;
}
