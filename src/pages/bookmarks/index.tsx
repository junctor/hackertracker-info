// src/pages/bookmarks/index.tsx
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

  if (isLoading) return <Loading />;
  if (error || !allEvents) return <Error />;

  return (
    <>
      <Head>
        <title>Bookmarks | DEF CON</title>
        <meta
          name="description"
          content="View and manage your bookmarked DEF CON 33 events and sessions."
        />
      </Head>
      <main>
        <Heading />
        {bookmarks.length === 0 ? (
          <p className="mt-8 text-center text-gray-500">
            You haven’t bookmarked any events yet.
          </p>
        ) : (
          <Events dateGroup={dateGroup} bookmarks={bookmarks} />
        )}
      </main>
    </>
  );
}
