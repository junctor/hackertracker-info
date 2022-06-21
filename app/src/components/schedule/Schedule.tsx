import { useEffect, useRef, useState } from "react";
import Heading from "../heading/Heading";
import { dateGroupTitle, groupedDates, tabDateTitle } from "../../utils/dates";
import EventCell from "./EventCell";

export const Schedule = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const [dateGroup, setDateGroup] = useState<[string, HTEvent[]][]>([]);

  const localTime = false;
  const timeZOne = "America/Los_Angeles";

  async function loadEvents(): Promise<HTEvent[]> {
    const res = await fetch("/static/conf/events.json");
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    (async () => {
      let eventData = await loadEvents();
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
      <div className='bg-black sticky top-16 z-30 pt-2'>
        <div className='tabs tabs-boxed bg-black justify-center'>
          {dateGroup.map(([day]) => (
            <button
              key={day}
              className={`btn btn-sm btn-ghost`}
              onClick={() => scrollToDay(day)}>
              {tabDateTitle(day, localTime, timeZOne)}
            </button>
          ))}
        </div>
      </div>
      {dateGroup.map(([day, htEvents]) => (
        <div id={divDay(day)} key={day} className='scroll-m-28 mt-5 mb-10'>
          <div className='bg-black sticky top-28 z-20'>
            <p className='text-white text-2xl ml-3 mt-3 text-center'>
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
