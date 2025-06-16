import useSWR from "swr";
import { fetcher } from "../../lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import React, { useMemo } from "react";
import Heading from "@/components/heading/Heading";
import { useSearchParams } from "next/navigation";
import Event from "@/components/event/Event";
import { GroupedSchedule, ScheduleEvent } from "@/types/info";

export default function EventPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");

  const {
    data: eventsJson,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR<GroupedSchedule, Error>(`../../../ht/schedule.json`, fetcher);

  const event: ScheduleEvent | null = useMemo(() => {
    if (!eventId || !eventsJson) return null;

    const id = Number(eventId);
    for (const day of Object.keys(eventsJson)) {
      const match = eventsJson[day].find((e) => e.id === id);
      if (match) return match;
    }

    return null;
  }, [eventId, eventsJson]);

  if (eventsLoading) return <Loading />;
  if (eventsError) return <Error />;
  if (!eventId || event === null) return <Error msg="Event not found" />;

  return (
    <div>
      <main>
        <Heading />
        <Event event={event} />
      </main>
    </div>
  );
}
