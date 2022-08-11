import { EventDetailHeading } from "../heading/EventDetailsHeading";
import EventDetails from "./EventDetails";

function Event({ event, tags }: EventDetailProps) {
  return (
    <div>
      {event && (
        <>
          <EventDetailHeading eventId={event.id} />
          <EventDetails event={event} tags={tags} />
        </>
      )}{" "}
    </div>
  );
}

export default Event;
