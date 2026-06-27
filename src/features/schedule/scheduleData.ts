import type { ConferenceManifest } from "@/lib/conferences";
import type {
  ContentStore,
  LocationsStore,
  PeopleStore,
  TagsStore,
  SessionsByDayIndex,
  SessionsStore,
} from "@/lib/types/ht-types";

import type { ScheduleDay, ScheduleSessionViewModel } from "./ScheduleSessions";

type ScheduleSources = {
  sessionsByDay: SessionsByDayIndex;
  sessionsStore: SessionsStore;
  locationsStore: LocationsStore;
  tagsStore: TagsStore;
  peopleStore?: PeopleStore | null;
  contentStore?: ContentStore | null;
};

type ScheduleCacheEntry = ScheduleSources & {
  timezone: string;
  days: ScheduleDay[];
};

const scheduleDaysCache = new Map<string, ScheduleCacheEntry>();

function normalizeId(id: unknown): string {
  return String(id);
}

function toTimestampSeconds(value: string): number {
  return Math.floor(new Date(value).getTime() / 1000);
}

function buildScheduleDays(conf: ConferenceManifest, sources: ScheduleSources): ScheduleDay[] {
  const { sessionsByDay, sessionsStore, locationsStore, tagsStore, peopleStore, contentStore } =
    sources;
  const dayKeys = Object.keys(sessionsByDay).toSorted();
  const result: ScheduleDay[] = [];
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: conf.timezone,
  });

  for (const day of dayKeys) {
    const ids = sessionsByDay[day] ?? [];
    const sessions: ScheduleSessionViewModel[] = [];

    for (const sessionId of ids) {
      const session = sessionsStore.byId[normalizeId(sessionId)];
      if (!session) continue;

      const locationName =
        locationsStore.byId[normalizeId(session.locationId)]?.name ?? "Unknown location";

      const tags: ScheduleSessionViewModel["tags"] = [];
      for (const tagId of session.tagIds ?? []) {
        const tag = tagsStore.byId[normalizeId(tagId)];
        if (!tag) continue;
        tags.push({
          id: tag.id,
          label: tag.label,
          colorBackground: tag.colorBackground,
          colorForeground: tag.colorForeground,
        });
      }

      const speakers = peopleStore
        ? (session.personIds ?? [])
            .map((id) => peopleStore.byId[normalizeId(id)]?.name)
            .filter((name): name is string => Boolean(name))
            .join(", ")
        : "";

      const beginDate = new Date(session.begin);
      const endDate = new Date(session.end);
      const contentEntity = contentStore?.byId[normalizeId(session.contentId)] ?? null;
      const color = session.color || contentEntity?.color || tags[0]?.colorBackground || "";

      sessions.push({
        id: session.id,
        title: session.title,
        begin: session.begin,
        end: session.end,
        beginDisplay: timeFormatter.format(beginDate),
        beginIso: beginDate.toISOString(),
        beginTimestampSeconds: toTimestampSeconds(session.begin),
        endDisplay: timeFormatter.format(endDate),
        endIso: endDate.toISOString(),
        endTimestampSeconds: toTimestampSeconds(session.end),
        color,
        contentId: session.contentId,
        contentEntity,
        session: session,
        locationName,
        tags,
        speakers: speakers.length > 0 ? speakers : null,
      });
    }

    result.push({ day, sessions });
  }

  return result;
}

export function getScheduleDaysFromStores(
  conf: ConferenceManifest,
  sources: ScheduleSources,
): ScheduleDay[] {
  const cached = scheduleDaysCache.get(conf.code);
  if (
    cached &&
    cached.timezone === conf.timezone &&
    cached.sessionsByDay === sources.sessionsByDay &&
    cached.sessionsStore === sources.sessionsStore &&
    cached.locationsStore === sources.locationsStore &&
    cached.tagsStore === sources.tagsStore &&
    cached.peopleStore === sources.peopleStore &&
    cached.contentStore === sources.contentStore
  ) {
    return cached.days;
  }

  const days = buildScheduleDays(conf, sources);
  scheduleDaysCache.set(conf.code, { ...sources, timezone: conf.timezone, days });
  return days;
}

export function filterScheduleDaysByBookmarks(
  days: readonly ScheduleDay[],
  bookmarkIds: ReadonlySet<string>,
): ScheduleDay[] {
  if (bookmarkIds.size === 0) return [];

  const result: ScheduleDay[] = [];
  for (const { day, sessions } of days) {
    const filtered = sessions.filter((session) => bookmarkIds.has(String(session.id)));
    if (filtered.length > 0) result.push({ day, sessions: filtered });
  }
  return result;
}
