import { memo, useEffect, useMemo, useRef, useState } from "react";
import { groupedDates } from "../../utils/dates";
import NavLinks from "../heading/NavLinks";
import { SearchIcon } from "@heroicons/react/outline";
import Events from "./Events";
import Loading from "../misc/Loading";

export const Schedule = ({ events, title }: ScheduleProps) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const [pageEvents, setPageEvents] = useState(events);
  const search = useRef("");

  const [dateGroup, setDateGroup] = useState<Map<string, HTEvent[]>>(new Map());
  const [loading, setLoading] = useState(false);

  const createDateGroup = useMemo(
    () =>
      new Map(
        Array.from(groupedDates(pageEvents)).map(([d, et]) => [
          d,
          et.sort(
            (a, b) => a.begin_timestamp.seconds - b.begin_timestamp.seconds
          ),
        ])
      ),
    [pageEvents]
  );

  const loadSetPages = (e: HTEvent[]) => {
    setLoading(true);
    setPageEvents(e);
  };

  const searchEvents = (q: string) => {
    console.log("q: ", q);
    if (q) {
      const searchedEvents = eventSearch(q, events);
      if (pageEvents.length !== searchedEvents.length) {
        loadSetPages(eventSearch(q, events));
      }
    } else {
      if (events.length !== pageEvents.length) {
        loadSetPages(events);
      }
    }
  };

  useEffect(() => {
    setDateGroup(createDateGroup);
    setLoading(false);
  }, [createDateGroup, events]);

  const eventSearch = (query: string, events: HTEvent[]) => {
    let lowerSearch = query.toLowerCase();

    return events.filter(
      (pE) =>
        pE.title.toLowerCase().includes(lowerSearch) ||
        pE.location.name.toLowerCase().includes(lowerSearch) ||
        pE.location.hotel.toLowerCase().includes(lowerSearch) ||
        pE.type.name.toLowerCase().includes(lowerSearch) ||
        pE.speakers.some((s) => s.name.toLowerCase().includes(lowerSearch)) ||
        pE.description.toLowerCase().includes(lowerSearch)
    );
  };

  return (
    <div ref={componentRef}>
      <div className='navbar bg-black sticky top-0 z-50 h-20'>
        <div className='navbar-start'>
          <div className='dropdown'>
            <NavLinks />
          </div>
        </div>
        <div className='navbar-center'>
          <div className='text-center mt-1 items-center absolute'>
            <p className='md:text-4xl lg:text-5xl text-white font-bold font-mono'>
              D<span className='text-dc-red'>3</span>F C
              <span className='text-dc-red'>0</span>N
            </p>
            <p className={`md:text-lg lg:text-xl text-white font-mono`}>
              {title}
            </p>
          </div>
        </div>
        <div className='navbar-end'></div>
        <label htmlFor='search-input' className='group'>
          <input
            name='search-input'
            id='search-input'
            type='text'
            placeholder='search'
            className={`input input-error input-bordered input-sm input-ghost w-20 md:w-36 lg:w-44 ${
              search.current !== ""
                ? "visable"
                : "invisible group-hover:visible"
            } mr-2 text-base`}
            onBlur={(e) => (search.current = e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                search.current = (e.target as HTMLInputElement).value;
                searchEvents((e.target as HTMLInputElement).value);
              }
            }}
          />
          <SearchIcon
            className='h-7 w-7 text-white inline-flex mr-3'
            onClick={() => searchEvents(search.current)}
          />
        </label>
      </div>
      {loading ? <Loading /> : <Events dateGroup={dateGroup} />}
    </div>
  );
};

export default Schedule;
