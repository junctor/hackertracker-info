import { memo, useEffect, useState } from "react";
import { createDateGroup } from "../../utils/dates";
import Events from "../events/Events";
import EventHeading from "../heading/EventHeading";
import { getBookmarks } from "../../utils/storage";

export const Bookmarks = ({ events, title }: ScheduleProps) => {
  let [bookmarkedEvents, setBookmarkedEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const bookmarks = getBookmarks();
    const bEvents = events.filter((e) => bookmarks.includes(e.id));
    setBookmarkedEvents(bEvents);
  }, [events]);

  let dateGroup = createDateGroup(bookmarkedEvents);

  let headingEvents: EventSearch[] = bookmarkedEvents
    .map((e) => ({
      title: e.title,
      id: e.id,
      color: e.color,
    }))
    .sort((a, b) => {
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      } else {
        return -1;
      }
    });

  return (
    <div>
      <EventHeading events={headingEvents} />
      <Events dateGroup={dateGroup} title={title} />
    </div>
  );
};

export default Bookmarks;
