import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import Event from "@/components/event/Event";
import { useSearchParams } from "next/navigation";
import { GroupedSchedule, ScheduleEvent } from "@/types/info";
import { getBookmarks } from "@/lib/storage";

export default function EventPage() {
  const params = useSearchParams();
  const idParam = params.get("id");
  const eventId = useMemo(() => (idParam ? Number(idParam) : null), [idParam]);

  const {
    data: schedule,
    error,
    isLoading,
  } = useSWR<GroupedSchedule>("/ht/schedule.json", fetcher);

  const event: ScheduleEvent | null = useMemo(() => {
    if (!schedule || eventId === null) return null;
    for (const day of Object.values(schedule)) {
      const match = day.find((e) => e.id === eventId);
      if (match) return match;
    }
    return null;
  }, [schedule, eventId]);

  const bookmarks = useMemo(() => getBookmarks(), []);

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  if (eventId === null || !event) return <Error msg="Event not found" />;

  return (
    <main>
      <Heading />
      <Event event={event} isBookmarked={bookmarks.includes(event.id)} />
    </main>
  );
}
