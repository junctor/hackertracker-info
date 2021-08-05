import { useEffect, useState } from "react";
import { eventData, firebaseInit } from "./fb";
import { Heading } from "./Heading";
import { HTEvent } from "./ht";
import Main from "./Main";
import TV from "./TV";
import { invalidateCache } from "./utils";

const HackerTracker = () => {
  const [events, setEvents] = useState<HTEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const conferenceCode = "DEFCON29";

  const pageParam = new URLSearchParams(document.location.search).get("page");

  useEffect(() => {
    (async () => {
      await firebaseInit();

      await invalidateCache();
      setLoadingEvents(true);

      const localEvents = localStorage.getItem("events");

      if (localEvents) {
        const localEventData: HTEvent[] = JSON.parse(localEvents);
        setEvents(localEventData);
      } else {
        const htEvents = await eventData(conferenceCode);
        setEvents(htEvents);
        localStorage.setItem("updated", new Date().getTime().toString());
        localStorage.setItem("events", JSON.stringify(htEvents));
      }
      setLoadingEvents(false);
    })();
  }, []);

  if (loadingEvents) {
    return (
      <div>
        <Heading />
        <div className='text-4xl text-red animate-pulse ml-8 mt-8'>
          Loading DEF CON events...
        </div>
      </div>
    );
  }

  if (pageParam === "tv") {
    return <TV events={events} />;
  }

  return (
    <div>
      <Heading />
      <Main events={events} />
    </div>
  );
};

export default HackerTracker;
