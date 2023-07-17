import TVEvents from "./TVEvents";

function TV({ events }: { events: TVEventData[] }) {
  return <TVEvents events={events} />;
}

export default TV;
