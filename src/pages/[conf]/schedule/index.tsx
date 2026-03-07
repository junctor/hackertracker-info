import type { GetStaticProps } from "next";

import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo, useCallback } from "react";
import useSWR from "swr";

import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import ScheduleEvents, { ScheduleEventViewModel } from "@/features/schedule/ScheduleEvents";
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

type SchedulePageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

type ScheduleDay = {
  day: string;
  events: ScheduleEventViewModel[];
};

const swrOptions = { revalidateOnFocus: false, revalidateOnReconnect: false };

export default function SchedulePage({ conf, activePageId }: SchedulePageProps) {
  const router = useRouter();
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

  const bookmarks = useMemo(() => getBookmarks(), []);

  const days: ScheduleDay[] = useMemo(() => {
    if (!eventsByDay || !eventsStore || !locationsStore || !tagsStore || !peopleStore) {
      return [];
    }

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
        const event = eventsStore.byId[eventId];
        if (!event) continue;

        const locationName = locationsStore.byId[event.locationId]?.name ?? "Unknown location";

        const tags: ScheduleEventViewModel["tags"] = [];
        for (const tagId of event.tagIds ?? []) {
          const tag = tagsStore.byId[tagId];
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
          .map((id) => peopleStore.byId[id]?.name)
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
          beginTimestampSeconds: Math.floor(beginDate.getTime() / 1000),
          endDisplay: timeFormatter.format(endDate),
          endIso: endDate.toISOString(),
          endTimestampSeconds: Math.floor(endDate.getTime() / 1000),
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
  }, [conf.timezone, eventsByDay, eventsStore, locationsStore, tagsStore, peopleStore]);

  const daySet = useMemo(() => new Set(days.map((d) => d.day)), [days]);

  const defaultDay = useMemo(() => {
    // Pick in-progress day first, then fall back to earliest day.
    if (days.length === 0) return null;

    for (const { day, events } of days) {
      for (const event of events) {
        const begin = event.beginTimestampSeconds;
        const end = event.endTimestampSeconds;
        if (
          Number.isFinite(begin) &&
          Number.isFinite(end) &&
          begin <= nowSeconds &&
          nowSeconds <= end
        ) {
          return day;
        }
      }
    }

    return days[0].day;
  }, [days, nowSeconds]);

  const dayParam = useMemo(() => {
    if (!router.isReady) return null;
    const raw = router.query.day;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return typeof value === "string" ? value : null;
  }, [router.isReady, router.query.day]);

  const resolvedDay = useMemo(() => {
    if (dayParam && daySet.has(dayParam)) {
      return dayParam;
    }
    return defaultDay ?? "";
  }, [dayParam, daySet, defaultDay]);

  const handleSelectDay = useCallback(
    (day: string) => {
      if (!router.isReady) return;

      router.push({ pathname: router.pathname, query: { ...router.query, day } }, undefined, {
        shallow: true,
      });
    },
    [router],
  );

  const isLoading =
    eventsByDayLoading || eventsLoading || locationsLoading || tagsLoading || peopleLoading;

  const error = eventsByDayError || eventsError || locationsError || tagsError || peopleError;

  if (isLoading) return <LoadingScreen />;
  if (error || !eventsByDay || !eventsStore || !locationsStore || !tagsStore || !peopleStore) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Head>
        <title>Schedule | {conf.name}</title>
        <meta
          name="description"
          content={`Full ${conf.name} schedule of sessions, talks, and events.`}
        />
      </Head>
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          <h1 className="sr-only">Schedule</h1>
          <ScheduleEvents
            conf={conf}
            days={days}
            selectedDay={resolvedDay}
            onSelectDay={handleSelectDay}
            bookmarks={bookmarks}
            nowSeconds={nowSeconds}
          />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<SchedulePageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "schedule" } };
};
