import { memo, useEffect, useRef, useState } from "react";
import { dateGroupTitle, tabDateTitle } from "../../utils/dates";
import EventCell from "./EventCell";
import Theme from "../../utils/theme";
import { getBookmarks } from "../../utils/storage";

export const Schedule = ({ dateGroup }: EventsProps) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const componentRef = useRef<HTMLDivElement>(null);
  const theme = new Theme();

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const scrollToDay = (day: string) => {
    if (componentRef && componentRef.current) {
      componentRef.current
        .querySelector(`#${scrollDay(day)}`)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const divDay = (day: string) => {
    return tabDateTitle(day).replaceAll(" ", "").toLowerCase();
  };

  const scrollDay = (day: string) => {
    return tabDateTitle(day).replaceAll(" ", "s").toLowerCase();
  };

  const EventDisplay = memo(({ htEvents }: { htEvents: HTEvent[] }) => (
    <div>
      {htEvents
        .sort((e) => e.begin_timestamp.seconds - e.end_timestamp.seconds)
        .map((htEvent) => (
          <div key={htEvent.id} id={htEvent.id.toString()}>
            <EventCell event={htEvent} bookmarks={bookmarks} />
          </div>
        ))}
    </div>
  ));

  EventDisplay.displayName = "EventDisplay";

  return (
    <div ref={componentRef}>
      <div className='bg-black sticky top-16 z-30 h-12'>
        <div className='tabs tabs-boxed bg-black justify-center'>
          {dateGroup.map(([day]) => (
            <button
              key={day}
              className={`btn md:btn-md btn-sm btn-ghost text-${theme.nextColor}`}
              onClick={() => scrollToDay(day)}>
              {tabDateTitle(day)}
            </button>
          ))}
        </div>
      </div>
      <div>
        {dateGroup.map(([day, htEvents]) => (
          <div
            id={scrollDay(day)}
            key={`${day}-events`}
            className='scroll-m-28'>
            <div
              id={divDay(day)}
              className='bg-black sticky top-28 z-20 pb-2 pt-1 mb-5 mt-5 event-days'>
              <p
                className={`md:text-2xl lg:text-3xl text-xl text-center text-${theme.nextColor}`}>
                {dateGroupTitle(day)}
              </p>
            </div>
            <div>
              <EventDisplay htEvents={htEvents} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
