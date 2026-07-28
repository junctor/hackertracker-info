import {
  ArrowDownCircleIcon,
  BookmarkIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  ListBulletIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { Virtuoso, type Components, type VirtuosoHandle } from "react-virtuoso";

import type {
  ScheduleDayView,
  ScheduleSessionViewModel as ScheduleSessionViewModelContract,
} from "@/lib/types/ht-types/views";

import { ConferenceManifest } from "@/lib/conferences";
import { sessionDayTable, tabDateTitle } from "@/lib/dates";

import ScheduleExportMenu from "./ScheduleExportMenu";
import ScheduleSessionItem from "./ScheduleSessionItem";

export type ScheduleSessionViewModel = ScheduleSessionViewModelContract;
export type ScheduleDay = ScheduleDayView;

export type ScheduleViewMode = "full" | "now" | "next";

export type ScheduleViewLinks = Record<ScheduleViewMode, string>;

type ScheduleEmptyState = {
  message: string;
  actionHref?: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
};

export type ScheduleJumpRequest = {
  sessionId: number;
  requestId: number;
};

export type ScheduleActivitySummary = {
  liveCount: number;
  startingSoonCount: number;
};

type VirtuosoContext = unknown;

type VirtuosoListProps = React.ComponentPropsWithoutRef<"div"> & {
  context?: VirtuosoContext;
};

type VirtuosoItemProps = React.ComponentPropsWithoutRef<"div"> & {
  context?: VirtuosoContext;
  item?: ScheduleSessionViewModel;
};

const VirtuosoList = React.forwardRef<HTMLDivElement, VirtuosoListProps>(function VirtuosoList(
  { children, className, context, style, ...listProps },
  ref,
) {
  void context;

  // react-virtuoso owns runtime list sizing here. Dropping this breaks window virtualization.
  return (
    <div
      {...listProps}
      ref={ref}
      role="list"
      style={style}
      className={["ui-schedule-session-list", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
});
VirtuosoList.displayName = "VirtuosoList";

function VirtuosoItem({
  children,
  className,
  style,
  context,
  item,
  ...itemProps
}: VirtuosoItemProps) {
  void context;
  void item;

  // react-virtuoso uses per-item runtime offsets while measuring large schedule days.
  return (
    <div
      {...itemProps}
      role="listitem"
      style={style}
      className={["ui-schedule-session-list-item", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
VirtuosoItem.displayName = "VirtuosoItem";

function VirtuosoFooter({ context }: { context?: VirtuosoContext }) {
  void context;

  return <div aria-hidden="true" className="ui-schedule-session-list-footer" />;
}
VirtuosoFooter.displayName = "VirtuosoFooter";

const VIRTUOSO_COMPONENTS: Components<ScheduleSessionViewModel, VirtuosoContext> = {
  List: VirtuosoList,
  Item: VirtuosoItem,
  Footer: VirtuosoFooter,
};

const TAB_SCROLL_EDGE_TOLERANCE_PX = 2;
const TAB_SCROLL_SETTLE_DELAY_MS = 360;

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export default function ScheduleSessions({
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
  highlightedSessionId,
  jumpStatus,
  activitySummary,
  activeTagFilterCount = 0,
  tagFilterHref,
  onClearTagFilters,
}: {
  conf: ConferenceManifest;
  days: ScheduleDay[];
  selectedDay: string;
  onSelectDay: (_day: string) => void;
  bookmarks: number[];
  nowSeconds?: number;
  activeFilter?: "bookmarks" | "tags" | null;
  scheduleView?: ScheduleViewMode;
  scheduleViewLinks?: ScheduleViewLinks;
  emptyState?: ScheduleEmptyState;
  onJumpToNow?: () => void;
  jumpRequest?: ScheduleJumpRequest | null;
  highlightedSessionId?: number | null;
  jumpStatus?: string | null;
  activitySummary?: ScheduleActivitySummary | null;
  activeTagFilterCount?: number;
  tagFilterHref?: string;
  onClearTagFilters?: () => void;
}) {
  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);
  const [tabScrollState, setTabScrollState] = useState({
    canScrollEarlier: false,
    canScrollLater: false,
  });
  const tabScrollRef = useRef<HTMLDivElement | null>(null);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const handledJumpRequestRef = useRef<number | null>(null);
  const pendingTabScrollUpdateRef = useRef<{
    frameId: number | null;
    timeoutId: number | null;
  }>({ frameId: null, timeoutId: null });

  const resolvedDay = useMemo(() => {
    if (selectedDay && days.some(({ day }) => day === selectedDay)) {
      return selectedDay;
    }

    return days[0]?.day ?? "";
  }, [days, selectedDay]);
  const dayKeys = useMemo(() => days.map(({ day }) => day).join("|"), [days]);

  const updateTabScrollState = useCallback(() => {
    const scrollEl = tabScrollRef.current;

    if (!scrollEl) {
      setTabScrollState({ canScrollEarlier: false, canScrollLater: false });
      return;
    }

    const maxScrollLeft = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
    const canScrollEarlier = scrollEl.scrollLeft > TAB_SCROLL_EDGE_TOLERANCE_PX;
    const canScrollLater = maxScrollLeft - scrollEl.scrollLeft > TAB_SCROLL_EDGE_TOLERANCE_PX;

    setTabScrollState((current) => {
      if (
        current.canScrollEarlier === canScrollEarlier &&
        current.canScrollLater === canScrollLater
      ) {
        return current;
      }

      return { canScrollEarlier, canScrollLater };
    });
  }, []);

  const queueTabScrollStateUpdate = useCallback(
    (settleDelayMs = 120) => {
      const pending = pendingTabScrollUpdateRef.current;

      if (pending.frameId !== null) {
        window.cancelAnimationFrame(pending.frameId);
      }

      if (pending.timeoutId !== null) {
        window.clearTimeout(pending.timeoutId);
      }

      pending.frameId = window.requestAnimationFrame(() => {
        pending.frameId = null;
        updateTabScrollState();
      });

      pending.timeoutId = window.setTimeout(() => {
        pending.timeoutId = null;
        updateTabScrollState();
      }, settleDelayMs);
    },
    [updateTabScrollState],
  );

  useEffect(() => {
    const pending = pendingTabScrollUpdateRef.current;

    return () => {
      if (pending.frameId !== null) {
        window.cancelAnimationFrame(pending.frameId);
      }

      if (pending.timeoutId !== null) {
        window.clearTimeout(pending.timeoutId);
      }
    };
  }, []);

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
      queueTabScrollStateUpdate();
    },
    [days, onSelectDay, queueTabScrollStateUpdate, resolvedDay],
  );

  useEffect(() => {
    const scrollEl = tabScrollRef.current;
    if (!scrollEl) return;

    updateTabScrollState();

    const handleScrollStateChange = () => queueTabScrollStateUpdate();
    let resizeObserver: ResizeObserver | null = null;

    scrollEl.addEventListener("scroll", handleScrollStateChange, { passive: true });
    window.addEventListener("resize", handleScrollStateChange);

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(handleScrollStateChange);
      resizeObserver.observe(scrollEl);

      const tabList = scrollEl.firstElementChild;
      if (tabList) {
        resizeObserver.observe(tabList);
      }
    }

    return () => {
      scrollEl.removeEventListener("scroll", handleScrollStateChange);
      window.removeEventListener("resize", handleScrollStateChange);
      resizeObserver?.disconnect();
    };
  }, [dayKeys, queueTabScrollStateUpdate, updateTabScrollState]);

  useEffect(() => {
    if (!resolvedDay) {
      updateTabScrollState();
      return;
    }

    tabButtonRefs.current[resolvedDay]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "auto",
    });
    queueTabScrollStateUpdate();
  }, [dayKeys, queueTabScrollStateUpdate, resolvedDay, updateTabScrollState]);

  const scrollDayTabs = useCallback(
    (direction: "earlier" | "later") => {
      const scrollEl = tabScrollRef.current;
      if (!scrollEl) return;

      const maxScrollLeft = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
      const scrollDistance = Math.max(scrollEl.clientWidth - 48, scrollEl.clientWidth * 0.75);
      const left =
        direction === "earlier"
          ? Math.max(0, scrollEl.scrollLeft - scrollDistance)
          : Math.min(maxScrollLeft, scrollEl.scrollLeft + scrollDistance);

      scrollEl.scrollTo({
        left,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      queueTabScrollStateUpdate(TAB_SCROLL_SETTLE_DELAY_MS);
    },
    [queueTabScrollStateUpdate],
  );

  const activeDay = days.find(({ day }) => day === resolvedDay) ?? null;
  const isBookmarksFilterActive = activeFilter === "bookmarks";
  const isTagsFilterActive = activeFilter === "tags";
  const isTagGroupFilterActive = activeTagFilterCount > 0;
  const showScheduleViewControls = Boolean(scheduleView && scheduleViewLinks);
  const activeDayLabel = activeDay ? sessionDayTable(activeDay.day, conf.timezone) : null;
  const activeDaySessionCountLabel = activeDay
    ? `${activeDay.sessions.length} ${activeDay.sessions.length === 1 ? "session" : "sessions"}`
    : null;

  const computeItemKey = useCallback(
    (index: number, session?: ScheduleSessionViewModel) =>
      session?.id ?? `missing-session-${index}`,
    [],
  );

  const itemContent = useCallback(
    (_: number, session?: ScheduleSessionViewModel) =>
      session ? (
        <ScheduleSessionItem
          conf={conf}
          session={session}
          isBookmarked={bookmarkSet.has(session.id)}
          nowSeconds={nowSeconds}
          isHighlighted={highlightedSessionId === session.id}
        />
      ) : null,
    [bookmarkSet, conf, highlightedSessionId, nowSeconds],
  );

  useEffect(() => {
    if (!activeDay || !jumpRequest) return;
    if (handledJumpRequestRef.current === jumpRequest.requestId) return;

    const targetIndex = activeDay.sessions.findIndex(
      (session) => session.id === jumpRequest.sessionId,
    );

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
            `[data-schedule-session-id="${jumpRequest.sessionId}"]`,
          );
          target?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
        }, 350);
      }, 0);
    });

    return () => {
      window.cancelAnimationFrame(frameId);

      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }

      if (settleTimeout) {
        window.clearTimeout(settleTimeout);
      }
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
                  aria-label="View sessions happening now"
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
                  aria-label="View sessions coming up next"
                >
                  <ClockIcon className="ui-icon-menu ui-schedule-tool-icon" aria-hidden="true" />
                  <span className="ui-schedule-compact-label ui-schedule-tool-label">Up Next</span>
                </Link>
              </div>
            </nav>
          ) : null}

          {activitySummary ? (
            <p className="ui-schedule-summary" aria-live="polite">
              <span>Happening now: {activitySummary.liveCount} sessions</span>
              <span>Starting within 30 minutes: {activitySummary.startingSoonCount} sessions</span>
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
              to={tagFilterHref ?? `/${conf.slug}/filters/`}
              className={[
                "ui-btn-base ui-focus-ring ui-inset-highlight-soft ui-schedule-compact-button ui-schedule-tool-link",
                isTagGroupFilterActive ? "ui-schedule-filter-active-button" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={
                isTagGroupFilterActive
                  ? `Edit ${activeTagFilterCount} selected schedule filters`
                  : "Browse schedule filters"
              }
              aria-current={isTagsFilterActive || isTagGroupFilterActive ? "page" : undefined}
            >
              <FunnelIcon className="ui-icon-menu ui-schedule-tool-icon" aria-hidden="true" />
              <span className="ui-schedule-compact-label ui-schedule-tool-label">
                {isTagGroupFilterActive ? `Filters (${activeTagFilterCount})` : "Filters"}
              </span>
            </Link>

            {onClearTagFilters ? (
              <button
                type="button"
                onClick={onClearTagFilters}
                className="ui-btn-base ui-focus-ring ui-inset-highlight-soft ui-schedule-compact-button ui-schedule-tool-link ui-schedule-clear-filter-button"
                aria-label="Clear selected schedule filters"
              >
                <XMarkIcon className="ui-icon-menu ui-schedule-tool-icon" aria-hidden="true" />
                <span className="ui-schedule-compact-label ui-schedule-tool-label">
                  Clear filters
                </span>
              </button>
            ) : null}

            <ScheduleExportMenu conf={conf} />
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
            <div
              className="ui-inset-highlight-soft ui-schedule-tabs-tray"
              data-can-scroll-earlier={tabScrollState.canScrollEarlier ? "true" : undefined}
              data-can-scroll-later={tabScrollState.canScrollLater ? "true" : undefined}
            >
              {tabScrollState.canScrollEarlier ? (
                <button
                  type="button"
                  className="ui-btn-base ui-focus-ring ui-schedule-tab-scroll-button ui-schedule-tab-scroll-button-earlier"
                  aria-label="Scroll to earlier days"
                  onClick={() => scrollDayTabs("earlier")}
                >
                  <ChevronLeftIcon className="ui-icon-sm" aria-hidden="true" />
                </button>
              ) : null}

              <div
                ref={tabScrollRef}
                role="tablist"
                aria-label="Schedule days"
                aria-orientation="horizontal"
                className="ui-scrollbar-none ui-schedule-tab-scroll"
              >
                <div className="ui-schedule-tab-list">
                  {days.map(({ day, sessions }, index) => (
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
                        {sessions.length}
                        <span className="ui-visually-hidden"> sessions</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {tabScrollState.canScrollLater ? (
                <button
                  type="button"
                  className="ui-btn-base ui-focus-ring ui-schedule-tab-scroll-button ui-schedule-tab-scroll-button-later"
                  aria-label="Scroll to later days"
                  onClick={() => scrollDayTabs("later")}
                >
                  <ChevronRightIcon className="ui-icon-sm" aria-hidden="true" />
                </button>
              ) : null}
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

              {activeDaySessionCountLabel ? (
                <p className="ui-meta-pill ui-page-header-count">{activeDaySessionCountLabel}</p>
              ) : null}
            </div>
          </div>

          <div className="ui-container">
            <Virtuoso
              ref={virtuosoRef}
              useWindowScroll
              data={activeDay.sessions}
              computeItemKey={computeItemKey}
              components={VIRTUOSO_COMPONENTS}
              initialItemCount={Math.min(8, activeDay.sessions.length)}
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
          {emptyState.onSecondaryAction && emptyState.secondaryActionLabel ? (
            <button
              type="button"
              onClick={emptyState.onSecondaryAction}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action"
            >
              {emptyState.secondaryActionLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
