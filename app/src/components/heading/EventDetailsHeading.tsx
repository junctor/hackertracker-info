import { StarIcon as StarIconOutline } from "@heroicons/react/outline";
import { StarIcon as StarIconSoild } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import NavLinks from "./NavLinks";
import { addBookmark, getBookmarks, removeBookmark } from "../../utils/storage";

export function EventDetailHeading({ eventId }: EventDetailHeaderProps) {
  const [bookmark, setBookmark] = useState(false);

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
    <header className='sticky top-0 z-50 '>
      <nav className='flex bg-black h-20 items-center justify-around pt-2'>
        <div className='flex-none ml-1'>
          <div>
            <NavLinks />
          </div>
        </div>
        <div className='flex-1 my-auto'>
          <div className='text-center'>
            <h1 className='text-xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono'>
              D<span className='text-dc-red'>3</span>F C
              <span className='text-dc-red'>0</span>N
            </h1>
          </div>
        </div>
        <div className='flex text-right mr-5'>
          <button type='button' onClick={() => eventBookmark()}>
            {bookmark ? (
              <StarIconSoild className='w-7 mr-3' />
            ) : (
              <StarIconOutline className='w-7 mr-3' />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default EventDetailHeading;
