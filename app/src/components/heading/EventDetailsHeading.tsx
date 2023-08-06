import {
  BookmarkIcon as BookmarkIconOutline,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSoild } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import NavLinks from "./NavLinks";
import { addBookmark, getBookmarks, removeBookmark } from "../../utils/storage";
import HeadingLogo from "./HeadingLogo";
import cal from "@/utils/cal";

export function EventDetailHeading({ event }: { event: HTEvent }) {
  const [bookmark, setBookmark] = useState(false);

  const eventId = event.id;

  useEffect(() => {
    const bookmarks = getBookmarks();
    setBookmark(bookmarks.includes(eventId));
  }, [eventId]);

  const eventBookmark = () => {
    if (!bookmark) {
      setBookmark(true);
      addBookmark(eventId);
    } else {
      setBookmark(false);
      removeBookmark(eventId);
    }
  };

  return (
    <header className="sticky top-0 z-50 ">
      <nav className="flex bg-black text-white h-20 items-center align-middle text-center justify-around py-1">
        <div className="flex-none ml-1">
          <div>
            <NavLinks />
          </div>
        </div>
        <div className="flex w-screen my-auto text-left ml-2 sm:ml-3 md:ml-4 lg:ml-5">
          <HeadingLogo />
        </div>
        <div className="flex text-right mr-5">
          <a
            className="flex"
            href={`data:text/calendar;charset=utf8,${encodeURIComponent(
              cal(event)
            )}`}
            download={`dc31-${event.id}.ics`}
          >
            {" "}
            <button
              type="button"
              onClick={() => {
                eventBookmark();
              }}
            >
              <CalendarDaysIcon className="w-5 sm:w-6 md:w-7 lg:w-8 mr-3" />
            </button>
          </a>
        </div>
        <div className="flex text-right mr-5">
          <button
            type="button"
            onClick={() => {
              eventBookmark();
            }}
          >
            {bookmark ? (
              <BookmarkIconSoild className="w-5 sm:w-6 md:w-7 lg:w-8 mr-3" />
            ) : (
              <BookmarkIconOutline className="w-5 sm:w-6 md:w-7 lg:w-8 mr-3" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default EventDetailHeading;
