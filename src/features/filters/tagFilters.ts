import type {
  ContentCardsView,
  FilterIndexView,
  ScheduleDayView,
  TagTypesBrowseView,
} from "@/lib/types/ht-types/views";

export type TagId = number;
export type TagGroup = TagId[];
export type TagGroups = TagGroup[];

export const TAG_GROUP_PARAM = "tag_group";

const NUMERIC_TAG_ID = /^\d+$/;
const MAX_TAG_GROUPS = 16;
const MAX_TAGS_PER_GROUP = 128;
const MAX_RAW_GROUP_LENGTH = 2048;

export function parseTagId(value: string): TagId | null {
  if (!NUMERIC_TAG_ID.test(value)) return null;

  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) return null;

  return id;
}

function compareTagGroups(a: TagGroup, b: TagGroup) {
  const length = Math.min(a.length, b.length);

  for (let index = 0; index < length; index += 1) {
    const diff = a[index] - b[index];
    if (diff !== 0) return diff;
  }

  return a.length - b.length;
}

export function normalizeTagGroups(groups: TagGroups): TagGroups {
  const normalized: TagGroups = [];
  const seenGroups = new Set<string>();

  for (const group of groups.slice(0, MAX_TAG_GROUPS)) {
    const ids = Array.from(
      new Set(
        group.filter((id) => Number.isSafeInteger(id) && id > 0).slice(0, MAX_TAGS_PER_GROUP),
      ),
    ).toSorted((a, b) => a - b);

    if (ids.length === 0) continue;

    const key = ids.join(",");
    if (seenGroups.has(key)) continue;

    seenGroups.add(key);
    normalized.push(ids);
  }

  return normalized.toSorted(compareTagGroups);
}

export function parseTagGroups(searchParams: URLSearchParams): TagGroups {
  const parsedGroups: TagGroups = [];

  for (const rawGroup of searchParams.getAll(TAG_GROUP_PARAM).slice(0, MAX_TAG_GROUPS)) {
    if (rawGroup.length === 0 || rawGroup.length > MAX_RAW_GROUP_LENGTH) continue;

    const group: TagGroup = [];
    for (const rawId of rawGroup.split(",").slice(0, MAX_TAGS_PER_GROUP)) {
      const value = rawId.trim();
      if (value.length === 0) continue;

      const id = parseTagId(value);
      if (id !== null) group.push(id);
    }

    parsedGroups.push(group);
  }

  return normalizeTagGroups(parsedGroups);
}

export function serializeTagGroups(current: URLSearchParams, groups: TagGroups): URLSearchParams {
  const next = new URLSearchParams(current);
  next.delete(TAG_GROUP_PARAM);

  for (const group of normalizeTagGroups(groups)) {
    next.append(TAG_GROUP_PARAM, group.join(","));
  }

  return next;
}

export function countSelectedTags(groups: TagGroups): number {
  return normalizeTagGroups(groups).reduce((count, group) => count + group.length, 0);
}

export function flattenTagGroups(groups: TagGroups): TagId[] {
  return Array.from(new Set(normalizeTagGroups(groups).flat())).toSorted((a, b) => a - b);
}

export function getKnownFilterTagIds(tagTypes: TagTypesBrowseView): Set<TagId> {
  const ids = new Set<TagId>();

  for (const tagType of tagTypes) {
    for (const tag of tagType.tags) {
      ids.add(tag.id);
    }
  }

  return ids;
}

export function groupSelectedTagsByType(
  selectedIds: Iterable<TagId>,
  tagTypes: TagTypesBrowseView,
): TagGroups {
  const selected = new Set(selectedIds);
  const groups: TagGroups = [];

  for (const tagType of tagTypes) {
    const group: TagGroup = [];

    for (const tag of tagType.tags) {
      if (selected.has(tag.id)) group.push(tag.id);
    }

    if (group.length > 0) groups.push(group);
  }

  return normalizeTagGroups(groups);
}

export function filterTagGroupsToKnownIds(
  groups: TagGroups,
  tagTypes: TagTypesBrowseView,
): TagGroups {
  const knownIds = getKnownFilterTagIds(tagTypes);
  return groupSelectedTagsByType(
    flattenTagGroups(groups).filter((id) => knownIds.has(id)),
    tagTypes,
  );
}

export function matchingItemIds(
  index: FilterIndexView,
  groups: TagGroups,
): ReadonlySet<number> | null {
  const normalizedGroups = normalizeTagGroups(groups);
  if (normalizedGroups.length === 0) return null;

  let matching: Set<number> | null = null;
  for (const group of normalizedGroups) {
    const groupMatches = new Set<number>();
    for (const tagId of group) {
      for (const itemId of index.itemIdsByTag[String(tagId)] ?? []) {
        groupMatches.add(itemId);
      }
    }

    if (matching === null) {
      matching = groupMatches;
    } else {
      const intersection = new Set<number>();
      for (const itemId of matching as Set<number>) {
        if (groupMatches.has(itemId)) intersection.add(itemId);
      }
      matching = intersection;
    }
    if (matching.size === 0) break;
  }

  return matching ?? new Set<number>();
}

export function countMatchingItems(index: FilterIndexView, groups: TagGroups): number {
  return matchingItemIds(index, groups)?.size ?? index.itemCount;
}

export function filterScheduleDaysByTagGroups(
  days: ScheduleDayView[],
  groups: TagGroups,
  index?: FilterIndexView,
): ScheduleDayView[] {
  const normalizedGroups = normalizeTagGroups(groups);
  if (normalizedGroups.length === 0) return days.map(({ day, sessions }) => ({ day, sessions }));
  if (!index) return [];

  const ids = matchingItemIds(index, normalizedGroups);

  return days
    .map(({ day, sessions }) => ({
      day,
      sessions: sessions.filter((session) => ids?.has(session.id)),
    }))
    .filter(({ sessions }) => sessions.length > 0);
}

export function filterContentByTagGroups(
  content: ContentCardsView,
  groups: TagGroups,
  index?: FilterIndexView,
): ContentCardsView {
  const normalizedGroups = normalizeTagGroups(groups);
  if (normalizedGroups.length === 0) return content;
  if (!index) return [];

  const ids = matchingItemIds(index, normalizedGroups);
  return content.filter((item) => ids?.has(item.id));
}

export function getUnavailableTagIds(
  tagTypes: TagTypesBrowseView,
  selectedIds: ReadonlySet<TagId>,
  countMatches: (groups: TagGroups) => number,
): Set<TagId> {
  const unavailable = new Set<TagId>();

  for (const tagType of tagTypes) {
    for (const tag of tagType.tags) {
      if (selectedIds.has(tag.id)) continue;

      const candidateIds = new Set(selectedIds);
      candidateIds.add(tag.id);

      if (countMatches(groupSelectedTagsByType(candidateIds, tagTypes)) === 0) {
        unavailable.add(tag.id);
      }
    }
  }

  return unavailable;
}
