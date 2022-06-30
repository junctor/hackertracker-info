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
    <div className='mt-2'>
      <div className='flex bg-black items-center'>
        <div
          className='ml-1 w-2 md:h-24 h-24 bg-green-400'
          style={{
            content: "",
            backgroundColor:
              event.type.color === "#ababa" ? "#e25238" : event.type.color,
          }}
        />
        <div className='w-20 text-center '>
          {timeDisplayParts(event.begin).map((part) => (
            <p
              key={part}
              className='md:text-sm lg:text-base text-xs font-bold text-dc-text'>
              {part}
            </p>
          ))}
        </div>
        <div className='w-4/5'>
          <Link href={`/events/${event.id}`} prefetch={false}>
            <a className='md:text-xl lg:text-2xl text-lg text-white'>
              {event.title}
            </a>
          </Link>
          <p className='md:text-lg lg:text-xl text-base'>
            {event.location.name}
          </p>
          <div
            className='rounded-full h-2 w-2 green inline-flex mr-2'
            style={{
              backgroundColor:
                event.type.color === "#ababa" ? "#e25238" : event.type.color,
            }}
          />
          <p className='md:text-sm lg:text-base text-xs text-white inline-flex'>
            {event.type.name}
          </p>
        </div>
        <div>
          <button
            className='w-10 items-start ml-2 mr-2 cursor-pointer'
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
