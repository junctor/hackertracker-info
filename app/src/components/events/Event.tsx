import { useEffect, useRef, useState } from "react";
import { dateGroupTitle, groupedDates, tabDateTitle } from "../../utils/dates";
import EventCell from "./EventCell";
import NavLinks from "../heading/NavLinks";
import Theme from "../../utils/theme";
import { useRouter } from "next/router";
import Heading from "../heading/Heading";
import EventDetails from "./EventDetails";
import FourOhFour from "../../pages/404";
import { StarIcon } from "@heroicons/react/outline";

export const Event = ({ event }: EventProps) => {
  useEffect(() => {
    document.title = event.title;
  }, [event]);

  return (
    <div>
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
        <div className='navbar-end'>
          <StarIcon className='w-7 mr-3' />
        </div>
      </div>
      {event && <EventDetails event={event} />}
    </div>
  );
};

export default Event;
