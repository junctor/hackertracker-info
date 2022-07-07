import { createDateGroup } from "../../utils/dates";
import Events from "./Events";
import EventHeading from "../heading/EventHeading";

export const Schedule = ({ events, title }: ScheduleProps) => {
  let dateGroup = createDateGroup(events);

  let headingEvents: EventSearch[] = events
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

export default Schedule;
