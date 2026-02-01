// src/pages/schedule/index.tsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import Head from "next/head";
import { useRouter } from "next/router";
import type { GetStaticProps } from "next";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import ScheduleEvents, {
  ScheduleEventViewModel,
} from "@/features/schedule/ScheduleEvents";
import { getBookmarks } from "@/lib/storage";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import { PageId } from "@/lib/types/page-meta";
import {
  EventsByDayIndex,
  EventsStore,
  LocationsStore,
  PeopleStore,
  TagsStore,
} from "@/lib/types/ht-types";

type SchedulePageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

type ScheduleDay = {
  day: string;
  events: ScheduleEventViewModel[];
};

const swrOptions = { revalidateOnFocus: false, revalidateOnReconnect: false };

export default function SchedulePage({
  conf,
  activePageId,
}: SchedulePageProps) {
  const router = useRouter();

  const {
    data: eventsByDay,
    error: eventsByDayError,
    isLoading: eventsByDayLoading,
  } = useSWR<EventsByDayIndex>(
    `${conf.dataRoot}/indexes/eventsByDay.json`,
    fetcher,
    swrOptions,
  );

  const {
    data: eventsStore,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR<EventsStore>(
    `${conf.dataRoot}/entities/events.json`,
    fetcher,
    swrOptions,
  );

  const {
    data: locationsStore,
    error: locationsError,
    isLoading: locationsLoading,
  } = useSWR<LocationsStore>(
    `${conf.dataRoot}/entities/locations.json`,
    fetcher,
    swrOptions,
  );

  const {
    data: tagsStore,
    error: tagsError,
    isLoading: tagsLoading,
  } = useSWR<TagsStore>(
    `${conf.dataRoot}/entities/tags.json`,
    fetcher,
    swrOptions,
  );

  const {
    data: peopleStore,
    error: peopleError,
    isLoading: peopleLoading,
  } = useSWR<PeopleStore>(
    `${conf.dataRoot}/entities/people.json`,
    fetcher,
    swrOptions,
  );

  const bookmarks = useMemo(() => getBookmarks(), []);

  const days: ScheduleDay[] = useMemo(() => {
    if (
      !eventsByDay ||
      !eventsStore ||
      !locationsStore ||
      !tagsStore ||
      !peopleStore
    ) {
      return [];
    }

    return Object.keys(eventsByDay)
      .sort()
      .map((day) => {
        const events = (eventsByDay[day] ?? [])
          .map((eventId) => eventsStore.byId[eventId])
          .filter((event): event is NonNullable<typeof event> => Boolean(event))
          .map((event) => {
            const locationName =
              locationsStore.byId[event.locationId]?.name ?? "Unknown location";
            const tagModels = event.tagIds
              .map((tagId) => tagsStore.byId[tagId])
              .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag))
              .map((tag) => ({
                id: tag.id,
                label: tag.label,
                colorBackground: tag.colorBackground,
                colorForeground: tag.colorForeground,
              }));

            const speakerIds =
              event.speakerIds && event.speakerIds.length > 0
                ? event.speakerIds
                : (event.personIds ?? []);
            const speakers = speakerIds
              .map((id) => peopleStore.byId[id]?.name)
              .filter((name): name is string => Boolean(name))
              .join(", ");

            return {
              id: event.id,
              title: event.title,
              begin: event.begin,
              end: event.end,
              beginTimestampSeconds: event.beginTimestampSeconds,
              endTimestampSeconds: event.endTimestampSeconds,
              color: event.color,
              contentId: event.contentId,
              locationName,
              tags: tagModels,
              speakers: speakers.length > 0 ? speakers : null,
            } satisfies ScheduleEventViewModel;
          })
          .sort((a, b) => {
            if (a.beginTimestampSeconds !== b.beginTimestampSeconds) {
              return a.beginTimestampSeconds - b.beginTimestampSeconds;
            }
            return a.title.localeCompare(b.title);
          });

        return { day, events };
      });
  }, [eventsByDay, eventsStore, locationsStore, tagsStore, peopleStore]);

  const defaultDay = useMemo(() => {
    // Pick in-progress day first, then fall back to the earliest day.
    if (days.length === 0) return null;
    const nowSeconds = Math.floor(Date.now() / 1000);
    for (const { day, events } of days) {
      for (const event of events) {
        if (
          event.beginTimestampSeconds <= nowSeconds &&
          nowSeconds <= event.endTimestampSeconds
        ) {
          return day;
        }
      }
    }
    return days[0].day;
  }, [days]);

  const dayParam = useMemo(() => {
    if (!router.isReady) return null;
    const raw = router.query.day;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return typeof value === "string" ? value : null;
  }, [router.isReady, router.query.day]);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || days.length === 0) return;
    const daySet = new Set(days.map(({ day }) => day));
    const isValidParam = dayParam ? daySet.has(dayParam) : false;
    const nextDay = isValidParam ? dayParam : defaultDay;
    if (nextDay && nextDay !== selectedDay) {
      // Use query param when valid, otherwise fall back to a computed default.
      setSelectedDay(nextDay);
    }
  }, [days, dayParam, defaultDay, router.isReady, selectedDay]);

  const handleSelectDay = useCallback(
    (day: string) => {
      if (day === selectedDay) return;
      setSelectedDay(day);
      if (!router.isReady) return;
      router.push(
        { pathname: router.pathname, query: { ...router.query, day } },
        undefined,
        { shallow: true },
      );
    },
    [router, selectedDay],
  );

  const isLoading =
    eventsByDayLoading ||
    eventsLoading ||
    locationsLoading ||
    tagsLoading ||
    peopleLoading;
  const error =
    eventsByDayError ||
    eventsError ||
    locationsError ||
    tagsError ||
    peopleError;

  if (isLoading) return <LoadingScreen />;
  if (
    error ||
    !eventsByDay ||
    !eventsStore ||
    !locationsStore ||
    !tagsStore ||
    !peopleStore
  ) {
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
      <main>
        <SiteHeader conference={conf} activePageId={activePageId} />
        <ScheduleEvents
          conf={conf}
          days={days}
          selectedDay={selectedDay ?? defaultDay ?? ""}
          onSelectDay={handleSelectDay}
          bookmarks={bookmarks}
        />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<SchedulePageProps> = async (
  ctx,
) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "schedule" } };
};
