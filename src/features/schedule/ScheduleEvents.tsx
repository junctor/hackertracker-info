import { BookmarkIcon, TagIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { Virtuoso, type Components, type ItemProps, type ListProps } from "react-virtuoso";

import type { GroupedSchedule, ScheduleEvent } from "@/lib/types/info";

import { ConferenceManifest } from "@/lib/conferences";
import { eventDayTable, tabDateTitle } from "@/lib/dates";

import ScheduleEventItem from "./ScheduleEventItem";

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

type VirtuosoContext = unknown;
type VirtuosoListProps = ListProps & { context: VirtuosoContext };
type VirtuosoItemProps = ItemProps<ScheduleEventViewModel> & {
  context: VirtuosoContext;
};

const VirtuosoList = React.forwardRef<HTMLDivElement, VirtuosoListProps>(function VirtuosoList(
  { children, style, "data-testid": dataTestId },
  ref,
) {
  return (
    <ul
      ref={ref as unknown as React.Ref<HTMLUListElement>}
      style={style}
      data-testid={dataTestId}
      className="mb-8 list-none p-0"
    >
      {children}
    </ul>
  );
});
VirtuosoList.displayName = "VirtuosoList";

function VirtuosoItem({ children, style, context, item, ...itemProps }: VirtuosoItemProps) {
  void context;
  void item;
  return (
    <li {...itemProps} style={style} className="mb-3 last:mb-0">
      {children}
    </li>
  );
}
VirtuosoItem.displayName = "VirtuosoItem";

const VIRTUOSO_COMPONENTS: Components<ScheduleEventViewModel, VirtuosoContext> = {
  List: VirtuosoList,
  Item: VirtuosoItem,
};

const SITE_HEADER_OFFSET_PX = 64;

export function buildScheduleDaysFromGrouped(dateGroup: GroupedSchedule): ScheduleDay[] {
  return Object.entries(dateGroup)
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([day, events]) => {
      const mapped = (events as ScheduleEvent[]).map((event) => {
        const beginTimestampSeconds = Math.floor(Date.parse(event.begin) / 1000);
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
  nowSeconds = 0,
}: {
  conf: ConferenceManifest;
  days: ScheduleDay[];
  selectedDay: string;
  // eslint-disable-next-line no-unused-vars
  onSelectDay: (day: string) => void;
  bookmarks: number[];
  nowSeconds?: number;
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
    if (!heading || typeof window === "undefined") return;
    const rect = heading.getBoundingClientRect();
    if (rect.top < SITE_HEADER_OFFSET_PX || rect.bottom > window.innerHeight) {
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
          e.preventDefault();
          if (resolvedDay !== day) {
            onSelectDay(day);
          }
          return;
        case " ":
        case "Spacebar":
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
      const nextButton = tabButtonRefs.current[nextDay];
      nextButton?.focus();
      nextButton?.scrollIntoView({ block: "nearest", inline: "nearest" });
    },
    [days, onSelectDay, resolvedDay],
  );

  const activeDay = days.find(({ day }) => day === resolvedDay) ?? null;
  const computeItemKey = useCallback((_: number, evt: ScheduleEventViewModel) => evt.id, []);
  const itemContent = useCallback(
    (_: number, evt: ScheduleEventViewModel) => (
      <ScheduleEventItem
        conf={conf}
        event={evt}
        isBookmarked={bookmarkSet.has(evt.id)}
        nowSeconds={nowSeconds}
      />
    ),
    [bookmarkSet, conf, nowSeconds],
  );

  return (
    <div className="text-slate-100">
      <div className="ui-topbar">
        <div className="ui-container flex justify-end gap-2 py-2">
          <Link
            href={`/${conf.slug}/bookmarks`}
            className="ui-icon-btn ui-focus-ring focus-visible:outline-none"
            aria-label="Filter by bookmarks"
          >
            <BookmarkIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            href={`/${conf.slug}/tags`}
            className="ui-icon-btn ui-focus-ring focus-visible:outline-none"
            aria-label="Filter by tags"
          >
            <TagIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="sticky top-16 z-40 border-t border-white/10">
        <div
          className="ui-topbar border-b border-white/10"
          role="tablist"
          aria-label="Schedule days"
          aria-orientation="horizontal"
        >
          <div className="ui-container overflow-x-auto py-2">
            <div className="flex min-w-max items-center gap-2">
              {days.map(({ day, events }, index) => (
                <button
                  key={day}
                  ref={(el) => {
                    tabButtonRefs.current[day] = el;
                  }}
                  id={`day-tab-${day}`}
                  type="button"
                  role="tab"
                  aria-selected={resolvedDay === day}
                  aria-controls={`day-panel-${day}`}
                  tabIndex={resolvedDay === day ? 0 : -1}
                  className={`ui-focus-ring flex h-10 items-center gap-1 rounded-full border px-3 text-sm whitespace-nowrap transition-colors focus-visible:outline-none ${
                    resolvedDay === day
                      ? "border-[#017FA4]/80 bg-[#0D294A]/55 text-white"
                      : "border-slate-700/85 bg-slate-900/55 text-slate-200 hover:border-[#017FA4]/70 hover:text-slate-100"
                  }`}
                  onClick={() => onSelectDay(day)}
                  onKeyDown={(e) => handleTabKeyDown(e, index, day)}
                >
                  <span>{tabDateTitle(day, conf.timezone)}</span>
                  <span
                    className={`text-xs ${resolvedDay === day ? "text-[#6CCDBB]" : "text-slate-400"}`}
                  >
                    ({events.length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
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
            className="ui-container mt-6 mb-3 scroll-mt-28 text-xl font-bold text-slate-100 md:text-2xl"
          >
            {eventDayTable(activeDay.day, conf.timezone)}
          </h2>
          <div className="ui-container">
            <Virtuoso
              useWindowScroll
              data={activeDay.events}
              computeItemKey={computeItemKey}
              components={VIRTUOSO_COMPONENTS}
              itemContent={itemContent}
              increaseViewportBy={{ top: 200, bottom: 400 }}
            />
          </div>
        </section>
      )}
    </div>
  );
}
