import { StarIcon as StarIconOutline } from "@heroicons/react/outline";
import { StarIcon as StarIconSoild } from "@heroicons/react/solid";

import Link from "next/link";
import { memo, useEffect, useState } from "react";
import { timeDisplayParts } from "../../utils/dates";
import { addBookmark, removeBookmark } from "../../utils/storage";

function EventCell({ event, bookmarked }: EventProps) {
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    setBookmark(bookmarked);
  }, [bookmarked]);

  const eventBookmark = () => {
    if (!bookmark) {
      setBookmark(true);
      addBookmark(event.id);
    } else {
      setBookmark(false);
      removeBookmark(event.id);
    }
  };

  return (
    <div className='my-3 ml-2 mr-3'>
      <div className='flex bg-black items-center'>
        <div className={`ml-1 w-2 md:w-3 h-28 bg-[${event.color}] rounded-md`}>
          &nbsp;
        </div>
        <div className='w-20 text-center'>
          {timeDisplayParts(event.begin).map((part) => (
            <p
              key={part}
              className='text-xs sm:text-sm md:text-sm lg:text-base font-bold text-dc-text'>
              {part}
            </p>
          ))}
        </div>
        <div className='w-11/12'>
          <Link href={`/events/${event.id}`} prefetch={false}>
            <button
              type='button'
              className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-left break-words'>
              {event.title}
            </button>
          </Link>

          <p className='text-xs sm:text-sm md:text-sm lg:text-base text-gray-400'>
            {event.location}
          </p>
          <div
            className={`rounded-full h-3 w-3 green inline-flex mr-2 bg-[${event.color}]`}
          />
          <p className='text-xs sm:text-sm md:text-sm lg:text-base inline-flex'>
            {event.category}
          </p>
        </div>
        <div>
          <button
            type='button'
            className='w-6 items-start align-middle mx-2 sm:mx-3 md:mx-4 lg:mx-5 cursor-pointer place-content-end'
            onClick={() => eventBookmark()}>
            {bookmark ? (
              <StarIconSoild className='h-5 sm:h-6 md:h-7 lg:h-8' />
            ) : (
              <StarIconOutline className='h-5 sm:h-6 md:h-7 lg:h-8' />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(EventCell);
