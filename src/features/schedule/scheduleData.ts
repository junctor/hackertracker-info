import type { ConferenceManifest } from "@/lib/conferences";
import type {
  EventsByDayIndex,
  EventsStore,
  LocationsStore,
  PeopleStore,
  TagsStore,
} from "@/lib/types/ht-types";

import type { ScheduleDay, ScheduleEventViewModel } from "./ScheduleEvents";

type ScheduleSources = {
  eventsByDay: EventsByDayIndex;
  eventsStore: EventsStore;
  locationsStore: LocationsStore;
  tagsStore: TagsStore;
  peopleStore: PeopleStore;
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
  const { eventsByDay, eventsStore, locationsStore, tagsStore, peopleStore } = sources;
  const dayKeys = Object.keys(eventsByDay).toSorted();
  const result: ScheduleDay[] = [];
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: conf.timezone,
  });

  for (const day of dayKeys) {
    const ids = eventsByDay[day] ?? [];
    const events: ScheduleEventViewModel[] = [];

    for (const eventId of ids) {
      const event = eventsStore.byId[normalizeId(eventId)];
      if (!event) continue;

      const locationName =
        locationsStore.byId[normalizeId(event.locationId)]?.name ?? "Unknown location";

      const tags: ScheduleEventViewModel["tags"] = [];
      for (const tagId of event.tagIds ?? []) {
        const tag = tagsStore.byId[normalizeId(tagId)];
        if (!tag) continue;
        tags.push({
          id: tag.id,
          label: tag.label,
          colorBackground: tag.colorBackground,
          colorForeground: tag.colorForeground,
        });
      }

      const speakerIds =
        event.speakerIds && event.speakerIds.length > 0
          ? event.speakerIds
          : (event.personIds ?? []);

      const speakers = speakerIds
        .map((id) => peopleStore.byId[normalizeId(id)]?.name)
        .filter((name): name is string => Boolean(name))
        .join(", ");

      const beginDate = new Date(event.begin);
      const endDate = new Date(event.end);

      events.push({
        id: event.id,
        title: event.title,
        begin: event.begin,
        end: event.end,
        beginDisplay: timeFormatter.format(beginDate),
        beginIso: beginDate.toISOString(),
        beginTimestampSeconds: toTimestampSeconds(event.begin),
        endDisplay: timeFormatter.format(endDate),
        endIso: endDate.toISOString(),
        endTimestampSeconds: toTimestampSeconds(event.end),
        color: event.color,
        contentId: event.contentId,
        locationName,
        tags,
        speakers: speakers.length > 0 ? speakers : null,
      });
    }

    result.push({ day, events });
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
    cached.eventsByDay === sources.eventsByDay &&
    cached.eventsStore === sources.eventsStore &&
    cached.locationsStore === sources.locationsStore &&
    cached.tagsStore === sources.tagsStore &&
    cached.peopleStore === sources.peopleStore
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
  for (const { day, events } of days) {
    const filtered = events.filter((event) => bookmarkIds.has(String(event.id)));
    if (filtered.length > 0) result.push({ day, events: filtered });
  }
  return result;
}
