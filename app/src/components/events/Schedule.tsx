import { useEffect, useMemo, useRef, useState } from "react";
import { groupedDates, tabDateTitle } from "../../utils/dates";
import NavLinks from "../heading/NavLinks";
import { SearchIcon, AdjustmentsIcon } from "@heroicons/react/outline";
import Events from "./Events";
import Loading from "../misc/Loading";
import events from "../../pages/events";

export const Schedule = ({ events, title }: ScheduleProps) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const [pageEvents, setPageEvents] = useState(events);

  const [dateGroup, setDateGroup] = useState<Map<string, HTEvent[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

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

  const searchEvents = () => {
    setLoading(true);
    if (search) {
      let lowerSearch = search.toLowerCase();
      setPageEvents(eventSearch(search, events));
    } else {
      setPageEvents(events);
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
          <div className='text-center mt-1 align-middle'>
            <p className='md:text-4xl lg:text-5xl text-white font-bold font-mono'>
              D<span className='text-dc-red'>3</span>F C
              <span className='text-dc-red'>0</span>N
            </p>
            <p className={`md:text-lg lg:text-xl text-white font-mono`}>
              {title}
            </p>
          </div>
        </div>
        <div className='navbar-end'>
          <label htmlFor='search-input' className='group mb-3'>
            <input
              name='search-input'
              id='search-input'
              type='text'
              placeholder='search'
              value={search}
              className={`input input-bordered input-sm input-ghost w-20 md:w-36 lg:w-44 ${
                search ? "visable" : "invisible group-hover:visible"
              } mr-2 text-base`}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onKeyPress={(e) => e.key === "Enter" && searchEvents()}
            />
            <SearchIcon
              className='h-7 w-7 text-white inline-flex mr-3'
              onClick={() => searchEvents()}
            />
          </label>
        </div>
      </div>
      {loading ? <Loading /> : <Events dateGroup={dateGroup} />}
    </div>
  );
};

export default Schedule;
