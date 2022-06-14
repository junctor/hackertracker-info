import { useEffect, useRef, useState } from "react";
import Heading from "../heading/Heading";
import { dateGroupTitle, groupedDates, tabDateTitle } from "../../utils/dates";
import EventCell from "./EventCell";
import { Tab } from "@headlessui/react";

export const Schedule = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const [events, setEvents] = useState<HTEvent[]>([]);
  const [dateGroup, setDateGroup] = useState<[string, HTEvent[]][]>([]);
  const [visableDay, setVisableDay] = useState<string>("");

  const localTime = false;
  const timeZOne = "America/Los_Angeles";

  async function loadEvents(): Promise<HTEvent[]> {
    const res = await fetch("/static/conf/events.json");
    const data = await res.json();
    return data;
  }
  useEffect(() => {
    if (!componentRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const elmId = entry.target.id ?? "";
          setVisableDay(() => elmId);
        }
      },
      { root: null, rootMargin: "-130px 0px 0px 0px", threshold: 0 }
    );

    document.querySelectorAll(".event-days").forEach((eE) => {
      observer.observe(eE);
    });

    return () => {
      observer.disconnect();
    };
  }, [dateGroup]);

  useEffect(() => {
    (async () => {
      let eventData = await loadEvents();
      setEvents(eventData);
      setDateGroup(
        Array.from(groupedDates(eventData, localTime, timeZOne)).reverse()
      );
    })();
  }, [localTime]);

  const scrollToDay = (day: string) => {
    if (componentRef && componentRef.current) {
      componentRef.current
        .querySelector(`#${divDay(day)}`)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const divDay = (day: string) => {
    return tabDateTitle(day, localTime, timeZOne)
      .replaceAll(" ", "")
      .toLowerCase();
  };

  return (
    <div ref={componentRef}>
      <Heading />
      <div className='bg-black sticky top-16 z-100'>
        <div className='tabs tabs-boxed bg-black justify-center'>
          {dateGroup.map(([day]) => (
            <a
              key={day}
              className={`tab ${visableDay == divDay(day) ? "tab-active" : ""}`}
              onClick={() => {
                scrollToDay(day);
              }}>
              {tabDateTitle(day, localTime, timeZOne)}
            </a>
          ))}
        </div>
      </div>
      {dateGroup.map(([day, htEvents]) => (
        <div
          id={divDay(day)}
          key={day}
          className='event-days scroll-m-32 mt-10 mb-10'>
          <div className='bg-black'>
            <p className='text-white text-2xl p-2 ml-3 mt-3 text-center'>
              {dateGroupTitle(day, localTime, timeZOne)}
            </p>
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
    </div>
  );
};

export default Schedule;
