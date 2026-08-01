import { useMemo, useState, useCallback, useEffect } from "react";
import { Link } from "react-router";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ConferenceLoadingScreen from "@/features/app-shell/ConferenceLoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import ScheduleSessions, { ScheduleDay } from "@/features/schedule/ScheduleSessions";
import { isScheduleSessionLive } from "@/features/schedule/scheduleTime";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { useNowSeconds } from "@/lib/hooks/useNowSeconds";
import { getBookmarks } from "@/lib/storage";
import { BookmarkSessionsByIdView, ScheduleSessionViewModel } from "@/lib/types/ht-types/views";
import { PageId } from "@/lib/types/page-meta";

type BookmarksPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

function normalizeId(id: unknown): string {
  return String(id);
}

function getSessionDay(session: ScheduleSessionViewModel, formatter: Intl.DateTimeFormat): string {
  const date = new Date(session.begin);
  if (Number.isNaN(date.getTime())) return "";

  const parts = formatter.formatToParts(date);
  const byType = new Map(parts.map((part) => [part.type, part.value]));
  const year = byType.get("year");
  const month = byType.get("month");
  const day = byType.get("day");

  return year && month && day ? `${year}-${month}-${day}` : "";
}

function groupBookmarkedSessionsByDay(
  bookmarkSessionsById: BookmarkSessionsByIdView,
  bookmarkSet: ReadonlySet<string>,
  timeZone: string,
): ScheduleDay[] {
  if (bookmarkSet.size === 0) return [];

  const bookmarkedSessions = Object.values(bookmarkSessionsById)
    .filter((session) => bookmarkSet.has(String(session.id)))
    .toSorted((a, b) => {
      if (a.beginTimestampSeconds !== b.beginTimestampSeconds) {
        return a.beginTimestampSeconds - b.beginTimestampSeconds;
      }
      return a.id - b.id;
    });

  const days = new Map<string, ScheduleSessionViewModel[]>();
  const dayFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  for (const session of bookmarkedSessions) {
    const day = getSessionDay(session, dayFormatter);
    if (!day) continue;
    const list = days.get(day) ?? [];
    list.push(session);
    days.set(day, list);
  }

  return [...days.entries()].map(([day, sessions]) => ({ day, sessions }));
}

export default function BookmarksPage({ conf, activePageId }: BookmarksPageProps) {
  const nowSeconds = useNowSeconds();
  const {
    data: bookmarkSessionsById,
    error,
    isLoading,
  } = useConferenceJson<BookmarkSessionsByIdView>(conf, "views/bookmarkSessionsById.json");

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
    if (!bookmarkSessionsById) return [];
    return groupBookmarkedSessionsByDay(bookmarkSessionsById, bookmarkSet, conf.timezone);
  }, [bookmarkSessionsById, bookmarkSet, conf.timezone]);

  const defaultDay = useMemo(() => {
    if (days.length === 0) return null;
    for (const { day, sessions } of days) {
      for (const session of sessions) {
        if (isScheduleSessionLive(session, nowSeconds)) {
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

  if (isLoading) {
    return <ConferenceLoadingScreen conference={conf} activePageId={activePageId} />;
  }
  if (error || !bookmarkSessionsById) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Bookmarks | {conf.name}</title>
        <meta name="description" content={`${conf.name} saved schedule sessions.`} />
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
          <ScheduleSessions
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
            <p>No saved sessions are available in this conference data.</p>
            <Link
              to={`/${conf.slug}/schedule/`}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action"
            >
              View Schedule
            </Link>
          </div>
        )}
      </ConferenceLayout>
    </>
  );
}
