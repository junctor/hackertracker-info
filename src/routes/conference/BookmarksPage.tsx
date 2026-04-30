import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Link } from "react-router";

import Head from "@/components/Head";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import {
  filterScheduleDaysByBookmarks,
  getScheduleDaysFromStores,
} from "@/features/schedule/scheduleData";
import ScheduleEvents from "@/features/schedule/ScheduleEvents";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { useNowSeconds } from "@/lib/hooks/useNowSeconds";
import { getBookmarks } from "@/lib/storage";
import {
  EventsByDayIndex,
  EventsStore,
  LocationsStore,
  PeopleStore,
  TagsStore,
} from "@/lib/types/ht-types";
import { PageId } from "@/lib/types/page-meta";

type BookmarksPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

function normalizeId(id: unknown): string {
  return String(id);
}

export default function BookmarksPage({ conf, activePageId }: BookmarksPageProps) {
  const nowSeconds = useNowSeconds();
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

  const loading =
    eventsByDayLoading || eventsLoading || locationsLoading || tagsLoading || peopleLoading;
  const isError = eventsByDayError || eventsError || locationsError || tagsError || peopleError;

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

  const fullScheduleDays = useMemo(() => {
    if (!eventsByDay || !eventsStore || !locationsStore || !tagsStore || !peopleStore) {
      return [];
    }
    return getScheduleDaysFromStores(conf, {
      eventsByDay,
      eventsStore,
      locationsStore,
      tagsStore,
      peopleStore,
    });
  }, [conf, eventsByDay, eventsStore, locationsStore, tagsStore, peopleStore]);

  const days = useMemo(
    () => filterScheduleDaysByBookmarks(fullScheduleDays, bookmarkSet),
    [bookmarkSet, fullScheduleDays],
  );

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

  if (loading) return <LoadingScreen />;
  if (isError || !eventsByDay || !eventsStore || !locationsStore || !tagsStore || !peopleStore) {
    return <ErrorScreen />;
  }

  return (
    <>
      <Head>
        <title>Bookmarks | {conf.name}</title>
        <meta name="description" content={`${conf.name} schedule for bookmarks`} />
      </Head>
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          <h1 className="ui-heading-1 ui-container mt-6 mb-4 text-center">Bookmarks</h1>
          {bookmarks.length === 0 ? (
            <div className="ui-container ui-empty-state mt-8">
              <p className="text-slate-200">No bookmarks yet.</p>
              <Link
                to={`/${conf.slug}/schedule`}
                className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action focus-visible:outline-none"
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
            <div className="ui-container ui-empty-state mt-8">
              <p className="text-slate-200">No upcoming events match your saved bookmarks.</p>
              <Link
                to={`/${conf.slug}/schedule`}
                className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action focus-visible:outline-none"
              >
                View Full Schedule
              </Link>
            </div>
          )}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
