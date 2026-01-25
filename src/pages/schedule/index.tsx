// src/pages/schedule/index.tsx
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

export default function SchedulePage() {
  const {
    data: schedule,
    error,
    isLoading,
  } = useSWR<GroupedSchedule>("/ht/schedule.json", fetcher);

  const bookmarks = useMemo(() => getBookmarks(), []);

  if (isLoading) return <LoadingScreen />;
  if (error || !schedule) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Schedule | DEF CON Singapore 2026</title>
        <meta
          name="description"
          content="Full DEF CON Singapore 2026 schedule of sessions, talks, and events."
        />
      </Head>
      <main>
        <SiteHeader />
        <ScheduleEvents dateGroup={schedule} bookmarks={bookmarks} />
      </main>
    </>
  );
}
