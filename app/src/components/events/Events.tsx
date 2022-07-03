import { memo, useEffect, useRef, useState } from "react";
import { dateGroupTitle, tabDateTitle } from "../../utils/dates";
import EventCell from "./EventCell";
import Theme from "../../utils/theme";
import { getBookmarks } from "../../utils/storage";

export const Events = ({ dateGroup }: EventsProps) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const theme = new Theme();

  const bookmarks = getBookmarks();

  useEffect(() => {
    if (!componentRef.current) return;

    document.querySelectorAll(".event-days").forEach((eE) => {
      let element = eE as HTMLDivElement;
      const observer = new IntersectionObserver(
        ([entry]) =>
          element.classList.toggle("invisible", entry.isIntersecting),
        { root: null, rootMargin: "-180px 0px 0px 0px", threshold: 0.25 }
      );
      observer.observe(eE);

      return () => {
        observer.disconnect();
      };
    });
  }, [dateGroup]);

  const isBookMarked = (id: string) => bookmarks?.some((b) => b === id);

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

  const EventDisplay = memo(({ htEvents }: { htEvents: EventData[] }) => (
    <div>
      {htEvents.map((htEvent) => (
        <div key={htEvent.id} id={htEvent.id.toString()}>
          <EventCell
            event={htEvent}
            bookmarked={isBookMarked(htEvent.id.toString())}
          />
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
              className='bg-black sticky top-20 z-20 mb-5 pb-2 event-days invisible'>
              <div className='bg-black justify-center items-center flex'>
                {Array.from(dateGroup).map(([tabDay]) => (
                  <button
                    key={tabDay}
                    className={`p-2 mx-1 rounded-lg text-xs sm:text-sm md:text-base lg:text-lg font-semibold ${
                      day == tabDay ? "bg-dc-blue" : "hover:text-gray-400"
                    }`}
                    onClick={() => scrollToDay(tabDay)}>
                    {tabDateTitle(tabDay)}
                  </button>
                ))}
              </div>
            </div>
            <p className='text-xl sm:text-2xl md:text-3xl lg:text-4xl my-3 text-center font-bold'>
              {dateGroupTitle(day)}
            </p>
            <div>
              <EventDisplay htEvents={htEvents} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Events);
