import { useEffect, useState } from "react";
import { createDateGroup } from "../../utils/dates";
import Events from "../events/Events";
import EventHeading from "../heading/EventHeading";
import { getBookmarks } from "../../utils/storage";

function Bookmarks({ events, title }: ScheduleProps) {
  const [bookmarkedEvents, setBookmarkedEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const bookmarks = getBookmarks();
    const bEvents = events.filter((e) => bookmarks.includes(e.id));
    setBookmarkedEvents(bEvents);
  }, [events]);

  const dateGroup = createDateGroup(bookmarkedEvents);

  const headingEvents: EventSearch[] = bookmarkedEvents
    .map((e) => ({
      title: e.title,
      id: e.id,
      color: e.color,
    }))
    .sort((a, b) => {
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      }
      return -1;
    });

  return (
    <div>
      <EventHeading events={headingEvents} />
      <Events dateGroup={dateGroup} title={title} />
    </div>
  );
}

export default Bookmarks;
