import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/outline";
import { EventProps } from "./ht";
import { Theme } from "./theme";
import { addBookmark, removeBookmark } from "./utils";
import EventDetail from "./EventDetail";
import SpeakerBio from "./SpeakerBio";

const Events = ({ events, speakers, localTime }: EventProps) => {
  const eventId = new URLSearchParams(document.location.search).get("event");

  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const showEvent = (eventShow: string) => {
    const content = document.getElementById(eventShow);
    content?.classList.toggle("hidden");
  };

  useEffect(() => {
    const lsBookmarks: string[] =
      JSON.parse(localStorage.getItem("bookmarks") ?? "[]") ?? [];
    setBookmarks(lsBookmarks);
  }, []);

  const theme = new Theme();

  return (
    <div id='events'>
      {Object.entries(events).map(([day, dayEvents]) => (
        <div key={day}>
          <div className='date-events'>
            <div
              className={`sticky top-0 z-100 border-4 border-${theme.color} bg-black`}>
              <p className='text-gray-light text-xl p-1 ml-3'>{day}</p>
            </div>
            {dayEvents.sort().map((data) => (
              <div className='event' key={data.id} aria-hidden='true'>
                <div>
                  <div key={data.id} className='event-title'>
                    <div
                      role='button'
                      tabIndex={data.id}
                      onClick={() => showEvent(data.id.toString())}
                      onKeyDown={() => showEvent(data.id.toString())}>
                      <div>
                        <h2 className='text-green text-xl'>
                          {data.title}
                          {bookmarks.includes(data.id.toString()) ? (
                            <StarIcon
                              className='ml-3 h-6 w-6 inline-block text-orange'
                              onClick={(e) => {
                                setBookmarks(() =>
                                  bookmarks.filter(
                                    (b) => b !== data.id.toString()
                                  )
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
                        <p className='text-yellow text-sm'>
                          {data.speakers.map((s) => s.name).join(", ")}
                        </p>

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
                  <div
                    id={data.id.toString()}
                    className={`event-content ${eventId ? "" : "hidden"}`}>
                    <EventDetail event={data} localTime={localTime} />
                    <div id={`speakers-${data.id}`} className='mt-5'>
                      {data.speakers.map((s) => {
                        const speaker = speakers.find((sp) => sp.id === s.id);
                        if (speaker && speaker.description) {
                          return (
                            <div className='mt-3' key={s.id}>
                              <SpeakerBio speaker={speaker} />
                            </div>
                          );
                        }
                        return <div />;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Events;
