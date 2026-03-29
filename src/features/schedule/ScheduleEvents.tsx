import { BookmarkIcon, TagIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const SITE_HEADER_FALLBACK_HEIGHT_PX = 64;
const STICKY_HEADING_CLEARANCE_PX = 16;

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
  activeFilter = null,
}: {
  conf: ConferenceManifest;
  days: ScheduleDay[];
  selectedDay: string;
  // eslint-disable-next-line no-unused-vars
  onSelectDay: (day: string) => void;
  bookmarks: number[];
  nowSeconds?: number;
  activeFilter?: "bookmarks" | "tags" | null;
}) {
  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const stickyTabsRef = useRef<HTMLDivElement | null>(null);
  const [siteHeaderHeight, setSiteHeaderHeight] = useState(SITE_HEADER_FALLBACK_HEIGHT_PX);
  const [stickyTabsHeight, setStickyTabsHeight] = useState(0);

  const resolvedDay = useMemo(() => {
    if (selectedDay && days.some(({ day }) => day === selectedDay)) {
      return selectedDay;
    }
    return days[0]?.day ?? "";
  }, [days, selectedDay]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const siteHeader = document.querySelector<HTMLElement>("header.ui-topbar");
    if (!siteHeader) return;

    const updateSiteHeaderHeight = () => {
      setSiteHeaderHeight(Math.ceil(siteHeader.getBoundingClientRect().height));
    };

    updateSiteHeaderHeight();

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateSiteHeaderHeight) : null;

    resizeObserver?.observe(siteHeader);
    window.addEventListener("resize", updateSiteHeaderHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateSiteHeaderHeight);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stickyTabs = stickyTabsRef.current;
    if (!stickyTabs) return;

    const updateStickyTabsHeight = () => {
      setStickyTabsHeight(Math.ceil(stickyTabs.getBoundingClientRect().height));
    };

    updateStickyTabsHeight();

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateStickyTabsHeight) : null;

    resizeObserver?.observe(stickyTabs);
    window.addEventListener("resize", updateStickyTabsHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateStickyTabsHeight);
    };
  }, []);

  const headingScrollOffsetPx = siteHeaderHeight + stickyTabsHeight + STICKY_HEADING_CLEARANCE_PX;
  const stickyTabsTopStyle = useMemo(() => ({ top: `${siteHeaderHeight}px` }), [siteHeaderHeight]);
  const headingScrollStyle = useMemo(
    () => ({ scrollMarginTop: `${headingScrollOffsetPx}px` }),
    [headingScrollOffsetPx],
  );

  useEffect(() => {
    if (!resolvedDay) return;
    const heading = headingRef.current;
    if (!heading || typeof window === "undefined") return;
    const rect = heading.getBoundingClientRect();
    if (rect.top < headingScrollOffsetPx || rect.bottom > window.innerHeight) {
      const top = window.scrollY + rect.top - headingScrollOffsetPx;
      window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
    }
  }, [headingScrollOffsetPx, resolvedDay]);

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
  const isBookmarksFilterActive = activeFilter === "bookmarks";
  const isTagsFilterActive = activeFilter === "tags";
  const activeDayLabel = activeDay ? eventDayTable(activeDay.day, conf.timezone) : null;
  const activeDayEventCountLabel = activeDay
    ? `${activeDay.events.length} ${activeDay.events.length === 1 ? "event" : "events"}`
    : null;
  const utilityLinkBaseClassName =
    "ui-btn-base ui-focus-ring group min-h-10 gap-2 rounded-xl border px-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus-visible:outline-none max-[320px]:w-10 max-[320px]:justify-center max-[320px]:px-0";
  const activeFilterClassName =
    "border-[#017FA4]/28 bg-[#0D294A]/42 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]";
  const inactiveFilterClassName =
    "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/14 hover:bg-white/[0.05] hover:text-slate-100";
  const utilityIconBaseClassName = "h-4.5 w-4.5 shrink-0 transition-colors";
  const activeUtilityIconClassName = "text-[#6CCDBB]";
  const inactiveUtilityIconClassName = "text-slate-400 group-hover:text-slate-200";
  const dayTabTrayClassName =
    "rounded-[1.2rem] border border-white/10 bg-white/[0.035] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";
  const dayTabBaseClassName =
    "ui-focus-ring group relative flex min-h-11 items-center gap-2 rounded-[0.95rem] border px-3.5 py-2 text-sm whitespace-nowrap transition duration-200 ease-out focus-visible:outline-none";
  const activeDayTabClassName =
    "border-[#017FA4]/30 bg-[#0D294A]/58 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]";
  const inactiveDayTabClassName =
    "border-transparent bg-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-slate-100";
  const activeDayCountClassName =
    "rounded-full border border-[#017FA4]/26 bg-[#017FA4]/12 px-2 py-0.5 text-[11px] font-semibold tracking-[0.02em] text-[#9FE4D7]";
  const inactiveDayCountClassName =
    "rounded-full border border-white/8 bg-black/15 px-2 py-0.5 text-[11px] font-semibold tracking-[0.02em] text-slate-400 transition-colors group-hover:text-slate-200";

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
      <div className="ui-container flex justify-end py-3">
        <nav aria-label="Schedule tools">
          <div className="flex items-center gap-2">
            <Link
              href={`/${conf.slug}/bookmarks`}
              className={`${utilityLinkBaseClassName} ${
                isBookmarksFilterActive ? activeFilterClassName : inactiveFilterClassName
              }`}
              aria-label="View bookmarked events"
              aria-current={isBookmarksFilterActive ? "page" : undefined}
            >
              <BookmarkIcon
                className={`${utilityIconBaseClassName} ${
                  isBookmarksFilterActive
                    ? activeUtilityIconClassName
                    : inactiveUtilityIconClassName
                }`}
                aria-hidden="true"
              />
              <span className="font-semibold tracking-[-0.01em] max-[320px]:sr-only">
                Bookmarks
              </span>
            </Link>

            <Link
              href={`/${conf.slug}/tags`}
              className={`${utilityLinkBaseClassName} ${
                isTagsFilterActive ? activeFilterClassName : inactiveFilterClassName
              }`}
              aria-label="Browse schedule tags"
              aria-current={isTagsFilterActive ? "page" : undefined}
            >
              <TagIcon
                className={`${utilityIconBaseClassName} ${
                  isTagsFilterActive ? activeUtilityIconClassName : inactiveUtilityIconClassName
                }`}
                aria-hidden="true"
              />
              <span className="font-semibold tracking-[-0.01em] max-[320px]:sr-only">Tags</span>
            </Link>
          </div>
        </nav>
      </div>

      <div
        ref={stickyTabsRef}
        className="ui-topbar sticky z-40 border-y border-white/8 bg-[color-mix(in_oklab,var(--color-bg),transparent_3%)] shadow-[0_10px_24px_rgba(2,6,23,0.12)]"
        style={stickyTabsTopStyle}
      >
        <div className="ui-container py-2.5">
          <div className={dayTabTrayClassName}>
            <div
              role="tablist"
              aria-label="Schedule days"
              aria-orientation="horizontal"
              className="min-w-0 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex min-w-max items-center gap-2 pr-1">
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
                    aria-label={`${tabDateTitle(day, conf.timezone)}, ${events.length} events`}
                    tabIndex={resolvedDay === day ? 0 : -1}
                    className={`${dayTabBaseClassName} ${
                      resolvedDay === day ? activeDayTabClassName : inactiveDayTabClassName
                    }`}
                    onClick={() => onSelectDay(day)}
                    onKeyDown={(e) => handleTabKeyDown(e, index, day)}
                  >
                    <span className="font-semibold tracking-[-0.01em]">
                      {tabDateTitle(day, conf.timezone)}
                    </span>
                    <span
                      className={
                        resolvedDay === day ? activeDayCountClassName : inactiveDayCountClassName
                      }
                    >
                      {events.length}
                    </span>
                  </button>
                ))}
              </div>
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
          <div className="ui-container mt-4 mb-3">
            <div className="flex flex-col gap-3 border-b border-white/8 pb-3.5 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h2
                  ref={headingRef}
                  style={headingScrollStyle}
                  className="text-xl font-bold tracking-tight text-slate-100 md:text-[1.75rem]"
                >
                  {activeDayLabel}
                </h2>
              </div>

              {activeDayEventCountLabel ? (
                <p className="inline-flex items-center self-start rounded-full border border-white/8 bg-white/3 px-3 py-1 text-sm font-medium text-slate-300 sm:self-auto">
                  {activeDayEventCountLabel}
                </p>
              ) : null}
            </div>
          </div>

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
