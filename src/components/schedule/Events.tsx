"use client";

import React from "react";
import EventsTable from "./EventsTable";
import { GroupedSchedule } from "@/types/scheduleTypes";

export default function Events({ events }: { events: GroupedSchedule }) {
  return (
    <>
      <div className="w-full mb-5">
        <EventsTable dateGroup={events} />
      </div>
    </>
  );
}
