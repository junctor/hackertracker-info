import type {
  ContentCardsView,
  ScheduleDayView,
  ScheduleSessionViewModel,
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

function tagIdsMatchNormalizedGroups(
  ids: ReadonlySet<TagId>,
  normalizedGroups: TagGroups,
): boolean {
  if (normalizedGroups.length === 0) return true;

  return normalizedGroups.every((group) => group.some((tagId) => ids.has(tagId)));
}

function sessionTagIds(session: ScheduleSessionViewModel): Set<TagId> {
  const ids =
    session.session.tagIds.length > 0 ? session.session.tagIds : session.tags.map((tag) => tag.id);
  return new Set(ids);
}

function sessionMatchesNormalizedTagGroups(
  session: ScheduleSessionViewModel,
  normalizedGroups: TagGroups,
): boolean {
  return tagIdsMatchNormalizedGroups(sessionTagIds(session), normalizedGroups);
}

export function sessionMatchesTagGroups(
  session: ScheduleSessionViewModel,
  groups: TagGroups,
): boolean {
  return sessionMatchesNormalizedTagGroups(session, normalizeTagGroups(groups));
}

export function filterScheduleDaysByTagGroups(
  days: ScheduleDayView[],
  groups: TagGroups,
): ScheduleDayView[] {
  const normalizedGroups = normalizeTagGroups(groups);
  if (normalizedGroups.length === 0) return days.map(({ day, sessions }) => ({ day, sessions }));

  return days
    .map(({ day, sessions }) => ({
      day,
      sessions: sessions.filter((session) =>
        sessionMatchesNormalizedTagGroups(session, normalizedGroups),
      ),
    }))
    .filter(({ sessions }) => sessions.length > 0);
}

export function countMatchingSessions(days: ScheduleDayView[], groups: TagGroups): number {
  const normalizedGroups = normalizeTagGroups(groups);
  if (normalizedGroups.length === 0) {
    return days.reduce((count, day) => count + day.sessions.length, 0);
  }

  let count = 0;

  for (const { sessions } of days) {
    for (const session of sessions) {
      if (sessionMatchesNormalizedTagGroups(session, normalizedGroups)) count += 1;
    }
  }

  return count;
}

export function filterContentByTagGroups(
  content: ContentCardsView,
  groups: TagGroups,
): ContentCardsView {
  const normalizedGroups = normalizeTagGroups(groups);
  if (normalizedGroups.length === 0) return content;

  return content.filter((item) =>
    tagIdsMatchNormalizedGroups(new Set(item.tags.map((tag) => tag.id)), normalizedGroups),
  );
}

export function countMatchingContent(content: ContentCardsView, groups: TagGroups): number {
  const normalizedGroups = normalizeTagGroups(groups);
  if (normalizedGroups.length === 0) return content.length;

  let count = 0;

  for (const item of content) {
    if (tagIdsMatchNormalizedGroups(new Set(item.tags.map((tag) => tag.id)), normalizedGroups)) {
      count += 1;
    }
  }

  return count;
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
