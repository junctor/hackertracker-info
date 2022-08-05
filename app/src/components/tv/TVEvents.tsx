import { useEffect, useState } from "react";
import { dateGroupTitle, eventDay } from "../../utils/dates";
import Theme from "../../utils/theme";
import TVClock from "../clock/TVClock";
import TVEventCell from "./TVEventCell";

function TVEvents({ events }: TVProps) {
  const [filteredEvents, setFilteredEvents] = useState<
    Map<string, EventData[]>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
  >(new Map());

  const theme = new Theme();

  useEffect(() => {
    const groupedDates = (
      displayEvents: EventData[]
    ): Map<string, EventData[]> =>
      displayEvents.reduce((group, e) => {
        const day = eventDay(new Date(e.begin));
        const groups = group.get(day) || [];
        groups.push(e);
        group.set(day, groups);
        return group;
      }, new Map<string, EventData[]>());

    const filterEvents = () => {
      const includedCats = [
        "DEF CON Official Talk",
        "DEF CON Music",
        "DEF CON Policy Team Supplementary Programming",
        "DEF CON Workshop",
        "Parties & Meetups",
        "Misc",
        "Demo Lab",
      ];

      return groupedDates(
        events.filter((e) => {
          if (!includedCats.includes(e.category)) {
            return false;
          }

          const future = new Date();
          future.setHours(future.getHours() + 6);

          const now = new Date();

          const begin = new Date(e.begin).getTime();
          const end = new Date(e.end).getTime();

          if (
            begin >= now.getTime() &&
            end >= now.getTime() &&
            end <= future.getTime()
          ) {
            return true;
          }

          return false;
        })
      );
    };

    setFilteredEvents(filterEvents());

    const pageScroll = () => {
      window.scrollBy({
        top: 45,
        left: 0,
        behavior: "smooth",
      });
    };

    const scrollPageInt = setInterval(() => {
      setFilteredEvents(filterEvents());
      const scroll = setInterval(() => pageScroll(), 900);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        clearInterval(scroll);
      }, 70000);
    }, 70100);
    return () => clearInterval(scrollPageInt);
  }, [events]);

  return (
    <div className='flex justify-end mb-2 mr-14 ml-5'>
      <div className='flex-initial w-full mr-2'>
        {Array.from(filteredEvents).map(([day, dayEvents]) => (
          <div key={day}>
            <div className='date-events'>
              <div
                className={`sticky top-0 z-10 border-4 border-white bg-${theme.nextColor} rounded-b-lg`}>
                <p className='text-gray-light text-4xl p-2 ml-1'>
                  {dateGroupTitle(day)}
                </p>
              </div>
              {dayEvents.sort().map((event) => (
                <div className='event' key={event.id} aria-hidden='true'>
                  <TVEventCell event={event} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className='flex-initial ml-5 mt-4'>
        <div className='sticky top-36 z-100'>
          <p className='text-center text-9xl mb-10 font-bold'>Info Booth</p>
          <p>Current time:</p>
          <TVClock />
          <p className='text-center text-2xl'>Hacker Homecoming</p>
        </div>
      </div>
    </div>
  );
}

export default TVEvents;
