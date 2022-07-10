import { EventDetailHeading } from "../heading/EventDetailsHeading";
import EventDetails from "./EventDetails";

function Event({ event }: EventDetailProps) {
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
}

export default Event;
