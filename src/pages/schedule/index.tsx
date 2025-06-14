import useSWR from "swr";
import { fetcher } from "../../lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import React from "react";
import Heading from "@/components/heading/Heading";
import Events from "@/components/schedule/Events";

export default function EventsPage() {
  const {
    data: eventsJson,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR<{ [key: string]: EventData[] }, Error>(
    `../../../ht/schedule.json`,
    fetcher
  );

  if (eventsLoading) {
    return <Loading />;
  }

  if (eventsJson === undefined || eventsError !== undefined) {
    return <Error />;
  }

  return (
    <div>
      <main>
        <Heading />
        <Events events={eventsJson} />
      </main>
    </div>
  );
}
