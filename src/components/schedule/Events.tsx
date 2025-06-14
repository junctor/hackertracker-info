"use client";

import React from "react";
import EventsTable from "./EventsTable";

export default function Events({
  events,
}: {
  events: { [key: string]: EventData[] };
}) {
  return (
    <>
      <div className="w-full mb-5">
        <EventsTable dateGroup={events} />
      </div>
    </>
  );
}
