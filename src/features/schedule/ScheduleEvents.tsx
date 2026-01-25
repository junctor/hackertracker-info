import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { eventDayTable, tabDateTitle } from "@/lib/dates";
import ScheduleEventRow from "./ScheduleEventRow";
import { GroupedSchedule } from "@/lib/types/info";
import { BookmarkIcon, TagIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ScheduleEvents({
  dateGroup,
  bookmarks,
}: {
  dateGroup: GroupedSchedule;
  bookmarks: number[];
}) {
  const TAB_TOP = 60;
  const TAB_HEIGHT = 56;
  const SCROLL_OFFSET = TAB_TOP + TAB_HEIGHT;

  const days = useMemo(
    () => Object.entries(dateGroup).map(([day, events]) => ({ day, events })),
    [dateGroup]
  );

  const [activeDays, setActiveDays] = useState<string[]>([]);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const day = entry.target.getAttribute("data-day")!;
          // When any part of the section is in view, mark it active
          if (entry.isIntersecting) {
            setActiveDays((prev) =>
              prev.includes(day) ? prev : [...prev, day]
            );
          } else {
            setActiveDays((prev) => prev.filter((d) => d !== day));
          }
        });
      },
      {
        rootMargin: `-${SCROLL_OFFSET}px 0px 0px 0px`,
        threshold: 0,
      }
    );

    Object.values(sectionRefs.current).forEach(
      (el) => el && observer.observe(el)
    );
    return () => observer.disconnect();
  }, [days, SCROLL_OFFSET]);

  const scrollToDay = useCallback(
    (day: string) => {
      const el = sectionRefs.current[day];
      if (!el) return;
      const top =
        el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    },
    [SCROLL_OFFSET]
  );

  return (
    <div className="min-h-screen text-gray-100">
      {/* Top toolbar */}
      <div className="sticky top-0 z-40 flex justify-end gap-2 border-b border-gray-800 bg-black/80 p-2 backdrop-blur">
        <Link
          href="/bookmarks"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent text-gray-300 transition hover:border-gray-700 hover:text-white"
          aria-label="Filter by bookmarks"
        >
          <BookmarkIcon className="h-5 w-5" />
        </Link>
        <Link
          href="/tags"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent text-gray-300 transition hover:border-gray-700 hover:text-white"
          aria-label="Filter by tags"
        >
          <TagIcon className="h-5 w-5" />
        </Link>
      </div>

      {/* Sticky day tabs */}
      {/* TODO: Design polish for day tabs and schedule table layout. */}
      <div className="sticky top-[60px] z-30 flex flex-wrap justify-center gap-2 border-b border-gray-800 bg-black/80 py-2 backdrop-blur">
        {days.map(({ day }) => (
          <button
            key={day}
            className={`mx-1 rounded-full border px-3 py-1 text-sm transition ${
              activeDays.includes(day)
                ? "border-indigo-400 bg-indigo-500/20 text-indigo-100"
                : "border-gray-700 text-gray-200 hover:border-indigo-400 hover:text-white"
            }`}
            onClick={() => scrollToDay(day)}
            aria-current={activeDays.includes(day) ? "date" : undefined}
          >
            {tabDateTitle(day)}
          </button>
        ))}
      </div>

      {/* Day sections */}
      {days.map(({ day, events }) => (
        <section
          key={day}
          ref={(el: HTMLDivElement | null) => {
            sectionRefs.current[day] = el;
          }}
          data-day={day}
        >
          <h2 className="scroll-mt-[116px] font-bold text-xl md:text-2xl ml-5 mt-6 mb-3 text-gray-100">
            {eventDayTable(day)}
          </h2>
          <div className="overflow-x-auto px-5">
            <table className="w-full mb-8 min-w-full table-fixed border-collapse">
              <colgroup>
                <col className="w-1/12 min-w-0" />
                <col className="w-2/12 min-w-0" />
                <col className="w-8/12 min-w-0" />
                <col className="w-1/12 min-w-0" />
              </colgroup>

              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-2 py-2 text-left" />
                  <th scope="col" className="px-2 py-2 text-left font-semibold">
                    Time
                  </th>
                  <th scope="col" className="px-2 py-2 text-left font-semibold">
                    Event
                  </th>
                  <th scope="col" className="px-2 py-2 text-right" />
                </tr>
              </thead>

              <tbody>
                {events.map((evt) => (
                  <ScheduleEventRow
                    key={evt.id}
                    event={evt}
                    isBookmarked={bookmarks.includes(evt.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
