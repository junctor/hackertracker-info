import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { BookmarkIcon, TagIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { eventDayTable, tabDateTitle } from "@/lib/dates";
import ScheduleEventItem from "./ScheduleEventItem";
import { ConferenceManifest } from "@/lib/conferences";
import type { GroupedSchedule, ScheduleEvent } from "@/lib/types/info";
import { Virtuoso } from "react-virtuoso";

export type ScheduleEventViewModel = {
  id: number;
  title: string;
  begin: string;
  end: string;
  beginTimestampSeconds: number;
  endTimestampSeconds: number;
  color: string;
  contentId: number;
  locationName: string;
  tags: Array<{
    id: number;
    label: string;
    colorBackground: string;
    colorForeground?: string;
  }>;
  speakers: string | null;
  beginDisplay: string;
  beginIso: string;
  endDisplay: string;
  endIso: string;
};

export type ScheduleDay = {
  day: string;
  events: ScheduleEventViewModel[];
};

type VirtuosoListProps = React.ComponentPropsWithoutRef<"div">;
type VirtuosoItemProps = React.ComponentPropsWithoutRef<"li">;

const VirtuosoList = React.forwardRef<HTMLDivElement, VirtuosoListProps>(
  function VirtuosoList({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={["mb-8", className].filter(Boolean).join(" ")}
      />
    );
  },
);
VirtuosoList.displayName = "VirtuosoList";

const VirtuosoItem = React.forwardRef<HTMLLIElement, VirtuosoItemProps>(
  function VirtuosoItem({ className, ...props }, ref) {
    return (
      <li
        ref={ref}
        {...props}
        className={["mb-3 last:mb-0", className].filter(Boolean).join(" ")}
      />
    );
  },
);
VirtuosoItem.displayName = "VirtuosoItem";

const VIRTUOSO_COMPONENTS = {
  List: VirtuosoList,
  Item: VirtuosoItem,
};

export function buildScheduleDaysFromGrouped(
  dateGroup: GroupedSchedule,
): ScheduleDay[] {
  return Object.entries(dateGroup)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, events]) => {
      const mapped = (events as ScheduleEvent[]).map((event) => {
        const beginTimestampSeconds = Math.floor(
          Date.parse(event.begin) / 1000,
        );
        const endTimestampSeconds = Math.floor(Date.parse(event.end) / 1000);
        const speakers = event.speakers?.trim();

        return {
          id: event.id,
          title: event.title,
          begin: event.begin,
          end: event.end,
          beginTimestampSeconds,
          endTimestampSeconds,
          color: event.color ?? "#fff",
          contentId: event.content_id,
          locationName: event.location ?? "Unknown location",
          tags: event.tags.map((tag) => ({
            id: tag.id,
            label: tag.label,
            colorBackground: tag.color_background,
            colorForeground: tag.color_foreground,
          })),
          speakers: speakers && speakers.length > 0 ? speakers : null,
          beginDisplay: event.beginDisplay,
          beginIso: event.beginIso,
          endDisplay: event.endDisplay,
          endIso: event.endIso,
        } satisfies ScheduleEventViewModel;
      });

      return { day, events: mapped };
    });
}

export default function ScheduleEvents({
  conf,
  days,
  selectedDay,
  onSelectDay,
  bookmarks,
}: {
  conf: ConferenceManifest;
  days: ScheduleDay[];
  selectedDay: string;
  onSelectDay: (day: string) => void;
  bookmarks: number[];
}) {
  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const resolvedDay = useMemo(() => {
    if (selectedDay && days.some(({ day }) => day === selectedDay)) {
      return selectedDay;
    }
    return days[0]?.day ?? "";
  }, [days, selectedDay]);

  useEffect(() => {
    if (!resolvedDay) return;
    const heading = headingRef.current;
    if (!heading) return;
    const rect = heading.getBoundingClientRect();
    if (rect.top < 0 || rect.top > window.innerHeight) {
      heading.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [resolvedDay]);

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
          if (resolvedDay !== day) {
            onSelectDay(day);
          }
          return;
        case " ":
          e.preventDefault();
          if (resolvedDay !== day) {
            onSelectDay(day);
          }
          return;
        default:
          return;
      }

      const nextDay = days[nextIndex]?.day;
      if (!nextDay) return;
      onSelectDay(nextDay);
      tabButtonRefs.current[nextDay]?.focus();
    },
    [days, onSelectDay, resolvedDay],
  );

  const activeDay = days.find(({ day }) => day === resolvedDay) ?? null;
  const itemContent = useCallback(
    (_: number, evt: ScheduleEventViewModel) => (
      <ScheduleEventItem
        conf={conf}
        event={evt}
        isBookmarked={bookmarkSet.has(evt.id)}
      />
    ),
    [bookmarkSet, conf],
  );

  return (
    <div className="min-h-screen text-gray-100">
      <div className="sticky top-0 z-40 flex justify-end gap-2 border-b border-gray-800 bg-black/80 p-2 backdrop-blur">
        <Link
          href={`/${conf.slug}/bookmarks`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent text-gray-300 transition hover:border-gray-700 hover:text-white"
          aria-label="Filter by bookmarks"
        >
          <BookmarkIcon className="h-5 w-5" />
        </Link>
        <Link
          href={`/${conf.slug}/tags`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent text-gray-300 transition hover:border-gray-700 hover:text-white"
          aria-label="Filter by tags"
        >
          <TagIcon className="h-5 w-5" />
        </Link>
      </div>

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
            onClick={() => onSelectDay(day)}
            onKeyDown={(e) => handleTabKeyDown(e, index, day)}
          >
            <span>{tabDateTitle(day, conf.timezone)}</span>
            <span className="text-xs text-gray-400">({events.length})</span>
          </button>
        ))}
      </div>

      {activeDay && (
        <section
          id={`day-panel-${activeDay.day}`}
          role="tabpanel"
          aria-labelledby={`day-tab-${activeDay.day}`}
          tabIndex={0}
        >
          <h2
            ref={headingRef}
            className="scroll-mt-29 ml-5 mt-6 mb-3 text-xl font-bold text-gray-100 md:text-2xl"
          >
            {eventDayTable(activeDay.day, conf.timezone)}
          </h2>
          <div className="px-5">
            <Virtuoso
              useWindowScroll
              data={activeDay.events}
              computeItemKey={(_: number, evt: ScheduleEventViewModel) =>
                evt.id
              }
              components={VIRTUOSO_COMPONENTS}
              itemContent={itemContent}
            />
          </div>
        </section>
      )}
    </div>
  );
}
