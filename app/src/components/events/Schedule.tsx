import { useEffect, useRef, useState } from "react";
import { tabDateTitle } from "../../utils/dates";
import NavLinks from "../heading/NavLinks";
import { SearchIcon, AdjustmentsIcon } from "@heroicons/react/outline";
import Events from "./Events";
import Loading from "../misc/Loading";

export const Schedule = ({ dateGroup }: ScheduleProps) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);

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
        </div>
      </div>
      {loading ? <Loading /> : <Events dateGroup={dateGroup} />}
    </div>
  );
};

export default Schedule;
