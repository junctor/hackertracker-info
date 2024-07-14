import Event from "../../components/event/Event";
import useSWR from "swr";
import { fetcher } from "../../lib/utils/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import { useSearchParams } from "next/navigation";
import React from "react";
import Heading from "@/components/heading/Heading";
import Head from "next/head";

export default function EventPage() {
  const searchParams = useSearchParams();

  const { data: tagsJson, isLoading: tagsLoading } = useSWR<HTTag[], Error>(
    `../../../ht/tags.json`,
    fetcher
  );
  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsIsLoading,
  } = useSWR<HTEvent[], Error>(`../../../ht/events.json`, fetcher);

  if (eventsIsLoading || tagsLoading) {
    return <Loading />;
  }

  if (eventsData === undefined || eventsError !== undefined) {
    return <Error msg={eventsError?.message} />;
  }

  const eventId = searchParams.get("id");

  if (eventId == null || eventId === "") {
    return <Error msg="No event id provided" />;
  }

  const event = eventsData?.find(
    (e) => e.id.toString().toLowerCase() === eventId.toLowerCase()
  );

  if (event === undefined) {
    return <Error msg="No event found for id" />;
  }

  return (
    <div>
      <Head>
        <title>{`DC32 ${event.title}`}</title>
        <meta name="description" content="DEF CON 32 Event" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Heading />
        <Event event={event} tags={tagsJson ?? []} />
      </main>
    </div>
  );
}
