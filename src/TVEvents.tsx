import { useEffect, useState } from "react";
import { HTEvent, TVProps } from "./ht";
import { Theme } from "./theme";
import { pageScroll, filterEvents, eventTime } from "./utils";

const TVEvents = ({ events }: TVProps) => {
  const [filteredEvents, setFilteredEvents] = useState<
    Record<string, [HTEvent]>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
  >(filterEvents(events));
  const theme = new Theme();

  useEffect(() => {
    setInterval(() => {
      setFilteredEvents(filterEvents(events));
      const scroll = setInterval(() => pageScroll(), 900);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        clearInterval(scroll);
      }, 50000);
    }, 50100);
  }, [events]);

  return (
    <div id='events'>
      {Object.entries(filteredEvents).map(([day, dayEvents]) => (
        <div key={day}>
          <div className='date-events'>
            <div
              className={`sticky top-0 z-100 border-4 border-${theme.color} bg-black`}>
              <p className='text-gray-light text-4xl p-2 ml-1'>{day}</p>
            </div>
            {dayEvents.sort().map((data) => (
              <div className='event' key={data.id} aria-hidden='true'>
                <div>
                  <div key={data.id} className='event-title'>
                    <div>
                      <div>
                        <h2 className='text-green text-4xl mt-1'>
                          {data.title}
                        </h2>
                        <p className='text-yellow text-2xl mt-1'>
                          {data.speakers.map((s) => s.name).join(", ")}
                        </p>
                        <p className='text-blue mt-1 text-2xl'>
                          {`${eventTime(
                            new Date(data.begin),
                            "America/Los_Angeles",
                            false
                          )} - ${eventTime(
                            new Date(data.end),
                            "America/Los_Angeles",
                            false
                          )}`}
                        </p>
                        <p className='text-red text-2xl mt-1'>
                          {data.location.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TVEvents;
