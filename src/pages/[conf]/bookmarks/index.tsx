import type { GetStaticProps } from "next";

import Head from "next/head";
import Link from "next/link";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import useSWR from "swr";

import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import ScheduleEvents, {
  ScheduleDay,
  ScheduleEventViewModel,
} from "@/features/schedule/ScheduleEvents";
import { ConferenceManifest } from "@/lib/conferences";
import { useNowSeconds } from "@/lib/hooks/useNowSeconds";
import { fetcher } from "@/lib/misc";
import { buildConferenceStaticPaths, getConferenceFromParams } from "@/lib/next-static";
import { getBookmarks } from "@/lib/storage";
import {
  EventsByDayIndex,
  EventsStore,
  LocationsStore,
  PeopleStore,
  TagsStore,
} from "@/lib/types/ht-types";
import { PageId } from "@/lib/types/page-meta";

type BookmarksPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

const swrOptions = { revalidateOnFocus: false, revalidateOnReconnect: false };

type EventViewModelContext = {
  eventsStore: EventsStore;
  locationsStore: LocationsStore;
  tagsStore: TagsStore;
  peopleStore: PeopleStore;
  timeFormatter: Intl.DateTimeFormat;
};

function normalizeId(id: unknown): string {
  return String(id);
}

function parseTimestampSeconds(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.floor(value);
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.floor(parsed);
    }
  }

  return null;
}

function parseIsoToTimestampSeconds(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const ms = Date.parse(value);
  if (Number.isNaN(ms)) {
    return null;
  }

  return Math.floor(ms / 1000);
}

function buildEventViewModel(
  eventId: string,
  context: EventViewModelContext,
): ScheduleEventViewModel | null {
  const { eventsStore, locationsStore, tagsStore, peopleStore, timeFormatter } = context;

  const event = eventsStore.byId[eventId];
  if (!event) return null;

  const eventWithMaybeTimestamps = event as typeof event & {
    beginTimestampSeconds?: unknown;
    endTimestampSeconds?: unknown;
  };

  const beginTimestampSeconds =
    parseTimestampSeconds(eventWithMaybeTimestamps.beginTimestampSeconds) ??
    parseIsoToTimestampSeconds(event.beginIso) ??
    parseIsoToTimestampSeconds(event.begin);
  const endTimestampSeconds =
    parseTimestampSeconds(eventWithMaybeTimestamps.endTimestampSeconds) ??
    parseIsoToTimestampSeconds(event.endIso) ??
    parseIsoToTimestampSeconds(event.end);

  if (beginTimestampSeconds === null || endTimestampSeconds === null) {
    return null;
  }

  const beginDate = new Date(beginTimestampSeconds * 1000);
  const endDate = new Date(endTimestampSeconds * 1000);
  const locationName =
    locationsStore.byId[normalizeId(event.locationId)]?.name ?? "Unknown location";

  const tags: ScheduleEventViewModel["tags"] = [];
  for (const eventTagId of event.tagIds ?? []) {
    const eventTag = tagsStore.byId[normalizeId(eventTagId)];
    if (!eventTag) continue;
    tags.push({
      id: eventTag.id,
      label: eventTag.label,
      colorBackground: eventTag.colorBackground,
      colorForeground: eventTag.colorForeground,
    });
  }

  const speakerIds =
    event.speakerIds && event.speakerIds.length > 0 ? event.speakerIds : (event.personIds ?? []);
  const speakers = speakerIds
    .map((id) => peopleStore.byId[normalizeId(id)]?.name)
    .filter((name): name is string => Boolean(name))
    .join(", ");

  return {
    id: event.id,
    title: event.title,
    begin: event.begin,
    end: event.end,
    beginDisplay: timeFormatter.format(beginDate),
    beginIso: beginDate.toISOString(),
    beginTimestampSeconds,
    endDisplay: timeFormatter.format(endDate),
    endIso: endDate.toISOString(),
    endTimestampSeconds,
    color: event.color,
    contentId: event.contentId,
    locationName,
    tags,
    speakers: speakers.length > 0 ? speakers : null,
  };
}

export default function BookmarksPage({ conf, activePageId }: BookmarksPageProps) {
  const nowSeconds = useNowSeconds();
  const {
    data: eventsByDay,
    error: eventsByDayError,
    isLoading: eventsByDayLoading,
  } = useSWR<EventsByDayIndex>(`${conf.dataRoot}/indexes/eventsByDay.json`, fetcher, swrOptions);

  const {
    data: eventsStore,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR<EventsStore>(`${conf.dataRoot}/entities/events.json`, fetcher, swrOptions);

  const {
    data: locationsStore,
    error: locationsError,
    isLoading: locationsLoading,
  } = useSWR<LocationsStore>(`${conf.dataRoot}/entities/locations.json`, fetcher, swrOptions);

  const {
    data: tagsStore,
    error: tagsError,
    isLoading: tagsLoading,
  } = useSWR<TagsStore>(`${conf.dataRoot}/entities/tags.json`, fetcher, swrOptions);

  const {
    data: peopleStore,
    error: peopleError,
    isLoading: peopleLoading,
  } = useSWR<PeopleStore>(`${conf.dataRoot}/entities/people.json`, fetcher, swrOptions);

  const loading =
    eventsByDayLoading || eventsLoading || locationsLoading || tagsLoading || peopleLoading;
  const isError = eventsByDayError || eventsError || locationsError || tagsError || peopleError;

  const [bookmarks, setBookmarks] = useState<string[]>(() => getBookmarks().map(normalizeId));

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncBookmarks = () => {
      setBookmarks(getBookmarks().map(normalizeId));
    };

    window.addEventListener("storage", syncBookmarks);
    window.addEventListener("bookmarks:changed", syncBookmarks);

    return () => {
      window.removeEventListener("storage", syncBookmarks);
      window.removeEventListener("bookmarks:changed", syncBookmarks);
    };
  }, []);

  const bookmarkSet = useMemo(() => new Set(bookmarks.map(normalizeId)), [bookmarks]);

  const scheduleBookmarks = useMemo(() => {
    return bookmarks
      .map((bookmark) => Number(bookmark))
      .filter((bookmark): bookmark is number => Number.isFinite(bookmark));
  }, [bookmarks]);

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: conf.timezone ?? undefined,
      }),
    [conf.timezone],
  );

  const days: ScheduleDay[] = useMemo(() => {
    if (
      !eventsByDay ||
      !eventsStore ||
      !locationsStore ||
      !tagsStore ||
      !peopleStore ||
      bookmarkSet.size === 0
    ) {
      return [];
    }

    const dayKeys = Object.keys(eventsByDay).toSorted((a, b) => a.localeCompare(b));
    const result: ScheduleDay[] = [];
    const eventViewModelContext: EventViewModelContext = {
      eventsStore,
      locationsStore,
      tagsStore,
      peopleStore,
      timeFormatter,
    };

    for (const day of dayKeys) {
      const ids = eventsByDay[day] ?? [];
      const events: ScheduleEventViewModel[] = [];

      for (const eventId of ids) {
        const normalizedEventId = normalizeId(eventId);
        if (!bookmarkSet.has(normalizedEventId)) continue;

        const eventViewModel = buildEventViewModel(normalizedEventId, eventViewModelContext);
        if (eventViewModel) {
          events.push(eventViewModel);
        }
      }

      const sortedEvents = events.toSorted((a, b) => {
        if (a.beginTimestampSeconds !== b.beginTimestampSeconds) {
          return a.beginTimestampSeconds - b.beginTimestampSeconds;
        }
        return a.id - b.id;
      });
      if (sortedEvents.length > 0) {
        result.push({ day, events: sortedEvents });
      }
    }

    return result;
  }, [
    eventsByDay,
    eventsStore,
    locationsStore,
    tagsStore,
    peopleStore,
    bookmarkSet,
    timeFormatter,
  ]);

  const defaultDay = useMemo(() => {
    if (days.length === 0) return null;
    for (const { day, events } of days) {
      for (const event of events) {
        if (event.beginTimestampSeconds <= nowSeconds && nowSeconds <= event.endTimestampSeconds) {
          return day;
        }
      }
    }
    return days[0].day;
  }, [days, nowSeconds]);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const resolvedDay = useMemo(() => {
    if (selectedDay && days.some(({ day }) => day === selectedDay)) {
      return selectedDay;
    }
    return defaultDay;
  }, [defaultDay, days, selectedDay]);

  const handleSelectDay = useCallback((day: string) => {
    setSelectedDay(day);
  }, []);

  if (loading) return <LoadingScreen />;
  if (isError || !eventsByDay || !eventsStore || !locationsStore || !tagsStore || !peopleStore) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Head>
        <title>Bookmarks | {conf.name}</title>
        <meta name="description" content={`${conf.name} schedule for bookmarks`} />
      </Head>
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          <h1 className="ui-heading-1 ui-container mt-6 mb-4 text-center">Bookmarks</h1>
          {bookmarks.length === 0 ? (
            <div className="ui-container ui-empty-state mt-8">
              <p className="text-slate-200">No bookmarks yet.</p>
              <Link
                href={`/${conf.slug}/schedule`}
                className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action focus-visible:outline-none"
              >
                Browse Schedule
              </Link>
            </div>
          ) : days.length > 0 && resolvedDay ? (
            <ScheduleEvents
              conf={conf}
              days={days}
              selectedDay={resolvedDay}
              onSelectDay={handleSelectDay}
              bookmarks={scheduleBookmarks}
              nowSeconds={nowSeconds}
              activeFilter="bookmarks"
            />
          ) : (
            <div className="ui-container ui-empty-state mt-8">
              <p className="text-slate-200">No upcoming events match your saved bookmarks.</p>
              <Link
                href={`/${conf.slug}/schedule`}
                className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action focus-visible:outline-none"
              >
                View Full Schedule
              </Link>
            </div>
          )}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<BookmarksPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "bookmarks" } };
};
