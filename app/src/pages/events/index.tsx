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
    data: htData,
    error,
    isLoading,
  } = useSWR<HTEvent[], Error>(`../../../ht/events.json`, fetcher);

  if (isLoading) {
    return <Loading />;
  }

  if (htData === undefined || error !== undefined) {
    return <Error msg={error?.message} />;
  }

  const eventData = toEventsData(htData);

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
        <Events dateGroup={createDateGroup(eventData)} />
      </main>
    </div>
  );
}
