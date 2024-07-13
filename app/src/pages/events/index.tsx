import useSWR from "swr";
import { fetcher, toEventsData } from "../../lib/utils/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import { createDateGroup } from "@/lib/utils/dates";
import Events from "../../components/events/Events";
import React from "react";
import Heading from "@/components/heading/Heading";
import Head from "next/head";

export default function EventsPage() {
  const {
    data: eventsJson,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR<HTEvent[], Error>(`../../../ht/events.json`, fetcher);

  const { data: tagsJson, isLoading: tagsLoading } = useSWR<HTTag[], Error>(
    `../../../ht/tags.json`,
    fetcher
  );

  if (eventsLoading || tagsLoading) {
    return <Loading />;
  }

  if (eventsJson === undefined || eventsError !== undefined) {
    return <Error />;
  }

  const eventData = toEventsData(eventsJson, tagsJson ?? []);

  return (
    <div>
      <Head>
        <title>DC32 Events</title>
        <meta name="description" content="DEF CON 32 Events" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Heading />
        <Events dateGroup={createDateGroup(eventData)} tags={tagsJson ?? []} />
      </main>
    </div>
  );
}
