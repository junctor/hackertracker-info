import { useEffect, useRef, useState, Fragment, useMemo } from "react";
import { groupedDates, tabDateTitle } from "../../utils/dates";
import NavLinks from "../heading/NavLinks";
import { SearchIcon, AdjustmentsIcon } from "@heroicons/react/outline";
import Events from "./Events";
import Loading from "../misc/Loading";

export const Schedule = ({ events }: ScheduleProps) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const [dateGroup, setDateGroup] = useState<[string, HTEvent[]][]>([]);
  const [loading, setLoading] = useState(true);

  const createDateGroup = useMemo(
    () => Array.from(groupedDates(events)),
    [events]
  );

  useEffect(() => {
    setDateGroup(createDateGroup);
    setLoading(false);
  }, [createDateGroup]);

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
      <div className='navbar bg-black sticky top-0 z-50 h-16'>
        <div className='navbar-start'>
          <div className='dropdown'>
            <NavLinks />
          </div>
        </div>
        <div className='navbar-center'>
          <p className='md:text-5xl lg:text-5xl text-4xl text-white font-bold font-mono'>
            D<span className='text-dc-red'>3</span>F C
            <span className='text-dc-red'>0</span>N
          </p>
        </div>
        <div className='navbar-end mr-3'>
          <SearchIcon className='h-6 w-6 mr-3 pb-1 text-white' />
          <button type='button'>
            <AdjustmentsIcon className='h-6 w-6 text-white' />
          </button>
        </div>
      </div>
      {loading ? <Loading /> : <Events dateGroup={dateGroup} />}
    </div>
  );
};

export default Schedule;
