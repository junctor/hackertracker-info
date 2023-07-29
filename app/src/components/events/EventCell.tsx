import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSoild } from "@heroicons/react/24/solid";

import Link from "next/link";
import { useEffect, useState } from "react";
import { timeDisplayParts } from "../../utils/dates";
import { addBookmark, removeBookmark } from "../../utils/storage";

export default function EventCell({
  event,
  bookmarked,
}: {
  event: EventData;
  bookmarked: boolean;
}) {
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
    <div className="my-3 ml-2 mr-3" id={event.id.toString()}>
      <div className="bg-black items-center h-min-36 table">
        <div className={`table-cell px-1 bg-[${event.color}] rounded-sm`} />
        <div className="text-center items-center table-cell px-3 align-middle">
          {timeDisplayParts(event.begin).map((part) => (
            <p
              key={part}
              className="text-xs sm:text-sm md:text-sm lg:text-base font-bold text-dc-text"
            >
              {part}
            </p>
          ))}
        </div>
        <div className="w-11/12 table-cell">
          <Link href={`/event?id=${event.id}`} prefetch={false}>
            <button type="button" className="text-left">
              <h1
                className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-left break-words hover:text-[${event.color}]`}
              >
                {event.title}
              </h1>

              <p className="text-xs sm:text-sm md:text-sm lg:text-base ">
                {event.speakers}
              </p>

              <p className="text-xs sm:text-sm md:text-sm lg:text-base text-gray-400">
                {event.location}
              </p>
              <div className="flex items-center">
                {event.tags?.map((t) => (
                  <div key={t.id} className="flex m-3 items-center ">
                    <div
                      className={`rounded-full h-3 w-3 green inline-flex flex-none mr-2 bg-[${t.color_background}]`}
                    />

                    <p className="text-xs sm:text-sm md:text-sm lg:text-base inline-flex">
                      {t.label}
                    </p>
                  </div>
                ))}
              </div>
            </button>
          </Link>
        </div>
        <div className="mx-1 sm:mx-2 md:mx-3 lg:mx-4 table-cell w-1/12">
          <button
            type="button"
            className="w-10 align-middle mx-2 sm:mx-3 md:mx-4 lg:mx-5 cursor-pointer"
            onClick={() => {
              eventBookmark();
            }}
          >
            <div>
              {bookmark ? (
                <BookmarkIconSoild className="h-5 sm:h-6 md:h-7 lg:h-8" />
              ) : (
                <BookmarkIconOutline className="h-5 sm:h-6 md:h-7 lg:h-8" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
