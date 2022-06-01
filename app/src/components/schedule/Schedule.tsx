import { useEffect, useState } from "react";
import Heading from "../heading/Heading";
import { groupedDates } from "../../utils/dates";
import EventCell from "./EventCell";

export function Schedule() {
  const [events, setEvents] = useState<HTEvent[]>([]);

  async function loadEvents(): Promise<HTEvent[]> {
    const res = await fetch("/static/events.json");
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    (async () => {
      let eventData = await loadEvents();
      setEvents(eventData);
    })();
  }, []);

  return (
    <>
      <Heading />
      {Array.from(groupedDates(events))
        .reverse()
        .map(([day, htEvents]) => (
          <div key={day}>
            <div
              className={`sticky top-16 z-100 border-2 border-dc-border bg-black`}>
              <p className='text-gray-light text-l p-1 ml-3'>{day}</p>
            </div>
            {htEvents
              .sort((e) => e.begin_timestamp.seconds - e.end_timestamp.seconds)
              .map((htEvent) => (
                <div key={htEvent.id}>
                  <EventCell event={htEvent} />
                </div>
              ))}
          </div>
        ))}
    </>
  );
}

export default Schedule;
