import type { GetStaticProps } from "next";

import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo, useCallback } from "react";

import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import { getScheduleDaysFromStores } from "@/features/schedule/scheduleData";
import ScheduleEvents from "@/features/schedule/ScheduleEvents";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { useNowSeconds } from "@/lib/hooks/useNowSeconds";
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

export default function SchedulePage({ conf, activePageId }: SchedulePageProps) {
  const router = useRouter();
  const nowSeconds = useNowSeconds();

  const {
    data: eventsByDay,
    error: eventsByDayError,
    isLoading: eventsByDayLoading,
  } = useConferenceJson<EventsByDayIndex>(conf, "indexes/eventsByDay.json");

  const {
    data: eventsStore,
    error: eventsError,
    isLoading: eventsLoading,
  } = useConferenceJson<EventsStore>(conf, "entities/events.json");

  const {
    data: locationsStore,
    error: locationsError,
    isLoading: locationsLoading,
  } = useConferenceJson<LocationsStore>(conf, "entities/locations.json");

  const {
    data: tagsStore,
    error: tagsError,
    isLoading: tagsLoading,
  } = useConferenceJson<TagsStore>(conf, "entities/tags.json");

  const {
    data: peopleStore,
    error: peopleError,
    isLoading: peopleLoading,
  } = useConferenceJson<PeopleStore>(conf, "entities/people.json");

  const bookmarks = useMemo(() => getBookmarks(), []);

  const days = useMemo(() => {
    if (!eventsByDay || !eventsStore || !locationsStore || !tagsStore || !peopleStore) {
      return [];
    }
    return getScheduleDaysFromStores(conf, {
      eventsByDay,
      eventsStore,
      locationsStore,
      tagsStore,
      peopleStore,
    });
  }, [conf, eventsByDay, eventsStore, locationsStore, tagsStore, peopleStore]);

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
