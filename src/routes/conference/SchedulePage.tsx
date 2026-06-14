import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ConferenceLoadingScreen from "@/features/app-shell/ConferenceLoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import { getScheduleDaysFromStores } from "@/features/schedule/scheduleData";
import ScheduleEvents, {
  type ScheduleActivitySummary,
  type ScheduleDay,
  type ScheduleJumpRequest,
  type ScheduleViewLinks,
  type ScheduleViewMode,
} from "@/features/schedule/ScheduleEvents";
import {
  isConferenceInProgress,
  isScheduleEventLive,
  isScheduleEventStartingSoon,
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
import { getBookmarks } from "@/lib/storage";
import {
  ContentStore,
  EventsByDayIndex,
  EventsStore,
  LocationsStore,
  PeopleStore,
  TagsStore,
} from "@/lib/types/ht-types";
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
  return `/${confSlug}/schedule${query ? `?${query}` : ""}`;
}

function filterScheduleDaysByView(
  days: ScheduleDay[],
  view: ScheduleViewMode,
  nowSeconds: number,
): ScheduleDay[] {
  if (view === "full") return days;

  if (view === "next") {
    let nextBeginSeconds: number | null = null;

    for (const { events } of days) {
      for (const event of events) {
        const beginsAt = event.beginTimestampSeconds;
        if (!Number.isFinite(beginsAt) || beginsAt <= nowSeconds) continue;
        if (nextBeginSeconds === null || beginsAt < nextBeginSeconds) {
          nextBeginSeconds = beginsAt;
        }
      }
    }

    if (nextBeginSeconds === null) return [];

    return days
      .map(({ day, events }) => ({
        day,
        events: events.filter((event) => event.beginTimestampSeconds === nextBeginSeconds),
      }))
      .filter(({ events }) => events.length > 0);
  }

  const result: ScheduleDay[] = [];

  for (const { day, events } of days) {
    const filteredEvents = events.filter((event) => {
      return isScheduleEventLive(event, nowSeconds);
    });

    if (filteredEvents.length > 0) {
      result.push({ day, events: filteredEvents });
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

  for (const { events } of days) {
    for (const event of events) {
      if (isScheduleEventLive(event, nowSeconds)) {
        liveCount += 1;
      } else if (isScheduleEventStartingSoon(event, nowSeconds)) {
        startingSoonCount += 1;
      }
    }
  }

  return { liveCount, startingSoonCount };
}

function findScheduleJumpTarget(
  days: ScheduleDay[],
  nowSeconds: number,
): { day: string; eventId: number } | null {
  let nextTarget: { day: string; eventId: number; beginsAt: number } | null = null;

  for (const { day, events } of days) {
    for (const event of events) {
      if (isScheduleEventLive(event, nowSeconds)) {
        return { day, eventId: event.id };
      }

      const beginsAt = event.beginTimestampSeconds;
      if (!Number.isFinite(beginsAt) || beginsAt <= nowSeconds) continue;

      if (!nextTarget || beginsAt < nextTarget.beginsAt) {
        nextTarget = { day, eventId: event.id, beginsAt };
      }
    }
  }

  return nextTarget ? { day: nextTarget.day, eventId: nextTarget.eventId } : null;
}

export default function SchedulePage({ conf, activePageId }: SchedulePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const nowSeconds = useNowSeconds();
  const effectiveNowSeconds = nowSeconds > 0 ? nowSeconds : Math.floor(Date.now() / 1000);
  const isLiveScheduleAvailable = isConferenceInProgress(conf, effectiveNowSeconds);
  const autoNowHandledRef = useRef(false);
  const jumpRequestIdRef = useRef(0);
  const [jumpRequest, setJumpRequest] = useState<ScheduleJumpRequest | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<number | null>(null);
  const [jumpStatus, setJumpStatus] = useState<string | null>(null);

  const {
    data: eventsByDay,
    error: eventsByDayError,
    isLoading: eventsByDayLoading,
  } = useConferenceJson<EventsByDayIndex>(conf, "indexes/eventsByDay.json");

  const {
    data: eventsStore,
    error: eventsError,
    isLoading: eventsLoading,
  } = useConferenceJson<EventsStore>(conf, "entities/events.json");

  const {
    data: locationsStore,
    error: locationsError,
    isLoading: locationsLoading,
  } = useConferenceJson<LocationsStore>(conf, "entities/locations.json");

  const {
    data: tagsStore,
    error: tagsError,
    isLoading: tagsLoading,
  } = useConferenceJson<TagsStore>(conf, "entities/tags.json");

  const {
    data: peopleStore,
    error: peopleError,
    isLoading: peopleLoading,
  } = useConferenceJson<PeopleStore>(conf, "entities/people.json");

  const {
    data: contentStore,
    error: contentError,
    isLoading: contentLoading,
  } = useConferenceJson<ContentStore>(conf, "entities/content.json");

  const bookmarks = useMemo(() => getBookmarks(), []);

  const days = useMemo(() => {
    if (
      !eventsByDay ||
      !eventsStore ||
      !locationsStore ||
      !tagsStore ||
      !peopleStore ||
      !contentStore
    ) {
      return [];
    }
    return getScheduleDaysFromStores(conf, {
      eventsByDay,
      eventsStore,
      locationsStore,
      tagsStore,
      peopleStore,
      contentStore,
    });
  }, [conf, eventsByDay, eventsStore, locationsStore, tagsStore, peopleStore, contentStore]);

  const requestedScheduleView = useMemo(
    () => getScheduleView(searchParams.get("view")),
    [searchParams],
  );

  const scheduleView: ScheduleViewMode = isLiveScheduleAvailable ? requestedScheduleView : "full";

  const visibleDays = useMemo(
    () => filterScheduleDaysByView(days, scheduleView, effectiveNowSeconds),
    [days, effectiveNowSeconds, scheduleView],
  );

  const activitySummary = useMemo(
    () => (isLiveScheduleAvailable ? getScheduleActivitySummary(days, effectiveNowSeconds) : null),
    [days, effectiveNowSeconds, isLiveScheduleAvailable],
  );

  const daySet = useMemo(() => new Set(visibleDays.map((d) => d.day)), [visibleDays]);

  const defaultDay = useMemo(() => {
    // Pick in-progress day first, then fall back to earliest day.
    if (visibleDays.length === 0) return null;

    for (const { day, events } of visibleDays) {
      for (const event of events) {
        const begin = event.beginTimestampSeconds;
        const end = event.endTimestampSeconds;
        if (
          Number.isFinite(begin) &&
          Number.isFinite(end) &&
          begin <= effectiveNowSeconds &&
          effectiveNowSeconds <= end
        ) {
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

  const handleJumpToNow = useCallback(() => {
    if (!isLiveScheduleAvailable) return;

    const target = findScheduleJumpTarget(days, effectiveNowSeconds);

    if (!target) {
      setJumpRequest(null);
      setHighlightedEventId(null);
      setJumpStatus("No live or upcoming events are available. Check the full schedule.");
      return;
    }

    jumpRequestIdRef.current += 1;
    setJumpStatus(null);
    setHighlightedEventId(target.eventId);
    setJumpRequest({ eventId: target.eventId, requestId: jumpRequestIdRef.current });

    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("view");
      next.set("day", target.day);
      next.set("now", "1");
      return next;
    });
  }, [days, effectiveNowSeconds, isLiveScheduleAvailable, setSearchParams]);

  useEffect(() => {
    if (isLiveScheduleAvailable || !hasLiveScheduleParams(searchParams)) return;

    setJumpRequest(null);
    setHighlightedEventId(null);
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
    if (days.length === 0 || effectiveNowSeconds <= 0) return;

    autoNowHandledRef.current = true;
    handleJumpToNow();
  }, [days.length, effectiveNowSeconds, handleJumpToNow, isLiveScheduleAvailable, searchParams]);

  useEffect(() => {
    if (highlightedEventId === null) return;

    const timeoutId = window.setTimeout(() => {
      setHighlightedEventId(null);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [highlightedEventId]);

  const emptyState = useMemo(() => {
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
      message: "No events are listed yet.",
    };
  }, [scheduleView, scheduleViewLinks.full]);

  const isLoading =
    eventsByDayLoading ||
    eventsLoading ||
    locationsLoading ||
    tagsLoading ||
    peopleLoading ||
    contentLoading;

  const error =
    eventsByDayError || eventsError || locationsError || tagsError || peopleError || contentError;

  if (isLoading) {
    return (
      <ConferenceLoadingScreen conference={conf} activePageId={activePageId} variant="schedule" />
    );
  }

  if (
    error ||
    !eventsByDay ||
    !eventsStore ||
    !locationsStore ||
    !tagsStore ||
    !peopleStore ||
    !contentStore
  ) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Head>
        <title>Schedule | {conf.name}</title>
        {aiMetadata({
          title: `Schedule | ${conf.name}`,
          description: `Full ${conf.name} schedule of sessions, talks, and events.`,
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
        <ScheduleEvents
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
          highlightedEventId={highlightedEventId}
          jumpStatus={jumpStatus}
          activitySummary={activitySummary}
        />
      </ConferenceLayout>
    </>
  );
}
