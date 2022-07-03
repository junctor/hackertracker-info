import { memo, useEffect, useMemo, useRef, useState } from "react";
import { createDateGroup, groupedDates } from "../../utils/dates";
import NavLinks from "../heading/NavLinks";
import { SearchIcon } from "@heroicons/react/outline";
import Events from "./Events";
import Loading from "../misc/Loading";
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
      <EventHeading events={headingEvents} title={title} />
      <Events dateGroup={dateGroup} />
    </div>
  );
};

export default Schedule;
