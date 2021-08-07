import { useEffect, useState } from "react";
import {
  SearchCircleIcon,
  StarIcon,
  HomeIcon,
  UserGroupIcon,
  ChevronDownIcon,
  LinkIcon,
  MapIcon,
} from "@heroicons/react/solid";
import { speakerData } from "./fb";
import { eventWeekday, getSetting, groupedDates, toggleSetting } from "./utils";
import { HTEvent, HTSpeaker, MainProps } from "./ht";
import Events from "./Events";
import Speakers from "./Speakers";
import { Theme } from "./theme";
import ErrorBoundary from "./ErrorBoundry";
import Map from "./Map";
import Clock from "./Clock";

const Main = ({ events }: MainProps) => {
  const [speakers, setSpeakers] = useState<HTSpeaker[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [tab, setTab] = useState("Thu");
  const [localTime, setLocalTime] = useState<boolean>(true);
  const [categories, setCategories] = useState<Set<string>>(new Set<string>());
  const [category, setCategory] = useState("");
  const [conDays, setConDays] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hideEvents, setHideEvents] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [eventId, setEventID] = useState("");

  useEffect(() => {
    const categoryParam = new URLSearchParams(document.location.search).get(
      "category"
    );
    setCategory(() => categoryParam ?? "");

    const eventIdParam = new URLSearchParams(document.location.search).get(
      "event"
    );

    const searchParam = new URLSearchParams(document.location.search).get(
      "search"
    );

    setSearchQuery(searchParam ?? "");

    const localTimeSetting = getSetting("localTime");

    if (localTimeSetting) {
      setLocalTime(localTimeSetting === "true");
    }

    if (eventIdParam) {
      setEventID(eventIdParam);
      setHideEvents(false);
    } else {
      const hideCompletedSetting = getSetting("hideCompleted");

      if (hideCompletedSetting) {
        setHideEvents(hideCompletedSetting === "true");
      }
    }
  }, []);

  const theme = new Theme();

  const hideCompletedEvents = (htEvent: HTEvent) =>
    new Date(htEvent.end).getTime() > Date.now();

  const filterEvents = (htEvent: HTEvent): boolean => {
    if (eventId) {
      return htEvent.id.toString() === eventId;
    }

    if (hideEvents && !hideCompletedEvents(htEvent)) {
      return false;
    }

    if (tab === "bookmarks") {
      const bookmarks: string[] =
        JSON.parse(localStorage.getItem("bookmarks") ?? "[]") ?? [];
      return bookmarks.includes(htEvent.id.toString());
    }

    if (category) {
      return htEvent.type.name === category;
    }

    if (searchQuery) {
      return (
        htEvent.type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

      const localSpeakers = localStorage.getItem("speakers");

      if (localSpeakers) {
        const localSpeakerData: HTSpeaker[] = JSON.parse(localSpeakers);
        setSpeakers(localSpeakerData);
      } else {
        const htSpeakers = await speakerData("DEFCON29");
        setSpeakers(htSpeakers);
        localStorage.setItem("speakers", JSON.stringify(htSpeakers));
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
    const conDaySet = events
      .filter((e) => !hideEvents || hideCompletedEvents(e))
      .reduce((set, e) => {
        set.add(
          eventWeekday(new Date(e.begin), "America/Los_Angeles", localTime)
        );
        return set;
      }, new Set<string>());

    setConDays(Array.from(conDaySet));

    if (conDaySet.size > 0) {
      const now = new Date();
      const nowWeekday = eventWeekday(now, "America/Los_Angeles", localTime);

      if (conDaySet.has(nowWeekday)) {
        setTab(nowWeekday);
      } else {
        setTab(Array.from(conDaySet)[0]);
      }
    }
  }, [events, localTime, hideEvents]);

  if (loadingEvents) {
    return (
      <div className='text-4xl text-green animate-pulse ml-8 mt-8'>
        Loading DEF CON events...
      </div>
    );
  }

  const setCategoryMenu = (c: string) => {
    setCategory(c);
    const [baseUrl] = document.location.href.split("?");
    window.history.pushState({}, document.title, baseUrl);
    setSearchQuery("");
    setTab("");

    setShowMenu(() => false);
  };

  const clearFilters = (resetTab: boolean = false) => {
    const [baseUrl] = document.location.href.split("?");
    window.history.pushState({}, document.title, baseUrl);
    setSearchQuery("");
    setCategoryMenu("");
    setCategory("");
    if (resetTab) {
      if (conDays.length > 0) {
        const now = new Date();
        const nowWeekday = eventWeekday(now, "America/Los_Angeles", localTime);

        if (conDays.includes(nowWeekday)) {
          setTab(nowWeekday);
        } else {
          setTab(conDays[0]);
        }
      }
    }

    if (eventId) {
      window.location.reload();
    }
  };

  return (
    <div id='main mb-5'>
      <div className='flex justify-end items-center mb-2'>
        <div className='flex-initial mr-2'>
          <Clock localTime={localTime} size='text-4xl' />
        </div>
        <div className='flex-initial mr-5'>
          <div className='w-full shadow stats'>
            <div className='stat place-items-center place-content-center'>
              <div className='stat-title'>Events</div>
              <div className='stat-value text-accent'>{events.length}</div>
              <div className='stat-desc'>Can&apos;t Stop the Signal</div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-end items-center'>
        <div className='flex-initial'>
          <div>
            <button
              className='btn btn-secondary btn-outline lowercase text-xs'
              type='button'
              onClick={() => setShowMenu(() => !showMenu)}>
              {category !== "" ? category : "category"}
              <ChevronDownIcon className='h-5 w-5 inline text-red' />
            </button>
          </div>
          <div className='flex-initial'>
            <div
              className={`p-2 mr-1 mb-2 mt-2 absolute border text-blue shadow-xl rounded-box bg-background z-10 overflow-y-auto h-40 ${
                !showMenu ? "hidden" : ""
              }`}>
              <div
                role='button'
                tabIndex={0}
                className={`px-4 py-2 text-${theme.color} text-xs hover:bg-blue rounded hover:text-black`}
                onClick={() => clearFilters(true)}
                onKeyDown={() => clearFilters(true)}>
                All
              </div>
              {Array.from(categories)
                .sort()
                .map((c, i) => (
                  <div
                    key={c}
                    role='button'
                    tabIndex={i}
                    className={`block px-4 py-2  text-${theme.color} text-xs hover:bg-blue rounded hover:text-black`}
                    onClick={() => setCategoryMenu(c)}
                    onKeyDown={() => setCategoryMenu(c)}>
                    {c}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className='flex space-x-1'>
          <div className='flex items-center ml-2 mr-5'>
            <input
              id='event-search'
              className='input text-base w-full mr-1 input-bordered'
              type='text'
              placeholder='search...'
              size={13}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const inputTarget = e.target as HTMLInputElement;
                  clearFilters(inputTarget.value === "");
                  setSearchQuery(() => inputTarget.value);
                  inputTarget.blur();
                }
              }}
              aria-label='Search events'
            />
            <button className='flex-shrink-0' type='button'>
              <SearchCircleIcon
                className='h-12 w-12 text-green'
                onClick={() => {
                  const searchInput: HTMLInputElement | null =
                    document.querySelector("#event-search");
                  clearFilters(searchInput?.value === "");
                  setSearchQuery(() => searchInput?.value ?? "");
                }}
              />
            </button>
          </div>
        </div>
      </div>

      <div className='flex justify-end mr-5'>
        <div className='flex-2'>
          <label className='cursor-pointer label' htmlFor='time-toggle'>
            <span className='label-text'>display local time</span>
            <input
              id='time-toggle'
              type='checkbox'
              checked={localTime}
              className='toggle toggle-secondary mr-5 ml-2'
              onChange={() => {
                toggleSetting("localTime", !localTime);
                setLocalTime(() => !localTime);
              }}
            />
          </label>
        </div>
        <div className='flex-2'>
          <label className='cursor-pointer label' htmlFor='time-toggle'>
            <span className='label-text'>hide completed events</span>
            <input
              id='time-toggle'
              type='checkbox'
              checked={hideEvents}
              className='toggle toggle-primary ml-2'
              onChange={() => {
                toggleSetting("hideCompleted", !hideEvents);
                setHideEvents(() => !hideEvents);
              }}
            />
          </label>
        </div>
      </div>

      <div className='flex space-x-1 mt-1'>
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
                      } py-1 px-2 text-${theme.color} font-semibold`}
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
                    } py-1 px-2 text-gray font-semibold`}
                    onClick={() => setTab("speakers")}>
                    <UserGroupIcon className='h-6 w-6 text-gray' />
                  </button>
                </li>
                <li className='-mb-px mr-1'>
                  <button
                    type='button'
                    className={`inline-block ${
                      tab === "map"
                        ? "border-l-4 border-t-4 border-r-4 rounded-t"
                        : ""
                    } py-1 px-2 text-gray-light font-semibold`}
                    onClick={() => setTab("map")}>
                    <MapIcon className='h-6 w-6 text-gray-light' />
                  </button>
                </li>
                <li className='-mb-px mr-1'>
                  <button
                    type='button'
                    className={`inline-block ${
                      tab === "bookmarks"
                        ? "border-l-4 border-t-4 border-r-4 rounded-t"
                        : ""
                    } py-1 px-2 text-orange font-semibold`}
                    onClick={() => setTab("bookmarks")}>
                    <StarIcon className='h-6 w-6 text-orange' />
                  </button>
                </li>
              </ul>
            ) : (
              <ul className='flex'>
                <li className='-mb-px mr-1'>
                  <button
                    type='button'
                    className='inline-block py-1 px-2 text-blue font-semibold'
                    onClick={() => {
                      clearFilters(true);
                    }}>
                    <HomeIcon className='h-6 w-6 text-blue' />
                  </button>
                </li>

                {searchQuery && !category && (
                  <li className='-mb-px mr-1'>
                    <button
                      type='button'
                      className='inline-block py-1 px-2 text-orange  border-l-4 border-t-4 border-r-4 rounded-t font-semibold text-sm'>
                      {searchQuery}
                    </button>
                    <LinkIcon
                      className='inline cursor-pointer ml-2 mb-2 w-7 h-7 text-blue'
                      onClick={() => {
                        const url = window.location.href.split("?")[0];
                        navigator.clipboard.writeText(
                          `${url}?search=${encodeURI(searchQuery)}`
                        );
                      }}
                    />
                  </li>
                )}

                {category && (
                  <li className='-mb-px mr-1'>
                    <button
                      type='button'
                      className='inline-block py-1 px-2 text-yellow  border-l-4 border-t-4 border-r-4 rounded-t font-semibold text-sm'>
                      {category}
                    </button>

                    <LinkIcon
                      className='inline cursor-pointer ml-2 mb-2 w-7 h-7 text-blue'
                      onClick={() => {
                        const url = window.location.href.split("?")[0];
                        navigator.clipboard.writeText(
                          `${url}?category=${encodeURI(category)}`
                        );
                      }}
                    />
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
      <ErrorBoundary>
        <div>
          {(() => {
            switch (tab) {
              case "map":
                return <Map />;
              case "speakers":
                return <Speakers speakers={speakers} localTime={localTime} />;
              default:
                return (
                  <Events
                    events={groupedDates(filteredEvents, localTime)}
                    speakers={speakers}
                    localTime={localTime}
                  />
                );
            }
          })()}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Main;
