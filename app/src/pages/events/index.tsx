import useSWR from "swr";
import { fetcher, toEventsData } from "../../lib/utils/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import { createDateGroup } from "@/lib/utils/dates";
import Events from "../../components/events/Events";
import React from "react";
import Heading from "@/components/heading/Heading";

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
      <main>
        <Heading />
        <Events dateGroup={createDateGroup(eventData)} tags={tagsJson ?? []} />
      </main>
    </div>
  );
}
