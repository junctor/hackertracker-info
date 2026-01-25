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
    [dateGroup],
  );

  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  const initialDay = useMemo(() => {
    if (days.length === 0) return null;
    const now = Date.now();
    for (const { day, events } of days) {
      for (const event of events) {
        const begin = Date.parse(event.begin);
        const end = Date.parse(event.end);
        if (!Number.isNaN(begin) && !Number.isNaN(end)) {
          if (begin <= now && now <= end) {
            return day;
          }
        }
      }
    }
    return days[0].day;
  }, [days]);

  const [selectedDay, setSelectedDay] = useState<string | null>(initialDay);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selectedDay || !days.some(({ day }) => day === selectedDay)) {
      setSelectedDay(initialDay);
    }
  }, [days, initialDay, selectedDay]);

  const resolvedDay = selectedDay ?? days[0]?.day ?? null;

  useEffect(() => {
    if (!resolvedDay || !panelRef.current) return;
    const top =
      panelRef.current.getBoundingClientRect().top +
      window.scrollY -
      SCROLL_OFFSET;
    window.scrollTo({ top, behavior: "auto" });
  }, [resolvedDay, SCROLL_OFFSET]);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number, day: string) => {
      if (days.length === 0) return;
      const lastIndex = days.length - 1;
      let nextIndex = index;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          nextIndex = index === 0 ? lastIndex : index - 1;
          break;
        case "ArrowRight":
          e.preventDefault();
          nextIndex = index === lastIndex ? 0 : index + 1;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = lastIndex;
          break;
        case "Enter":
          if (selectedDay !== day) {
            setSelectedDay(day);
          }
          return;
        case " ":
          e.preventDefault();
          if (selectedDay !== day) {
            setSelectedDay(day);
          }
          return;
        default:
          return;
      }

      const nextDay = days[nextIndex].day;
      setSelectedDay(nextDay);
      tabButtonRefs.current[nextDay]?.focus();
    },
    [days, selectedDay],
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
      <div
        className="sticky top-15 z-30 flex items-center gap-2 overflow-x-auto border-b border-gray-800 bg-black/80 px-2 py-2 backdrop-blur"
        role="tablist"
        aria-label="Schedule days"
      >
        {days.map(({ day, events }, index) => (
          <button
            key={day}
            ref={(el) => {
              tabButtonRefs.current[day] = el;
            }}
            id={`day-tab-${day}`}
            role="tab"
            aria-selected={resolvedDay === day}
            aria-controls={`day-panel-${day}`}
            className={`mx-1 flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-sm transition ${
              resolvedDay === day
                ? "border-indigo-400 bg-indigo-500/20 text-indigo-100"
                : "border-gray-700 text-gray-200 hover:border-indigo-400 hover:text-white"
            }`}
            onClick={() => setSelectedDay(day)}
            onKeyDown={(e) => handleTabKeyDown(e, index, day)}
          >
            <span>{tabDateTitle(day)}</span>
            <span className="text-xs text-gray-400">({events.length})</span>
          </button>
        ))}
      </div>

      {/* Day sections */}
      {resolvedDay &&
        days
          .filter(({ day }) => day === resolvedDay)
          .map(({ day, events }) => (
            <section
              key={day}
              ref={(el) => {
                panelRef.current = el;
              }}
              id={`day-panel-${day}`}
              role="tabpanel"
              aria-labelledby={`day-tab-${day}`}
              tabIndex={0}
            >
              <h2 className="scroll-mt-29 font-bold text-xl md:text-2xl ml-5 mt-6 mb-3 text-gray-100">
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
                      <th
                        scope="col"
                        className="px-2 py-2 text-left font-semibold"
                      >
                        Time
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-2 text-left font-semibold"
                      >
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
                        isBookmarked={bookmarkSet.has(evt.id)}
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
