import TVEvents from "./TVEvents";
import React from "react";

function TV({ events }: { events: EventData[] }) {
  return <TVEvents events={events} />;
}

export default TV;
