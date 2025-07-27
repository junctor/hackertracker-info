import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TVEventCell from "./TVEventCell";
import React from "react";
import { GroupedSchedule, ScheduleEvent } from "@/types/info";
import TVClock from "./TVClock";
import { tabDateTitle } from "@/lib/dates";

function TV({ dateGroup }: { dateGroup: GroupedSchedule }) {
  const [filteredEvents, setFilteredEvents] = useState<
    Map<string, ScheduleEvent[]>
  >(new Map());

  const { l, tag, h, debug } = useRouter().query;
  const debugMode = debug === "true";
  const tagId = tag ? Number(tag) : null;
  const location = l ? String(l).toLowerCase() : "";
  const nowMs = Date.now();
  const windowMs = Number(h ?? 6) * 3_600_000;
  const cutoffMs = nowMs + windowMs;

  useEffect(() => {
    const out = new Map<string, ScheduleEvent[]>();

    Object.entries(dateGroup).forEach(([day, events]) => {
      const dayMs = new Date(day).getTime();
      if (!debugMode && dayMs < nowMs) return;

      const upcoming = events.filter((ev) => {
        const startMs = (ev.beginTimestampSeconds ?? 0) * 1000;
        const inWindow = debugMode || (startMs >= nowMs && startMs <= cutoffMs);
        const matchesTag = tagId ? ev.tags.some((t) => t.id === tagId) : true;
        const matchesLoc = location
          ? ev.location?.toLowerCase().includes(location)
          : true;

        return inWindow && matchesTag && matchesLoc;
      });

      if (upcoming.length) {
        out.set(day, upcoming);
      }
    });

    setFilteredEvents(out);
  }, [dateGroup, l, tag, h, debugMode]);

  useEffect(() => {
    let frame: number;
    const stepPx = 1;

    const loop = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight;

      if (atBottom) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollBy({ top: stepPx, left: 0 });
      }

      frame = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex justify-end mb-2 mr-14 ml-5">
      <div className="flex-initial w-full mr-2">
        {Array.from(filteredEvents.entries()).map(([day, events]) => (
          <div key={day} className="date-events mb-6">
            <div className="border-4 border-[#6CE] rounded-b-lg">
              <p className="text-[#E67] text-4xl p-2 ml-1 font-extrabold">
                {tabDateTitle(day)}
              </p>
            </div>
            {events
              .sort(
                (a, b) =>
                  (a.beginTimestampSeconds ?? 0) -
                  (b.beginTimestampSeconds ?? 0)
              )
              .map((ev) => (
                <div className="event" key={ev.id} aria-hidden="true">
                  <TVEventCell event={ev} />
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="flex-initial ml-5 mt-4">
        <div className="sticky top-36 z-100">
          <p className="text-center text-9xl mb-10 font-bold text-[#6CE]">
            NFO Node
          </p>
          <p className="text-xl font-bold">Current time:</p>
          <TVClock />
        </div>
      </div>
    </div>
  );
}

export default TV;
