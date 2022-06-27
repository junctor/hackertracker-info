import { useEffect, useMemo, useRef, useState } from "react";
import { groupedDates, tabDateTitle } from "../../utils/dates";
import NavLinks from "../heading/NavLinks";
import { SearchIcon, AdjustmentsIcon } from "@heroicons/react/outline";
import Events from "./Events";
import Loading from "../misc/Loading";
import events from "../../pages/events";

export const Schedule = ({ events, title }: ScheduleProps) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const [dateGroup, setDateGroup] = useState<Map<string, HTEvent[]>>(new Map());
  const [loading, setLoading] = useState(false);

  const createDateGroup = useMemo(
    () =>
      new Map(
        Array.from(groupedDates(events)).map(([d, et]) => [
          d,
          et.sort(
            (a, b) => a.begin_timestamp.seconds - b.begin_timestamp.seconds
          ),
        ])
      ),
    [events]
  );

  useEffect(() => {
    setDateGroup(() => createDateGroup);
    //setLoading(false);
  }, [createDateGroup, events]);

  return (
    <div ref={componentRef}>
      <div className='navbar bg-black sticky top-0 z-50 h-16'>
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
        <div className='navbar-end mr-3'>
          <SearchIcon className='h-6 w-6 mr-3 pb-1 text-white' />
        </div>
      </div>
      {loading ? <Loading /> : <Events dateGroup={dateGroup} />}
    </div>
  );
};

export default Schedule;
