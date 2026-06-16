import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Link } from "react-router";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ScheduleEvents, { ScheduleDay } from "@/features/schedule/ScheduleEvents";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { useNowSeconds } from "@/lib/hooks/useNowSeconds";
import { getBookmarks } from "@/lib/storage";
import { BookmarkEventsByIdView, ScheduleEventViewModel } from "@/lib/types/ht-types/views";
import { PageId } from "@/lib/types/page-meta";

type BookmarksPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

function normalizeId(id: unknown): string {
  return String(id);
}

function getEventDay(event: ScheduleEventViewModel, timeZone: string): string {
  const date = new Date(event.begin);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const byType = new Map(parts.map((part) => [part.type, part.value]));
  const year = byType.get("year");
  const month = byType.get("month");
  const day = byType.get("day");

  return year && month && day ? `${year}-${month}-${day}` : "";
}

function groupBookmarkedEventsByDay(
  bookmarkEventsById: BookmarkEventsByIdView,
  bookmarkSet: ReadonlySet<string>,
  timeZone: string,
): ScheduleDay[] {
  if (bookmarkSet.size === 0) return [];

  const bookmarkedEvents = Object.values(bookmarkEventsById)
    .filter((event) => bookmarkSet.has(String(event.id)))
    .toSorted((a, b) => {
      if (a.beginTimestampSeconds !== b.beginTimestampSeconds) {
        return a.beginTimestampSeconds - b.beginTimestampSeconds;
      }
      return a.id - b.id;
    });

  const days = new Map<string, ScheduleEventViewModel[]>();
  for (const event of bookmarkedEvents) {
    const day = getEventDay(event, timeZone);
    if (!day) continue;
    const list = days.get(day) ?? [];
    list.push(event);
    days.set(day, list);
  }

  return [...days.entries()].map(([day, events]) => ({ day, events }));
}

export default function BookmarksPage({ conf, activePageId }: BookmarksPageProps) {
  const nowSeconds = useNowSeconds();
  const {
    data: bookmarkEventsById,
    error,
    isLoading,
  } = useConferenceJson<BookmarkEventsByIdView>(conf, "views/bookmarkEventsById.json");

  const [bookmarks, setBookmarks] = useState<string[]>(() => getBookmarks().map(normalizeId));

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncBookmarks = () => {
      setBookmarks(getBookmarks().map(normalizeId));
    };

    window.addEventListener("storage", syncBookmarks);
    window.addEventListener("bookmarks:changed", syncBookmarks);

    return () => {
      window.removeEventListener("storage", syncBookmarks);
      window.removeEventListener("bookmarks:changed", syncBookmarks);
    };
  }, []);

  const bookmarkSet = useMemo(() => new Set(bookmarks.map(normalizeId)), [bookmarks]);

  const scheduleBookmarks = useMemo(() => {
    return bookmarks
      .map((bookmark) => Number(bookmark))
      .filter((bookmark): bookmark is number => Number.isFinite(bookmark));
  }, [bookmarks]);

  const days = useMemo(() => {
    if (!bookmarkEventsById) return [];
    return groupBookmarkedEventsByDay(bookmarkEventsById, bookmarkSet, conf.timezone);
  }, [bookmarkEventsById, bookmarkSet, conf.timezone]);

  const defaultDay = useMemo(() => {
    if (days.length === 0) return null;
    for (const { day, events } of days) {
      for (const event of events) {
        if (event.beginTimestampSeconds <= nowSeconds && nowSeconds <= event.endTimestampSeconds) {
          return day;
        }
      }
    }
    return days[0].day;
  }, [days, nowSeconds]);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const resolvedDay = useMemo(() => {
    if (selectedDay && days.some(({ day }) => day === selectedDay)) {
      return selectedDay;
    }
    return defaultDay;
  }, [defaultDay, days, selectedDay]);

  const handleSelectDay = useCallback((day: string) => {
    setSelectedDay(day);
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (error || !bookmarkEventsById) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Bookmarks | {conf.name}</title>
        <meta name="description" content={`${conf.name} schedule for bookmarks`} />
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <h1 className="ui-heading-1 ui-container ui-page-title-centered">Bookmarks</h1>
        {bookmarks.length === 0 ? (
          <div className="ui-container ui-empty-state ui-page-empty-offset">
            <p>No bookmarks yet.</p>
            <Link
              to={`/${conf.slug}/schedule/`}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action"
            >
              Browse Schedule
            </Link>
          </div>
        ) : days.length > 0 && resolvedDay ? (
          <ScheduleEvents
            conf={conf}
            days={days}
            selectedDay={resolvedDay}
            onSelectDay={handleSelectDay}
            bookmarks={scheduleBookmarks}
            nowSeconds={nowSeconds}
            activeFilter="bookmarks"
          />
        ) : (
          <div className="ui-container ui-empty-state ui-page-empty-offset">
            <p>No upcoming events match your saved bookmarks.</p>
            <Link
              to={`/${conf.slug}/schedule/`}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action"
            >
              View Full Schedule
            </Link>
          </div>
        )}
      </ConferenceLayout>
    </>
  );
}
