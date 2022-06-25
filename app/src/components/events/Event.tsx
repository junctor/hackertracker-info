import NavLinks from "../heading/NavLinks";
import EventDetails from "./EventDetails";
import { StarIcon as StarIconOutline } from "@heroicons/react/outline";
import { StarIcon as StarIconSoild } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { addBookmark, getBookmarks, removeBookmark } from "../../utils/storage";

export const Event = ({ event }: EventProps) => {
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    const bookmarks = getBookmarks();
    setBookmark(bookmarks?.some((b) => b === event.id.toString()));
  }, [event]);

  const eventBookmark = () => {
    console.log(bookmark);
    if (!bookmark) {
      setBookmark(true);
      addBookmark(event.id.toString());
    } else {
      setBookmark(false);
      removeBookmark(event.id.toString());
    }
  };

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
          <div onClick={() => eventBookmark()}>
            {bookmark ? (
              <StarIconSoild className='w-7 mr-3' />
            ) : (
              <StarIconOutline className='w-7 mr-3' />
            )}
          </div>
        </div>
      </div>
      {event && <EventDetails event={event} />}
    </div>
  );
};

export default Event;
