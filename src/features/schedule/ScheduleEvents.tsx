import {
  ArrowDownCircleIcon,
  BookmarkIcon,
  ClockIcon,
  ListBulletIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router";
import {
  Virtuoso,
  type Components,
  type ItemProps,
  type ListProps,
  type VirtuosoHandle,
} from "react-virtuoso";

import type { ContentEntity, EventEntity } from "@/lib/types/ht-types";

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
  contentEntity: ContentEntity | null;
  session: EventEntity;
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

export type ScheduleViewMode = "full" | "now" | "next";

export type ScheduleViewLinks = Record<ScheduleViewMode, string>;

type ScheduleEmptyState = {
  message: string;
  actionHref?: string;
  actionLabel?: string;
};

export type ScheduleJumpRequest = {
  eventId: number;
  requestId: number;
};

export type ScheduleActivitySummary = {
  liveCount: number;
  startingSoonCount: number;
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
  // react-virtuoso owns runtime list sizing here; dropping this breaks window virtualization.
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
  // react-virtuoso uses per-item runtime offsets while measuring large schedule days.
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

export default function ScheduleEvents({
  conf,
  days,
  selectedDay,
  onSelectDay,
  bookmarks,
  nowSeconds = 0,
  activeFilter = null,
  scheduleView,
  scheduleViewLinks,
  emptyState,
  onJumpToNow,
  jumpRequest,
  highlightedEventId,
  jumpStatus,
  activitySummary,
}: {
  conf: ConferenceManifest;
  days: ScheduleDay[];
  selectedDay: string;
  // eslint-disable-next-line no-unused-vars
  onSelectDay: (day: string) => void;
  bookmarks: number[];
  nowSeconds?: number;
  activeFilter?: "bookmarks" | "tags" | null;
  scheduleView?: ScheduleViewMode;
  scheduleViewLinks?: ScheduleViewLinks;
  emptyState?: ScheduleEmptyState;
  onJumpToNow?: () => void;
  jumpRequest?: ScheduleJumpRequest | null;
  highlightedEventId?: number | null;
  jumpStatus?: string | null;
  activitySummary?: ScheduleActivitySummary | null;
}) {
  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const handledJumpRequestRef = useRef<number | null>(null);

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
    const scrollMarginTop = Number.parseFloat(window.getComputedStyle(heading).scrollMarginTop);
    const headingScrollOffsetPx = Number.isFinite(scrollMarginTop) ? scrollMarginTop : 0;

    if (rect.top < headingScrollOffsetPx || rect.bottom > window.innerHeight) {
      const top = window.scrollY + rect.top - headingScrollOffsetPx;
      window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
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
  const isBookmarksFilterActive = activeFilter === "bookmarks";
  const isTagsFilterActive = activeFilter === "tags";
  const showScheduleViewControls = Boolean(scheduleView && scheduleViewLinks);
  const activeDayLabel = activeDay ? eventDayTable(activeDay.day, conf.timezone) : null;
  const activeDayEventCountLabel = activeDay
    ? `${activeDay.events.length} ${activeDay.events.length === 1 ? "event" : "events"}`
    : null;
  const computeItemKey = useCallback(
    (index: number, evt?: ScheduleEventViewModel) => evt?.id ?? `missing-event-${index}`,
    [],
  );
  const itemContent = useCallback(
    (_: number, evt?: ScheduleEventViewModel) =>
      evt ? (
        <ScheduleEventItem
          conf={conf}
          event={evt}
          isBookmarked={bookmarkSet.has(evt.id)}
          nowSeconds={nowSeconds}
          isHighlighted={highlightedEventId === evt.id}
        />
      ) : null,
    [bookmarkSet, conf, highlightedEventId, nowSeconds],
  );

  useEffect(() => {
    if (!activeDay || !jumpRequest) return;
    if (handledJumpRequestRef.current === jumpRequest.requestId) return;

    const targetIndex = activeDay.events.findIndex((event) => event.id === jumpRequest.eventId);
    if (targetIndex < 0) return;

    handledJumpRequestRef.current = jumpRequest.requestId;

    let frameId = 0;
    let scrollTimeout: number | null = null;
    let settleTimeout: number | null = null;

    frameId = window.requestAnimationFrame(() => {
      scrollTimeout = window.setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: targetIndex,
          align: "start",
          behavior: "smooth",
        });

        settleTimeout = window.setTimeout(() => {
          const target = document.querySelector<HTMLElement>(
            `[data-schedule-event-id="${jumpRequest.eventId}"]`,
          );
          target?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
        }, 350);
      }, 0);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      if (settleTimeout) window.clearTimeout(settleTimeout);
    };
  }, [activeDay, jumpRequest]);

  return (
    <div className="ui-schedule-shell">
      <div className="ui-container ui-schedule-tools">
        <div className="ui-schedule-primary-tools">
          {showScheduleViewControls && scheduleView && scheduleViewLinks ? (
            <nav aria-label="Schedule view">
              <div className="ui-schedule-view-list">
                <Link
                  to={scheduleViewLinks.full}
                  className="ui-btn-base ui-focus-ring ui-inset-highlight-soft ui-schedule-compact-button ui-schedule-view-link"
                  aria-current={scheduleView === "full" ? "page" : undefined}
                  aria-label="View full schedule"
                >
                  <ListBulletIcon
                    className="ui-icon-menu ui-schedule-tool-icon"
                    aria-hidden="true"
                  />
                  <span className="ui-schedule-compact-label ui-schedule-tool-label">
                    Full Schedule
                  </span>
                </Link>

                <Link
                  to={scheduleViewLinks.now}
                  className="ui-btn-base ui-focus-ring ui-inset-highlight-soft ui-schedule-compact-button ui-schedule-view-link"
                  aria-current={scheduleView === "now" ? "page" : undefined}
                  aria-label="View events happening now"
                >
                  <ClockIcon className="ui-icon-menu ui-schedule-tool-icon" aria-hidden="true" />
                  <span className="ui-schedule-compact-label ui-schedule-tool-label">
                    Happening Now
                  </span>
                </Link>

                <Link
                  to={scheduleViewLinks.next}
                  className="ui-btn-base ui-focus-ring ui-inset-highlight-soft ui-schedule-compact-button ui-schedule-view-link"
                  aria-current={scheduleView === "next" ? "page" : undefined}
                  aria-label="View events coming up next"
                >
                  <ClockIcon className="ui-icon-menu ui-schedule-tool-icon" aria-hidden="true" />
                  <span className="ui-schedule-compact-label ui-schedule-tool-label">Up Next</span>
                </Link>
              </div>
            </nav>
          ) : null}

          {activitySummary ? (
            <p className="ui-schedule-summary" aria-live="polite">
              <span>Live now: {activitySummary.liveCount} events</span>
              <span>Starting within 30 minutes: {activitySummary.startingSoonCount} events</span>
            </p>
          ) : null}
        </div>

        <nav aria-label="Schedule tools" className="ui-schedule-secondary-tools">
          <div className="ui-schedule-tool-list">
            {onJumpToNow ? (
              <button
                type="button"
                onClick={onJumpToNow}
                className="ui-btn-base ui-btn-primary ui-focus-ring ui-schedule-compact-button ui-schedule-jump-button"
              >
                <ArrowDownCircleIcon
                  className="ui-icon-menu ui-schedule-tool-icon"
                  aria-hidden="true"
                />
                <span className="ui-schedule-compact-label ui-schedule-tool-label">
                  Jump to Now
                </span>
              </button>
            ) : null}

            <Link
              to={`/${conf.slug}/bookmarks/`}
              className="ui-btn-base ui-focus-ring ui-inset-highlight-soft ui-schedule-compact-button ui-schedule-tool-link"
              aria-current={isBookmarksFilterActive ? "page" : undefined}
            >
              <BookmarkIcon className="ui-icon-menu ui-schedule-tool-icon" aria-hidden="true" />
              <span className="ui-schedule-compact-label ui-schedule-tool-label">Bookmarks</span>
            </Link>

            <Link
              to={`/${conf.slug}/tags/`}
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

      {jumpStatus ? (
        <div className="ui-container">
          <p className="ui-schedule-feedback" role="status">
            {jumpStatus}
          </p>
        </div>
      ) : null}

      {days.length > 0 ? (
        <div className="ui-topbar ui-schedule-day-tabs">
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
                      tabIndex={resolvedDay === day ? 0 : -1}
                      className="ui-focus-ring ui-schedule-day-tab"
                      onClick={() => onSelectDay(day)}
                      onKeyDown={(e) => handleTabKeyDown(e, index, day)}
                    >
                      <span className="ui-schedule-day-tab-title">
                        {tabDateTitle(day, conf.timezone)}
                      </span>
                      <span className="ui-schedule-day-count">
                        {events.length}
                        <span className="ui-visually-hidden"> events</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

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
                <h2 ref={headingRef} className="ui-schedule-heading-title">
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
              ref={virtuosoRef}
              useWindowScroll
              data={activeDay.events}
              computeItemKey={computeItemKey}
              components={VIRTUOSO_COMPONENTS}
              initialItemCount={Math.min(8, activeDay.events.length)}
              itemContent={itemContent}
              increaseViewportBy={{ top: 200, bottom: 400 }}
            />
          </div>
        </section>
      )}

      {!activeDay && emptyState ? (
        <div className="ui-container ui-empty-state ui-schedule-empty-state" role="status">
          <p>{emptyState.message}</p>
          {emptyState.actionHref && emptyState.actionLabel ? (
            <Link
              to={emptyState.actionHref}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action"
            >
              {emptyState.actionLabel}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
