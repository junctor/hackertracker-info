import { useEffect, useState } from "react";
import {
  SearchCircleIcon,
  StarIcon,
  HomeIcon,
  UserGroupIcon,
  ChevronDownIcon,
} from "@heroicons/react/solid";
import { eventData } from "./fb";
import { eventDay, eventWeekday } from "./utils";
import { HTEvent } from "./ht";
import Events from "./Events";
import Speakers from "./Speakers";
import { Theme } from "./theme";
import ErrorBoundary from "./ErrorBoundry";

const Main = () => {
  const [events, setEvents] = useState<HTEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [tab, setTab] = useState("Fri");
  const [localTime, setLocalTime] = useState<boolean>(true);
  const [categories, setCategories] = useState<Set<string>>(new Set<string>());
  const [category, setCategory] = useState("");
  const [conDays, setConDays] = useState<string[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const eventId = new URLSearchParams(document.location.search).get("event");

  const conferenceCode = "DEFCON29";

  const theme = new Theme();

  const filterEvents = (htEvent: HTEvent): boolean => {
    if (tab === "bookmarks") {
      const bookmarks: string[] =
        JSON.parse(localStorage.getItem("bookmarks") ?? "[]") ?? [];
      return bookmarks.includes(htEvent.id.toString());
    }

    if (category) {
      return htEvent.type.name === category;
    }

    if (eventId) {
      return htEvent.id.toString() === eventId;
    }

    if (searchQuery) {
      return (
        htEvent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        htEvent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        htEvent.speakers
          .map((s) => s.name)
          .join()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    if (conDays.includes(tab)) {
      return (
        eventWeekday(
          new Date(htEvent.begin),
          "America/Los_Angeles",
          localTime
        ) === tab
      );
    }

    return false;
  };

  const filteredEvents = events.filter(filterEvents);

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
  }, [events]);

  useEffect(() => {
    const conDaySet = events.reduce((set, e) => {
      set.add(
        eventWeekday(new Date(e.begin), "America/Los_Angeles", localTime)
      );
      return set;
    }, new Set<string>());

    setConDays(Array.from(conDaySet));

    if (conDaySet.size > 0) {
      setTab(Array.from(conDaySet)[0]);
    }
  }, [events, localTime]);

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
      <div className='text-4xl text-green animate-pulse ml-8 mt-8'>
        Loading DEF CON events...
      </div>
    );
  }

  const setCategoryMenu = (c: string) => {
    setCategory(c);
    if (c === "") {
      document.location.search = "";
    } else {
      setTab("");
    }
    setShowMenu(() => false);
  };

  return (
    <div id='main mb-5'>
      <div className='flex space-x-1 flex-row-reverse'>
        <div className='flex flex-initial'>
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
                  setCategory("");
                  setTab("");
                }
              }}
              aria-label='Search events'
            />
            <button className='flex-shrink-0' type='button'>
              <SearchCircleIcon
                className='h-7 w-7 text-green'
                onClick={() => {
                  setSearchQuery(() => searchInput);
                  setCategory("");
                  setTab("");
                }}
              />
            </button>
          </div>
        </div>
        <div className='flex-2'>
          <button
            className='inline-block text-sm p-2 mb-4 leading-none border rounded text-orange border-organge hover:border-blue hover:text-blue'
            type='button'
            onClick={() => setLocalTime(() => !localTime)}>
            {localTime ? "local time" : "event time"}
          </button>
        </div>
      </div>
      <div className='mb-4'>
        <div className='flex justify-end'>
          <div className='flex-none'>
            <button
              className='inline-block text-sm p-2 mr-5 leading-none border rounded text-blue border-blue hover:border-orange hover:text-orange'
              type='button'
              onClick={() => setShowMenu(() => !showMenu)}>
              {category !== "" ? category : "category"}
              <ChevronDownIcon className='h-5 w-5 inline text-orange' />
            </button>
          </div>
        </div>
        <div className='flex justify-end'>
          <div
            className={`p-2 mr-5 text-blue shadow-xl ${
              !showMenu ? "hidden" : ""
            }`}>
            <div
              role='button'
              tabIndex={0}
              className={`block px-4 py-2 text-${theme.color} hover:bg-blue rounded hover:text-black`}
              onClick={() => setCategoryMenu("")}
              onKeyDown={() => setCategoryMenu("")}>
              All
            </div>
            {Array.from(categories)
              .sort()
              .map((c, i) => (
                <div
                  key={c}
                  role='button'
                  tabIndex={i}
                  className={`block px-4 py-2 text-${theme.color} hover:bg-blue rounded hover:text-black`}
                  onClick={() => setCategoryMenu(c)}
                  onKeyDown={() => setCategoryMenu(c)}>
                  {c}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className='flex space-x-1'>
        <div className='flex-1'>
          <div>
            {!eventId && !searchQuery && !category ? (
              <ul className='flex'>
                {conDays.map((conDay) => (
                  <li key={conDay} className='-mb-px mr-1'>
                    <button
                      type='button'
                      className={`inline-block ${
                        conDay === tab
                          ? "border-l-4 border-t-4 border-r-4 rounded-t"
                          : ""
                      } py-2 px-4 text-${theme.color} font-semibold`}
                      onClick={() => setTab(conDay)}>
                      {conDay}
                    </button>
                  </li>
                ))}
                <li className='-mb-px mr-1'>
                  <button
                    type='button'
                    className={`inline-block ${
                      tab === "speakers"
                        ? "border-l-4 border-t-4 border-r-4 rounded-t"
                        : ""
                    } py-2 px-4 text-gray-light font-semibold`}
                    onClick={() => setTab("speakers")}>
                    <UserGroupIcon className='h-6 w-6 text-gray-light' />
                  </button>
                </li>
                <li className='-mb-px mr-1'>
                  <button
                    type='button'
                    className={`inline-block ${
                      tab === "bookmarks"
                        ? "border-l-4 border-t-4 border-r-4 rounded-t"
                        : ""
                    } py-2 px-4 text-orange font-semibold`}
                    onClick={() => setTab("bookmarks")}>
                    <StarIcon className='h-6 w-6 text-orange' />
                  </button>
                </li>
              </ul>
            ) : (
              <ul>
                <li className='-mb-px mr-1'>
                  <button
                    type='button'
                    className='inline-block py-2 px-4 text-blue font-semibold'
                    onClick={() => {
                      document.location.search = "";
                    }}>
                    <HomeIcon className='h-6 w-6 text-blue' />
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <ErrorBoundary>
        <div>
          {(() => {
            switch (tab) {
              case "speakers":
                return <Speakers localTime={localTime} />;
              default:
                return <Events events={groupedDates} localTime={localTime} />;
            }
          })()}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Main;
