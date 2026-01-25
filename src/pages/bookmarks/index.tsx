// src/pages/bookmarks/index.tsx
import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import ScheduleEvents from "@/features/schedule/ScheduleEvents";
import { GroupedSchedule } from "@/lib/types/info";
import { getBookmarks } from "@/lib/storage";
import Head from "next/head";

export default function BookmarksPage() {
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
        <SiteHeader />
        {bookmarks.length === 0 ? (
          <p className="mt-8 text-center text-gray-500">
            You haven’t bookmarked any events yet.
          </p>
        ) : (
          <ScheduleEvents dateGroup={dateGroup} bookmarks={bookmarks} />
        )}
      </main>
    </>
  );
}
