import TVEvents from "./TVEvents";

function TV({ events }: { events: EventData[] }) {
  return <TVEvents events={events} />;
}

export default TV;
