// src/pages/schedule/index.tsx
import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import Events from "@/components/schedule/Events";
import { GroupedSchedule } from "@/types/info";
import { getBookmarks } from "@/lib/storage";
import Head from "next/head";

export default function SchedulePage() {
  const {
    data: schedule,
    error,
    isLoading,
  } = useSWR<GroupedSchedule>("/ht/schedule.json", fetcher);

  const bookmarks = useMemo(() => getBookmarks(), []);

  if (isLoading) return <Loading />;
  if (error || !schedule) return <Error />;

  return (
    <>
      <Head>
        <title>Schedule | DEF CON Singapore 2025</title>
        <meta
          name="description"
          content="Full DEF CON Singapore 2025 schedule of sessions, talks, and events."
        />
      </Head>
      <main>
        <Heading />
        <Events dateGroup={schedule} bookmarks={bookmarks} />
      </main>
    </>
  );
}
