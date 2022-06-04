import { useEffect, useRef, useState } from "react";
import Heading from "../heading/Heading";
import { dateGroupTitle, groupedDates, tabDateTitle } from "../../utils/dates";
import EventCell from "./EventCell";
import { Tab } from "@headlessui/react";

export const Schedule = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

  const [events, setEvents] = useState<HTEvent[]>([]);
  const [dateGroup, setDateGroup] = useState<[string, HTEvent[]][]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [visableDays, setVisableDays] = useState<Set<string>>(new Set());

  const localTime = false;
  const timeZOne = "America/Los_Angeles";

  async function loadEvents(): Promise<HTEvent[]> {
    const res = await fetch("/static/events.json");
    const data = await res.json();
    return data;
  }
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visCopy = visableDays;
        visCopy.clear();
        setVisableDays(() => visCopy);
        console.log(visableDays);
        const elmId = entry.target.id ?? "";
        if (entry.isIntersecting) {
          console.log(`vis ${elmId} `);
          setVisableDays(() => new Set([...Array.from(visableDays), elmId]));
        }
      },
      { rootMargin: "-50px", threshold: 0 }
    );

    const daysElements = document.querySelectorAll(".event-days");

    daysElements.forEach((eE) => {
      observer.observe(eE);
    });

    return () => {
      observer.disconnect();
    };
  }, [visableDays]);

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
              className={`tab ${
                visableDays.has(divDay(day)) ? "tab-active" : ""
              }`}
              onClick={() => {
                setActiveTab(day);
                scrollToDay(day);
              }}>
              {tabDateTitle(day, localTime, timeZOne)}
            </a>
          ))}
        </div>
      </div>
      {dateGroup.map(([day, htEvents]) => (
        <div id={divDay(day)} key={day} className='event-days scroll-m-32'>
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
