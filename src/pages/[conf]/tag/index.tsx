import React, { useMemo, useState, useCallback } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import SiteFooter from "@/features/app-shell/SiteFooter";
import ScheduleEvents, {
  ScheduleDay,
  ScheduleEventViewModel,
} from "@/features/schedule/ScheduleEvents";
import { getBookmarks } from "@/lib/storage";
import Head from "next/head";
import { useRouter } from "next/router";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";
import { PageId } from "@/lib/types/page-meta";
import useNumericQueryParam from "@/lib/utils/useNumericQueryParam";
import {
  EventsByDayIndex,
  EventsByTagIndex,
  EventsStore,
  LocationsStore,
  PeopleStore,
  TagsStore,
} from "@/lib/types/ht-types";

type TagPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

const INITIAL_NOW_SECONDS = Math.floor(Date.now() / 1000);
const swrOptions = { revalidateOnFocus: false, revalidateOnReconnect: false };

function getTagEventIds(tagIndex: unknown): string[] {
  if (Array.isArray(tagIndex)) {
    return tagIndex.map((id) => String(id));
  }

  if (!tagIndex || typeof tagIndex !== "object") {
    return [];
  }

  const candidate = tagIndex as {
    eventIds?: unknown;
    ids?: unknown;
    events?: unknown;
  };

  if (Array.isArray(candidate.eventIds)) {
    return candidate.eventIds.map((id) => String(id));
  }
  if (Array.isArray(candidate.ids)) {
    return candidate.ids.map((id) => String(id));
  }
  if (Array.isArray(candidate.events)) {
    return candidate.events.map((id) => String(id));
  }

  return [];
}

export default function TagPage({ conf, activePageId }: TagPageProps) {
  const router = useRouter();
  const {
    value: tagId,
    isReady,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
  } = useNumericQueryParam(router, "id");

  const {
    data: eventsByTag,
    error: eventsByTagError,
    isLoading: eventsByTagLoading,
  } = useSWR<EventsByTagIndex>(
    `${conf.dataRoot}/indexes/eventsByTag.json`,
    fetcher,
    swrOptions,
  );

  const {
    data: eventsByDay,
    error: eventsByDayError,
    isLoading: eventsByDayLoading,
  } = useSWR<EventsByDayIndex>(
    `${conf.dataRoot}/indexes/eventsByDay.json`,
    fetcher,
    swrOptions,
  );

  const {
    data: eventsStore,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR<EventsStore>(
    `${conf.dataRoot}/entities/events.json`,
    fetcher,
    swrOptions,
  );

  const {
    data: locationsStore,
    error: locationsError,
    isLoading: locationsLoading,
  } = useSWR<LocationsStore>(
    `${conf.dataRoot}/entities/locations.json`,
    fetcher,
    swrOptions,
  );

  const {
    data: tagsStore,
    error: tagsError,
    isLoading: tagsLoading,
  } = useSWR<TagsStore>(
    `${conf.dataRoot}/entities/tags.json`,
    fetcher,
    swrOptions,
  );

  const {
    data: peopleStore,
    error: peopleError,
    isLoading: peopleLoading,
  } = useSWR<PeopleStore>(
    `${conf.dataRoot}/entities/people.json`,
    fetcher,
    swrOptions,
  );

  const loading =
    eventsByTagLoading ||
    eventsByDayLoading ||
    eventsLoading ||
    locationsLoading ||
    tagsLoading ||
    peopleLoading;
  const isError =
    eventsByTagError ||
    eventsByDayError ||
    eventsError ||
    locationsError ||
    tagsError ||
    peopleError;

  const bookmarks = useMemo(() => getBookmarks(), []);

  const tag = useMemo(
    () =>
      tagId != null
        ? tagsStore?.byId?.[String(tagId)] ?? tagsStore?.byId?.[tagId]
        : null,
    [tagsStore, tagId],
  );

  const tagEventIds = useMemo(() => {
    if (!eventsByTag || tagId === null) return new Set<string>();
    const raw =
      eventsByTag[String(tagId)] ??
      (eventsByTag as Record<number, unknown>)[tagId];
    return new Set<string>(getTagEventIds(raw));
  }, [eventsByTag, tagId]);

  const days: ScheduleDay[] = useMemo(() => {
    if (
      !eventsByDay ||
      !eventsStore ||
      !locationsStore ||
      !tagsStore ||
      !peopleStore ||
      tagEventIds.size === 0
    ) {
      return [];
    }

    const dayKeys = Object.keys(eventsByDay).sort();
    const result: ScheduleDay[] = [];
    const timeFormatter = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

    for (const day of dayKeys) {
      const ids = eventsByDay[day] ?? [];
      const events: ScheduleEventViewModel[] = [];

      for (const eventId of ids) {
        const eventIdKey = String(eventId);
        if (!tagEventIds.has(eventIdKey)) continue;

        const event = eventsStore.byId[eventIdKey];
        if (!event) continue;

        const locationName =
          locationsStore.byId[String(event.locationId)]?.name ??
          "Unknown location";

        const tags: ScheduleEventViewModel["tags"] = [];
        for (const eventTagId of event.tagIds ?? []) {
          const eventTag = tagsStore.byId[String(eventTagId)];
          if (!eventTag) continue;
          tags.push({
            id: eventTag.id,
            label: eventTag.label,
            colorBackground: eventTag.colorBackground,
            colorForeground: eventTag.colorForeground,
          });
        }

        const speakerIds =
          event.speakerIds && event.speakerIds.length > 0
            ? event.speakerIds
            : (event.personIds ?? []);
        const speakers = speakerIds
          .map((id) => peopleStore.byId[String(id)]?.name)
          .filter((name): name is string => Boolean(name))
          .join(", ");

        const beginDate = new Date(event.begin);
        const endDate = new Date(event.end);

        events.push({
          id: event.id,
          title: event.title,
          begin: event.begin,
          end: event.end,
          beginDisplay: timeFormatter.format(beginDate),
          beginIso: beginDate.toISOString(),
          beginTimestampSeconds: Math.floor(beginDate.getTime() / 1000),
          endDisplay: timeFormatter.format(endDate),
          endIso: endDate.toISOString(),
          endTimestampSeconds: Math.floor(endDate.getTime() / 1000),
          color: event.color,
          contentId: event.contentId,
          locationName,
          tags,
          speakers: speakers.length > 0 ? speakers : null,
        });
      }

      events.sort(
        (a, b) => a.beginTimestampSeconds - b.beginTimestampSeconds,
      );
      if (events.length > 0) {
        result.push({ day, events });
      }
    }

    return result;
  }, [
    eventsByDay,
    eventsStore,
    locationsStore,
    tagsStore,
    peopleStore,
    tagEventIds,
  ]);

  const defaultDay = useMemo(() => {
    if (days.length === 0) return null;
    const nowSeconds = INITIAL_NOW_SECONDS;
    for (const { day, events } of days) {
      for (const event of events) {
        if (
          event.beginTimestampSeconds <= nowSeconds &&
          nowSeconds <= event.endTimestampSeconds
        ) {
          return day;
        }
      }
    }
    return days[0].day;
  }, [days]);

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

  if (!isReady) return <LoadingScreen />;
  if (isIdInvalid) return <ErrorScreen msg="Invalid tag id." />;
  if (isIdMissing) return <ErrorScreen msg="Missing tag id." />;
  if (loading) return <LoadingScreen />;
  if (
    isError ||
    !eventsByTag ||
    !eventsByDay ||
    !eventsStore ||
    !locationsStore ||
    !tagsStore ||
    !peopleStore
  ) {
    return <ErrorScreen />;
  }
  if (!tag) return <ErrorScreen msg="Tag not found" />;

  return (
    <>
      <Head>
        <title>
          {tag.label} | {conf.name}
        </title>
        <meta
          name="description"
          content={`${conf.name} schedule for ${tag.label}`}
        />
      </Head>
      <div className="min-h-screen flex flex-col">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main className="flex-1">
          <h1 className="text-3xl font-bold text-center mb-6 my-10">
            {tag.label} Schedule
          </h1>
          {days.length > 0 && resolvedDay ? (
            <ScheduleEvents
              conf={conf}
              days={days}
              selectedDay={resolvedDay}
              onSelectDay={handleSelectDay}
              bookmarks={bookmarks}
            />
          ) : (
            <p className="mt-8 text-center text-gray-500">
              No events found for this tag.
            </p>
          )}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<TagPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "tag" } };
};
