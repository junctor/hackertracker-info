import { useRef } from "react";
import { dateGroupTitle, groupedDates, tabDateTitle } from "../../utils/dates";
import EventCell from "./EventCell";
import Theme from "../../utils/theme";

export const Schedule = ({ dateGroup }: EventsProps) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const theme = new Theme();

  const scrollToDay = (day: string) => {
    if (componentRef && componentRef.current) {
      componentRef.current
        .querySelector(`#${divDay(day)}`)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const divDay = (day: string) => {
    return tabDateTitle(day).replaceAll(" ", "").toLowerCase();
  };

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
      {dateGroup.map(([day, htEvents]) => (
        <div id={divDay(day)} key={day} className='scroll-m-28'>
          <div className='bg-black sticky top-28 z-20 pb-2 pt-1'>
            <p
              className={`md:text-2xl lg:text-3xl text-xl text-center text-${theme.nextColor}`}>
              {dateGroupTitle(day)}
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
