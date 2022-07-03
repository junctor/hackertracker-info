import { EventDetailHeading } from "../heading/EventDetailsHeading";
import NavLinks from "../heading/NavLinks";
import EventDetails from "./EventDetails";

export const Event = ({ event }: EventDetailProps) => {
  return (
    <div>
      {event && (
        <>
          <EventDetailHeading eventId={event.id} />
          <EventDetails event={event} />
        </>
      )}{" "}
    </div>
  );
};

export default Event;
