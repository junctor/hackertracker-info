import { memo, useEffect, useRef } from "react";
import { dateGroupTitle, tabDateTitle } from "../../utils/dates";
import PageTitle from "../misc/PageTitle";
import EventDisplay from "./EventDisplay";

function Events({ dateGroup, title }: EventsProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!componentRef.current) return;

    document.querySelectorAll(".event-days").forEach((eE) => {
      const element = eE as HTMLDivElement;
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

  const scrollDay = (day: string) =>
    tabDateTitle(day).replaceAll(" ", "s").toLowerCase();

  const scrollToDay = (day: string) => {
    if (componentRef && componentRef.current) {
      componentRef.current
        .querySelector(`#${scrollDay(day)}`)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const divDay = (day: string) =>
    tabDateTitle(day).replaceAll(" ", "").toLowerCase();

  return (
    <div ref={componentRef}>
      <PageTitle title={title} />
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
                    type='button'
                    key={tabDay}
                    className={`p-2 mx-1 rounded-lg text-xs sm:text-sm md:text-base lg:text-lg font-semibold ${
                      day === tabDay ? "bg-dc-blue" : "hover:text-gray-400"
                    }`}
                    onClick={() => scrollToDay(tabDay)}>
                    {tabDateTitle(tabDay)}
                  </button>
                ))}
              </div>
            </div>
            <p className='text-xl sm:text-2xl md:text-3xl lg:text-4xl my-2 text-center font-bold text-dc-green'>
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
}

export default memo(Events);
