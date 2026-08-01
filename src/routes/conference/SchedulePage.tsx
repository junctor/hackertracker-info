import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ConferenceLoadingScreen from "@/features/app-shell/ConferenceLoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import { buildFilterPath } from "@/features/filters/filterRoutes";
import {
  countSelectedTags,
  filterScheduleDaysByTagGroups,
  parseTagGroups,
  serializeTagGroups,
  TAG_GROUP_PARAM,
} from "@/features/filters/tagFilters";
import ScheduleSessions, {
  type ScheduleActivitySummary,
  type ScheduleDay,
  type ScheduleJumpRequest,
  type ScheduleViewLinks,
  type ScheduleViewMode,
} from "@/features/schedule/ScheduleSessions";
import {
  isScheduleLiveWindowAvailable,
  isScheduleSessionLive,
  isScheduleSessionStartingSoon,
} from "@/features/schedule/scheduleTime";
import {
  aiMetadata,
  collectionStructuredDataPath,
  conferenceDataFeeds,
  conferencePath,
} from "@/lib/aiMetadata";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { useNowSeconds } from "@/lib/hooks/useNowSeconds";
import { conferenceMenuPath } from "@/lib/routes";
import { getBookmarks } from "@/lib/storage";
import { ScheduleDaysView } from "@/lib/types/ht-types/views";
import { PageId } from "@/lib/types/page-meta";

type SchedulePageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

function getScheduleView(value: string | null): ScheduleViewMode {
  return value === "now" || value === "next" ? value : "full";
}

function hasLiveScheduleParams(params: URLSearchParams): boolean {
  const view = params.get("view");
  return view === "now" || view === "next" || params.get("now") === "1";
}

function buildSchedulePath(confSlug: string, params: URLSearchParams): string {
  const query = params.toString();
  return `/${confSlug}/schedule/${query ? `?${query}` : ""}`;
}

function filterScheduleDaysByView(
  days: ScheduleDay[],
  view: ScheduleViewMode,
  nowSeconds: number,
): ScheduleDay[] {
  if (view === "full") return days;

  if (view === "next") {
    let nextBeginSeconds: number | null = null;

    for (const { sessions } of days) {
      for (const session of sessions) {
        const beginsAt = session.beginTimestampSeconds;
        if (!Number.isFinite(beginsAt) || beginsAt <= nowSeconds) continue;
        if (nextBeginSeconds === null || beginsAt < nextBeginSeconds) {
          nextBeginSeconds = beginsAt;
        }
      }
    }

    if (nextBeginSeconds === null) return [];

    return days
      .map(({ day, sessions }) => ({
        day,
        sessions: sessions.filter((session) => session.beginTimestampSeconds === nextBeginSeconds),
      }))
      .filter(({ sessions }) => sessions.length > 0);
  }

  const result: ScheduleDay[] = [];

  for (const { day, sessions } of days) {
    const filteredSessions = sessions.filter((session) => {
      return isScheduleSessionLive(session, nowSeconds);
    });

    if (filteredSessions.length > 0) {
      result.push({ day, sessions: filteredSessions });
    }
  }

  return result;
}

function getScheduleViewLinks(
  confSlug: string,
  currentSearchParams: URLSearchParams,
): ScheduleViewLinks {
  const fullParams = new URLSearchParams(currentSearchParams);
  fullParams.delete("now");
  fullParams.delete("view");

  const nowParams = new URLSearchParams(currentSearchParams);
  nowParams.delete("now");
  nowParams.set("view", "now");

  const nextParams = new URLSearchParams(currentSearchParams);
  nextParams.delete("now");
  nextParams.set("view", "next");

  return {
    full: buildSchedulePath(confSlug, fullParams),
    now: buildSchedulePath(confSlug, nowParams),
    next: buildSchedulePath(confSlug, nextParams),
  };
}

function getScheduleActivitySummary(
  days: ScheduleDay[],
  nowSeconds: number,
): ScheduleActivitySummary | null {
  if (nowSeconds <= 0) return null;

  let liveCount = 0;
  let startingSoonCount = 0;

  for (const { sessions } of days) {
    for (const session of sessions) {
      if (isScheduleSessionLive(session, nowSeconds)) {
        liveCount += 1;
      } else if (isScheduleSessionStartingSoon(session, nowSeconds)) {
        startingSoonCount += 1;
      }
    }
  }

  return { liveCount, startingSoonCount };
}

function findScheduleJumpTarget(
  days: ScheduleDay[],
  nowSeconds: number,
): { day: string; sessionId: number } | null {
  let nextTarget: { day: string; sessionId: number; beginsAt: number } | null = null;

  for (const { day, sessions } of days) {
    for (const session of sessions) {
      if (isScheduleSessionLive(session, nowSeconds)) {
        return { day, sessionId: session.id };
      }

      const beginsAt = session.beginTimestampSeconds;
      if (!Number.isFinite(beginsAt) || beginsAt <= nowSeconds) continue;

      if (!nextTarget || beginsAt < nextTarget.beginsAt) {
        nextTarget = { day, sessionId: session.id, beginsAt };
      }
    }
  }

  return nextTarget ? { day: nextTarget.day, sessionId: nextTarget.sessionId } : null;
}

export default function SchedulePage({ conf, activePageId }: SchedulePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const nowSeconds = useNowSeconds();
  const effectiveNowSeconds = nowSeconds > 0 ? nowSeconds : Math.floor(Date.now() / 1000);
  const autoNowHandledRef = useRef(false);
  const jumpRequestIdRef = useRef(0);
  const [jumpRequest, setJumpRequest] = useState<ScheduleJumpRequest | null>(null);
  const [highlightedSessionId, setHighlightedSessionId] = useState<number | null>(null);
  const [jumpStatus, setJumpStatus] = useState<string | null>(null);

  const {
    data: scheduleDays,
    error: scheduleDaysError,
    isLoading: scheduleDaysLoading,
  } = useConferenceJson<ScheduleDaysView>(conf, "views/scheduleDays.json");

  const bookmarks = useMemo(() => getBookmarks(), []);

  const days = useMemo(() => {
    return scheduleDays ?? [];
  }, [scheduleDays]);
  const isLiveScheduleAvailable = useMemo(
    () => isScheduleLiveWindowAvailable(days, effectiveNowSeconds),
    [days, effectiveNowSeconds],
  );

  const requestedScheduleView = useMemo(
    () => getScheduleView(searchParams.get("view")),
    [searchParams],
  );
  const tagGroups = useMemo(() => parseTagGroups(searchParams), [searchParams]);
  const selectedTagCount = useMemo(() => countSelectedTags(tagGroups), [tagGroups]);
  const isTagFilterActive = tagGroups.length > 0;

  useEffect(() => {
    const normalizedParams = serializeTagGroups(searchParams, tagGroups);
    if (normalizedParams.toString() === searchParams.toString()) return;

    setSearchParams(() => normalizedParams, { replace: true });
  }, [searchParams, setSearchParams, tagGroups]);

  const scheduleView: ScheduleViewMode = isLiveScheduleAvailable ? requestedScheduleView : "full";

  const tagFilteredDays = useMemo(
    () => filterScheduleDaysByTagGroups(days, tagGroups),
    [days, tagGroups],
  );

  const tagFilteredSessionCount = useMemo(
    () => tagFilteredDays.reduce((count, day) => count + day.sessions.length, 0),
    [tagFilteredDays],
  );

  const visibleDays = useMemo(
    () => filterScheduleDaysByView(tagFilteredDays, scheduleView, effectiveNowSeconds),
    [effectiveNowSeconds, scheduleView, tagFilteredDays],
  );

  const activitySummary = useMemo(
    () =>
      isLiveScheduleAvailable
        ? getScheduleActivitySummary(tagFilteredDays, effectiveNowSeconds)
        : null,
    [effectiveNowSeconds, isLiveScheduleAvailable, tagFilteredDays],
  );

  const daySet = useMemo(() => new Set(visibleDays.map((d) => d.day)), [visibleDays]);

  const defaultDay = useMemo(() => {
    // Pick in-progress day first, then fall back to earliest day.
    if (visibleDays.length === 0) return null;

    for (const { day, sessions } of visibleDays) {
      for (const session of sessions) {
        if (isScheduleSessionLive(session, effectiveNowSeconds)) {
          return day;
        }
      }
    }

    return visibleDays[0].day;
  }, [effectiveNowSeconds, visibleDays]);

  const dayParam = useMemo(() => {
    return searchParams.get("day");
  }, [searchParams]);

  const resolvedDay = useMemo(() => {
    if (dayParam && daySet.has(dayParam)) {
      return dayParam;
    }
    return defaultDay ?? "";
  }, [dayParam, daySet, defaultDay]);

  const handleSelectDay = useCallback(
    (day: string) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.set("day", day);
        next.delete("now");
        return next;
      });
    },
    [setSearchParams],
  );

  const scheduleViewLinks = useMemo(
    () => getScheduleViewLinks(conf.slug, searchParams),
    [conf.slug, searchParams],
  );
  const tagFilterHref = useMemo(
    () => buildFilterPath(conf.slug, "schedule", searchParams),
    [conf.slug, searchParams],
  );

  const handleClearTagFilters = useCallback(() => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete(TAG_GROUP_PARAM);
      return next;
    });
  }, [setSearchParams]);

  const handleJumpToNow = useCallback(() => {
    if (!isLiveScheduleAvailable) return;

    const target = findScheduleJumpTarget(tagFilteredDays, effectiveNowSeconds);

    if (!target) {
      setJumpRequest(null);
      setHighlightedSessionId(null);
      setJumpStatus("No sessions are happening now or scheduled later. Check the full schedule.");
      return;
    }

    jumpRequestIdRef.current += 1;
    setJumpStatus(null);
    setHighlightedSessionId(target.sessionId);
    setJumpRequest({ sessionId: target.sessionId, requestId: jumpRequestIdRef.current });

    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("view");
      next.set("day", target.day);
      next.set("now", "1");
      return next;
    });
  }, [effectiveNowSeconds, isLiveScheduleAvailable, setSearchParams, tagFilteredDays]);

  useEffect(() => {
    if (isLiveScheduleAvailable || !hasLiveScheduleParams(searchParams)) return;

    setJumpRequest(null);
    setHighlightedSessionId(null);
    setJumpStatus(null);
    autoNowHandledRef.current = false;

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        const view = next.get("view");
        if (view === "now" || view === "next") {
          next.delete("view");
        }
        next.delete("now");
        return next;
      },
      { replace: true },
    );
  }, [isLiveScheduleAvailable, searchParams, setSearchParams]);

  useEffect(() => {
    if (searchParams.get("now") !== "1") {
      autoNowHandledRef.current = false;
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLiveScheduleAvailable) return;
    if (searchParams.get("now") !== "1" || autoNowHandledRef.current) return;
    if (tagFilteredDays.length === 0 || effectiveNowSeconds <= 0) return;

    autoNowHandledRef.current = true;
    handleJumpToNow();
  }, [
    effectiveNowSeconds,
    handleJumpToNow,
    isLiveScheduleAvailable,
    searchParams,
    tagFilteredDays.length,
  ]);

  useEffect(() => {
    if (highlightedSessionId === null) return;

    const timeoutId = window.setTimeout(() => {
      setHighlightedSessionId(null);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [highlightedSessionId]);

  const emptyState = useMemo(() => {
    if (isTagFilterActive && tagFilteredSessionCount === 0) {
      return {
        message: "No sessions match the selected filters.",
        actionHref: tagFilterHref,
        actionLabel: "Edit Filters",
        secondaryActionLabel: "Clear filters",
        onSecondaryAction: handleClearTagFilters,
      };
    }

    if (scheduleView === "now") {
      return {
        message: "Nothing is happening right now.",
        actionHref: scheduleViewLinks.full,
        actionLabel: "Check the full schedule",
      };
    }

    if (scheduleView === "next") {
      return {
        message: "Nothing else is scheduled today.",
        actionHref: scheduleViewLinks.full,
        actionLabel: "Full Schedule",
      };
    }

    return {
      message: "No sessions are listed yet.",
    };
  }, [
    handleClearTagFilters,
    isTagFilterActive,
    scheduleView,
    scheduleViewLinks.full,
    tagFilterHref,
    tagFilteredSessionCount,
  ]);

  if (scheduleDaysLoading) {
    return (
      <ConferenceLoadingScreen conference={conf} activePageId={activePageId} variant="schedule" />
    );
  }

  if (scheduleDaysError || !scheduleDays) {
    return (
      <ErrorScreen
        title="Couldn't load schedule"
        copy="The schedule could not be loaded. Try again, or return to the conference home page."
        retryActionLabel="Retry"
        primaryActionHref={conferenceMenuPath(conf)}
        primaryActionLabel="Conference Home"
      />
    );
  }

  return (
    <>
      <Head>
        <title>Schedule | {conf.name}</title>
        {aiMetadata({
          title: `Schedule | ${conf.name}`,
          description: `${conf.name} schedule of sessions, talks, and workshops.`,
          path: conferencePath(conf, "schedule"),
          jsonFeeds: conferenceDataFeeds(conf),
          structuredData: [collectionStructuredDataPath(conf, "schedule")],
        })}
      </Head>
      <ConferenceLayout
        conference={conf}
        activePageId={activePageId}
        className="ui-schedule-page-shell"
      >
        <h1 className="ui-visually-hidden">Schedule</h1>
        <ScheduleSessions
          conf={conf}
          days={visibleDays}
          selectedDay={resolvedDay}
          onSelectDay={handleSelectDay}
          bookmarks={bookmarks}
          nowSeconds={isLiveScheduleAvailable ? effectiveNowSeconds : 0}
          scheduleView={isLiveScheduleAvailable ? scheduleView : undefined}
          scheduleViewLinks={isLiveScheduleAvailable ? scheduleViewLinks : undefined}
          emptyState={emptyState}
          onJumpToNow={isLiveScheduleAvailable ? handleJumpToNow : undefined}
          jumpRequest={jumpRequest}
          highlightedSessionId={highlightedSessionId}
          jumpStatus={jumpStatus}
          activitySummary={activitySummary}
          activeTagFilterCount={selectedTagCount}
          tagFilterHref={tagFilterHref}
          onClearTagFilters={isTagFilterActive ? handleClearTagFilters : undefined}
        />
      </ConferenceLayout>
    </>
  );
}
