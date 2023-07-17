import { useEffect, useRef } from "react";
import { dateGroupTitle, tabDateTitle } from "../../utils/dates";
import PageTitle from "../misc/PageTitle";
import EventDisplay from "./EventDisplay";

export default function Events({
  dateGroup,
  title,
}: {
  dateGroup: Map<string, EventData[]>;
  title: string;
}) {
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (componentRef.current == null) return;

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

  useEffect(() => {
    const scrollToDiv = (id: number) => {
      if (componentRef?.current != null) {
        componentRef.current.querySelector(`div#e-${id}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    };

    const currentEvent = Array.from(dateGroup.entries())
      .flatMap((e) => e[1])
      .find((e) => new Date(e.begin) > new Date())?.id;

    if (currentEvent !== undefined) {
      scrollToDiv(currentEvent);
    }
  });

  const scrollDay = (day: string) =>
    tabDateTitle(day).replaceAll(" ", "s").toLowerCase();

  const scrollToDay = (day: string) => {
    if (componentRef?.current != null) {
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
            className="scroll-m-20"
          >
            <div
              id={divDay(day)}
              className="bg-black sticky top-20 z-20 mb-5 pb-2 event-days invisible"
            >
              <div className="bg-black justify-center items-center flex">
                {Array.from(dateGroup).map(([tabDay]) => (
                  <button
                    type="button"
                    key={tabDay}
                    className={`p-2 mx-1 rounded-lg text-xs sm:text-sm md:text-base lg:text-lg font-semibold ${
                      day === tabDay ? "bg-dc-teal" : "hover:text-gray-400"
                    }`}
                    onClick={() => {
                      scrollToDay(tabDay);
                    }}
                  >
                    {tabDateTitle(tabDay)}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl text-left font-bold my-5 ml-2">
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
