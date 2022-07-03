import { timeDisplayParts } from "../../utils/dates";
import { StarIcon as StarIconOutline } from "@heroicons/react/outline";
import { StarIcon as StarIconSoild } from "@heroicons/react/solid";

import Link from "next/link";
import { memo, useEffect, useState } from "react";
import { addBookmark, getBookmarks, removeBookmark } from "../../utils/storage";

export function EventCell({ event, bookmarked }: EventProps) {
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    setBookmark(bookmarked);
  }, [bookmarked]);

  const eventBookmark = () => {
    if (!bookmark) {
      setBookmark(true);
      addBookmark(event.id.toString());
    } else {
      setBookmark(false);
      removeBookmark(event.id.toString());
    }
  };

  return (
    <div className='my-2 ml-2 mr-3'>
      <div className='flex bg-black items-center'>
        <div
          className={`ml-1 w-2 h-24 ${
            event.color === "#ababa" ? "bg-dc-pink" : `bg-[${event.color}]`
          }`}>
          &nbsp;
        </div>
        <div className='w-20 text-center '>
          {timeDisplayParts(event.begin).map((part) => (
            <p
              key={part}
              className='text-xs sm:text-xs md:text-sm lg:text-base font-bold text-dc-text'>
              {part}
            </p>
          ))}
        </div>
        <div className='w-11/12'>
          <Link href={`/events/${event.id}`} prefetch={false}>
            <a className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold'>
              {event.title}
            </a>
          </Link>
          <p className='text-xs sm:text-base md:text-lg lg:text-xl'>
            {event.location}
          </p>
          <div
            className='rounded-full h-3 w-3 green inline-flex mr-2'
            style={{
              backgroundColor:
                event.color === "#ababa" ? "#e25238" : event.color,
            }}
          />
          <p className='text-xs sm:text-xs md:text-sm lg:text-base inline-flex'>
            {event.category}
          </p>
        </div>
        <div>
          <button
            className='flex w-10 items-start align-middle mx-2 cursor-pointer place-content-end'
            onClick={() => eventBookmark()}>
            {bookmark ? (
              <StarIconSoild className='md:h-6 lg:h-8 h-5' />
            ) : (
              <StarIconOutline className='md:h-6 lg:h-8 h-5' />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(EventCell);
