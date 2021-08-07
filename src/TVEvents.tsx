import { useEffect, useState } from "react";
import Clock from "./Clock";
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
    const scrollPageInt = setInterval(() => {
      setFilteredEvents(filterEvents(events));
      const scroll = setInterval(() => pageScroll(), 900);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        clearInterval(scroll);
      }, 70000);
    }, 70100);
    return () => clearInterval(scrollPageInt);
  }, [events]);

  return (
    <div className='flex justify-end mb-2 mr-14'>
      <div className='flex-initial mr-2'>
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
                          <p className='text-red text-2xl mt-1 mr-10 inline'>
                            {data.type.name}
                          </p>
                          <p className='text-gray-light text-2xl mt-1 inline'>
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
      <div className='flex-initial ml-5 mt-4'>
        <div className='sticky top-20 z-100'>
          <p className='text-center text-9xl mb-10 font-bold'>Info Booth</p>
          <p>Current time:</p>
          <Clock localTime={false} size='text-8xl' />
          <p className='text-center text-2xl'>Can&apos;t Stop the Signal</p>
        </div>
      </div>
    </div>
  );
};

export default TVEvents;
