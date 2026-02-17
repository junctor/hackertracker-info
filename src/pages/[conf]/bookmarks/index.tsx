// src/pages/bookmarks/index.tsx
import React, { useMemo, useState, useCallback } from "react";
import useSWR from "swr";
import Head from "next/head";
import type { GetStaticProps } from "next";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import SiteFooter from "@/features/app-shell/SiteFooter";
import ScheduleEvents, {
  buildScheduleDaysFromGrouped,
} from "@/features/schedule/ScheduleEvents";
import { GroupedSchedule } from "@/lib/types/info";
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

const INITIAL_NOW_SECONDS = Math.floor(Date.now() / 1000);

export default function BookmarksPage({
  conf,
  activePageId,
}: BookmarksPageProps) {
  const {
    data: allEvents,
    error,
    isLoading,
  } = useSWR<GroupedSchedule>(`${conf.dataRoot}/schedule.json`, fetcher);

  const bookmarks = useMemo(() => getBookmarks(), []);

  const dateGroup = useMemo(() => {
    if (!allEvents) return {};
    return Object.entries(allEvents).reduce((acc, [day, events]) => {
      const favs = events.filter((e) => bookmarks.includes(e.id));
      if (favs.length) acc[day] = favs;
      return acc;
    }, {} as GroupedSchedule);
  }, [allEvents, bookmarks]);

  const days = useMemo(
    () => buildScheduleDaysFromGrouped(dateGroup),
    [dateGroup],
  );

  const defaultDay = useMemo(() => {
    if (days.length === 0) return null;
    const nowSeconds = INITIAL_NOW_SECONDS;
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

  const resolvedDay = useMemo(() => {
    if (selectedDay && days.some(({ day }) => day === selectedDay)) {
      return selectedDay;
    }
    return defaultDay;
  }, [defaultDay, days, selectedDay]);

  const handleSelectDay = useCallback((day: string) => {
    setSelectedDay(day);
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (error || !allEvents) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Bookmarks | {conf.name}</title>
        <meta
          name="description"
          content={`View and manage your bookmarked ${conf.name} events and sessions.`}
        />
      </Head>
      <div className="min-h-screen flex flex-col">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main className="flex-1">
          <h1 className="sr-only">Bookmarks</h1>
          {bookmarks.length === 0 ? (
            <p className="mt-8 text-center text-gray-500">
              You haven’t bookmarked any events yet.
            </p>
          ) : days.length > 0 && resolvedDay ? (
            <ScheduleEvents
              conf={conf}
              days={days}
              selectedDay={resolvedDay}
              onSelectDay={handleSelectDay}
              bookmarks={bookmarks}
            />
          ) : (
            <p className="mt-8 text-center text-gray-500">
              No bookmarked events found.
            </p>
          )}
        </main>
        <SiteFooter />
      </div>
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
