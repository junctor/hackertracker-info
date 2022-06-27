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
      {htEvents.map((htEvent) => (
        <div key={htEvent.id} id={htEvent.id.toString()}>
          <EventCell event={htEvent} bookmarks={bookmarks} />
        </div>
      ))}
    </div>
  ));

  EventDisplay.displayName = "EventDisplay";

  return (
    <div ref={componentRef}>
      <div>
        {Array.from(dateGroup).map(([day, htEvents]) => (
          <div
            id={scrollDay(day)}
            key={`${day}-events`}
            className='scroll-m-20'>
            <div
              id={divDay(day)}
              className='bg-black sticky top-20 z-20 mb-5 event-days'>
              <div className='tabs tabs-boxed bg-black justify-center'>
                {Array.from(dateGroup).map(([tabDay]) => (
                  <button
                    key={tabDay}
                    className={`btn md:btn-sm btn-xs text-${theme.nextColor} ${
                      day == tabDay ? "btn-active btn-secondary" : "btn-ghost"
                    }`}
                    onClick={() => scrollToDay(tabDay)}>
                    {tabDateTitle(tabDay)}
                  </button>
                ))}
              </div>
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

export default memo(Schedule);
