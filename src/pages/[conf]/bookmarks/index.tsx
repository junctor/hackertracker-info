// src/pages/bookmarks/index.tsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import Head from "next/head";
import type { GetStaticProps } from "next";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import ScheduleEvents, {
  ScheduleEventViewModel,
} from "@/features/schedule/ScheduleEvents";
import { GroupedSchedule, ScheduleEvent } from "@/lib/types/info";
import { getBookmarks } from "@/lib/storage";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import { PageId } from "@/lib/types/page-meta";

type BookmarksPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

type ScheduleDay = {
  day: string;
  events: ScheduleEventViewModel[];
};

const buildDaysFromGrouped = (dateGroup: GroupedSchedule): ScheduleDay[] => {
  return Object.entries(dateGroup)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, events]) => {
      const mapped = (events as ScheduleEvent[])
        .map((event) => {
          const beginTimestampSeconds = Math.floor(
            Date.parse(event.begin) / 1000,
          );
          const endTimestampSeconds = Math.floor(Date.parse(event.end) / 1000);
          const speakers = event.speakers?.trim();

          return {
            id: event.id,
            title: event.title,
            begin: event.begin,
            end: event.end,
            beginTimestampSeconds,
            endTimestampSeconds,
            color: event.color ?? "#fff",
            contentId: event.content_id,
            locationName: event.location ?? "Unknown location",
            tags: event.tags.map((tag) => ({
              id: tag.id,
              label: tag.label,
              colorBackground: tag.color_background,
              colorForeground: tag.color_foreground,
            })),
            speakers: speakers && speakers.length > 0 ? speakers : null,
          } satisfies ScheduleEventViewModel;
        })
        .sort((a, b) => {
          if (a.beginTimestampSeconds !== b.beginTimestampSeconds) {
            return a.beginTimestampSeconds - b.beginTimestampSeconds;
          }
          return a.title.localeCompare(b.title);
        });

      return { day, events: mapped };
    });
};

export default function BookmarksPage({
  conf,
  activePageId,
}: BookmarksPageProps) {
  const {
    data: allEvents,
    error,
    isLoading,
  } = useSWR<GroupedSchedule>("/ht/schedule.json", fetcher);

  const bookmarks = useMemo(() => getBookmarks(), []);

  const dateGroup = useMemo(() => {
    if (!allEvents) return {};
    return Object.entries(allEvents).reduce((acc, [day, events]) => {
      const favs = events.filter((e) => bookmarks.includes(e.id));
      if (favs.length) acc[day] = favs;
      return acc;
    }, {} as GroupedSchedule);
  }, [allEvents, bookmarks]);

  const days = useMemo(() => buildDaysFromGrouped(dateGroup), [dateGroup]);

  const defaultDay = useMemo(() => {
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

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    if (!defaultDay) return;
    if (!selectedDay || !days.some(({ day }) => day === selectedDay)) {
      setSelectedDay(defaultDay);
    }
  }, [defaultDay, days, selectedDay]);

  const handleSelectDay = useCallback((day: string) => {
    setSelectedDay(day);
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (error || !allEvents) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Bookmarks | DEF CON Singapore 2026</title>
        <meta
          name="description"
          content="View and manage your bookmarked DEF CON Singapore 2026 events and sessions."
        />
      </Head>
      <main>
        <SiteHeader conference={conf} activePageId={activePageId} />
        {bookmarks.length === 0 ? (
          <p className="mt-8 text-center text-gray-500">
            You haven’t bookmarked any events yet.
          </p>
        ) : days.length > 0 && selectedDay ? (
          <ScheduleEvents
            days={days}
            selectedDay={selectedDay}
            onSelectDay={handleSelectDay}
            bookmarks={bookmarks}
          />
        ) : (
          <p className="mt-8 text-center text-gray-500">
            No bookmarked events found.
          </p>
        )}
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<BookmarksPageProps> = async (
  ctx,
) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "bookmarks" } };
};
