import { BookmarkIcon, TagIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { Virtuoso, type Components, type ItemProps, type ListProps } from "react-virtuoso";

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
      className="ui-schedule-event-list"
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
    <li {...itemProps} style={style} className="ui-schedule-event-list-item">
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
      setSiteHeaderHeight(siteHeader.getBoundingClientRect().height);
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
    <div className="ui-schedule-shell">
      <div className="ui-container ui-schedule-tools">
        <nav aria-label="Schedule tools">
          <div className="ui-schedule-tool-list">
            <Link
              to={`/${conf.slug}/bookmarks`}
              className="ui-btn-base ui-focus-ring ui-inset-highlight-soft ui-schedule-compact-button ui-schedule-tool-link"
              aria-label="View bookmarked events"
              aria-current={isBookmarksFilterActive ? "page" : undefined}
            >
              <BookmarkIcon className="ui-icon-menu ui-schedule-tool-icon" aria-hidden="true" />
              <span className="ui-schedule-compact-label ui-schedule-tool-label">Bookmarks</span>
            </Link>

            <Link
              to={`/${conf.slug}/tags`}
              className="ui-btn-base ui-focus-ring ui-inset-highlight-soft ui-schedule-compact-button ui-schedule-tool-link"
              aria-label="Browse schedule tags"
              aria-current={isTagsFilterActive ? "page" : undefined}
            >
              <TagIcon className="ui-icon-menu ui-schedule-tool-icon" aria-hidden="true" />
              <span className="ui-schedule-compact-label ui-schedule-tool-label">Tags</span>
            </Link>
          </div>
        </nav>
      </div>

      <div
        ref={stickyTabsRef}
        className="ui-topbar ui-schedule-day-tabs"
        style={stickyTabsTopStyle}
      >
        <div className="ui-container ui-schedule-tabs-inner">
          <div className="ui-inset-highlight-soft ui-schedule-tabs-tray">
            <div
              role="tablist"
              aria-label="Schedule days"
              aria-orientation="horizontal"
              className="ui-scrollbar-none ui-schedule-tab-scroll"
            >
              <div className="ui-schedule-tab-list">
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
                    className="ui-focus-ring ui-schedule-day-tab"
                    onClick={() => onSelectDay(day)}
                    onKeyDown={(e) => handleTabKeyDown(e, index, day)}
                  >
                    <span className="ui-schedule-day-tab-title">
                      {tabDateTitle(day, conf.timezone)}
                    </span>
                    <span className="ui-schedule-day-count">{events.length}</span>
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
          <div className="ui-container ui-schedule-heading-wrap">
            <div className="ui-schedule-heading-row">
              <div className="ui-schedule-heading-title-wrap">
                <h2
                  ref={headingRef}
                  style={headingScrollStyle}
                  className="ui-schedule-heading-title"
                >
                  {activeDayLabel}
                </h2>
              </div>

              {activeDayEventCountLabel ? (
                <p className="ui-meta-pill ui-page-header-count">{activeDayEventCountLabel}</p>
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
