import { useEffect, useState } from "react";
import { SearchCircleIcon, StarIcon } from "@heroicons/react/solid";
import { useParams } from "react-router-dom";
import { eventData } from "./fb";
import { eventDay, eventWeekday } from "./utils";
import { HTEvent, EventParams } from "./ht";
import Events from "./Events";
import { Theme } from "./theme";

const Main = () => {
  const [events, setEvents] = useState<HTEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [weekday, setWeekday] = useState("Thu");
  const [localTime, setLocalTime] = useState<boolean>(true);
  const [, setCategories] = useState<Set<string>>(new Set<string>());
  const [category] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { event } = useParams<EventParams>();

  const conferenceCode = "DEFCON28";

  const conDays = ["Thu", "Fri", "Sat", "Sun"];

  const theme = new Theme();

  let filteredEvents = events;

  if (weekday === "bookmarks") {
    const bookmarks: string[] =
      JSON.parse(localStorage.getItem("bookmarks") ?? "[]") ?? [];
    filteredEvents = filteredEvents.filter((e) =>
      bookmarks.includes(e.id.toString())
    );
  }

  if (conDays.includes(weekday)) {
    filteredEvents = filteredEvents.filter(
      (e) =>
        eventWeekday(new Date(e.begin), "America/Los_Angeles", localTime) ===
        weekday
    );
  }

  if (category) {
    filteredEvents = events.filter((e) => e.type.name === category);
  }

  if (event) {
    filteredEvents = events.filter((e) => e.id.toString() === event);
  }

  if (searchQuery) {
    filteredEvents = filteredEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.speakers
          .map((s) => s.name)
          .join()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }

  useEffect(() => {
    (async () => {
      setLoadingEvents(true);

      const localEvents = localStorage.getItem("events");

      if (localEvents) {
        const localEventData: HTEvent[] = JSON.parse(localEvents);
        setEvents(localEventData);
      } else {
        const htEvents = await eventData(conferenceCode);
        setEvents(htEvents);
        localStorage.setItem("updated", new Date().getTime().toString());
        localStorage.setItem("events", JSON.stringify(htEvents));
      }
      setLoadingEvents(false);
    })();
  }, []);

  useEffect(() => {
    const categorySet = events.reduce((set, e) => {
      set.add(e.type.name);
      return set;
    }, new Set<string>());

    setCategories(categorySet);
  }, [conferenceCode, events, setCategories]);

  /* eslint-disable no-param-reassign */
  const groupedDates: Record<string, [HTEvent]> = filteredEvents.reduce(
    (group, e) => {
      const day = eventDay(new Date(e.begin), "America/Los_Angeles", localTime);
      group[day] = group[day] || [];
      group[day].push(e);
      return group;
    },
    {} as Record<string, [HTEvent]>
  );
  /* eslint-disable no-param-reassign */

  if (loadingEvents) {
    return (
      <div className='text-4xl text-green animate-pulse ml-8'>
        Loading DEF CON events...
      </div>
    );
  }

  return (
    <div id='main mb-5'>
      <div className='flex space-x-3'>
        <div className='flex-1'>
          <div>
            <ul className='flex'>
              {conDays.map((conDay) => (
                <li key={conDay} className='-mb-px mr-1'>
                  <button
                    type='button'
                    className={`inline-block ${
                      conDay === weekday
                        ? "border-l-4 border-t-4 border-r-4 rounded-t"
                        : ""
                    } py-2 px-4 text-${theme.color} font-semibold`}
                    onClick={() => setWeekday(conDay)}>
                    {conDay}
                  </button>
                </li>
              ))}
              <li className='-mb-px mr-1'>
                <button
                  type='button'
                  className={`inline-block ${
                    weekday === "bookmarks"
                      ? "border-l-4 border-t-4 border-r-4 rounded-t"
                      : ""
                  } py-2 px-4 text-orange font-semibold`}
                  onClick={() => setWeekday("bookmarks")}>
                  <StarIcon className='h-6 w-6 text-orange' />
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className='flex align-middle'>
          <div className='flex-2'>
            <button
              className='inline-block text-sm p-2 mb-4 leading-none border rounded text-orange border-organge hover:border-blue hover:text-blue'
              type='button'
              onClick={() => setLocalTime(() => !localTime)}>
              {localTime ? "local time" : "event time"}
            </button>
          </div>
          <div className='flex-3'>
            <div className='flex items-center rounded bg-white shadow-l border-green border-2 mb-4 mr-5 ml-2'>
              <input
                className='focus:outline-none bg-transparent border-none w-full ml-2'
                type='text'
                placeholder='search events...'
                value={searchInput}
                size={15}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setSearchQuery(() => searchInput);
                  }
                }}
                aria-label='Search events'
              />
              <button className='flex-shrink-0' type='button'>
                <SearchCircleIcon
                  className='h-7 w-7 text-green'
                  onClick={() => setSearchQuery(() => searchInput)}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Events events={groupedDates} localTime={localTime} />
      </div>
    </div>
  );
};

export default Main;
