import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/outline";
import { SpeakerDetailProps } from "./ht";
import { addBookmark, removeBookmark } from "./utils";
import EventDetail from "./EventDetail";

const SpeakerDetails = ({ speaker, localTime }: SpeakerDetailProps) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const lsBookmarks: string[] =
      JSON.parse(localStorage.getItem("bookmarks") ?? "[]") ?? [];
    setBookmarks(lsBookmarks);
  }, []);

  const showEvent = (eventShow: string) => {
    const content = document.getElementById(eventShow);
    content?.classList.toggle("hidden");
  };

  return (
    <div>
      <div className='cursor-text text-gray-light'>{speaker.description}</div>
      {speaker.events.map((data) => (
        <div
          className='event'
          key={`${speaker.id}-${data.id}`}
          aria-hidden='true'>
          <div>
            <div className='event-title'>
              <div
                role='button'
                tabIndex={speaker.id}
                onClick={() => showEvent(`${speaker.id}-${data.id}`)}
                onKeyDown={() => showEvent(`${speaker.id}-${data.id}`)}>
                <div>
                  <h2 className='text-green text-xl'>
                    {data.title}
                    {bookmarks.includes(data.id.toString()) ? (
                      <StarIcon
                        className='ml-3 h-6 w-6 inline-block text-orange'
                        onClick={(e) => {
                          setBookmarks(() =>
                            bookmarks.filter((b) => b !== data.id.toString())
                          );
                          removeBookmark(data.id.toString());
                          e.stopPropagation();
                        }}
                      />
                    ) : (
                      <StarIconOutline
                        className='ml-3 h-6 w-6 inline-block text-orange'
                        onClick={(e) => {
                          setBookmarks(() => [
                            ...bookmarks,
                            data.id.toString(),
                          ]);
                          addBookmark(data.id.toString());
                          e.stopPropagation();
                        }}
                      />
                    )}
                  </h2>
                  <p className='text-gray mt-1'>{data.location.name}</p>
                  <div className='flex mt-3'>
                    <div
                      className='type-circle flex-initial'
                      style={{
                        backgroundColor:
                          data.type.color === "#ababa"
                            ? "#e25238"
                            : data.type.color,
                      }}
                    />
                    <span className='flex-initial ml-2 text-gray-light'>
                      {data.type.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div id={`${speaker.id}-${data.id}`} className='hidden'>
              <EventDetail event={data} localTime={localTime} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default SpeakerDetails;
