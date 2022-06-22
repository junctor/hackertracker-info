import { useEffect, useRef, useState } from "react";
import { dateGroupTitle, groupedDates, tabDateTitle } from "../../utils/dates";
import EventCell from "./EventCell";
import NavLinks from "../heading/NavLinks";
import { SearchIcon } from "@heroicons/react/outline";
import Theme from "../../utils/theme";

export const Schedule = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const [dateGroup, setDateGroup] = useState<[string, HTEvent[]][]>([]);

  const localTime = false;
  const timeZOne = "America/Los_Angeles";

  const theme = new Theme();

  async function loadEvents(): Promise<HTEvent[]> {
    const res = await fetch("/static/conf/events.json");
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    (async () => {
      let eventData = await loadEvents();
      setDateGroup(Array.from(groupedDates(eventData, localTime, timeZOne)));
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
      <div className='navbar bg-black sticky top-0 z-50 h-16'>
        <div className='navbar-start'>
          <div className='dropdown'>
            <NavLinks />
          </div>
        </div>
        <div className='navbar-center'>
          <p className='md:text-5xl lg:text-5xl text-4xl text-white font-bold font-mono'>
            D<span className='text-dc-red'>3</span>F C
            <span className='text-dc-red'>0</span>N
          </p>
        </div>
        <div className='navbar-end'>
          <SearchIcon className='h-6 w-6 mr-3 text-white' />
        </div>
      </div>
      <div className='bg-black sticky top-16 z-30 h-12'>
        <div className='tabs tabs-boxed bg-black justify-center'>
          {dateGroup.map(([day]) => (
            <button
              key={day}
              className={`btn md:btn-md btn-sm btn-ghost text-${theme.nextColor}`}
              onClick={() => scrollToDay(day)}>
              {tabDateTitle(day, localTime, timeZOne)}
            </button>
          ))}
        </div>
      </div>
      {dateGroup.map(([day, htEvents]) => (
        <div id={divDay(day)} key={day} className='scroll-m-28'>
          <div className='bg-black sticky top-28 z-20 pb-2 pt-1'>
            <p
              className={`md:text-2xl lg:text-3xl text-xl text-center text-${theme.nextColor}`}>
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
