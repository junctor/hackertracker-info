// src/pages/schedule/index.tsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import ScheduleEvents, {
  buildScheduleDaysFromGrouped,
  ScheduleDay,
} from "@/features/schedule/ScheduleEvents";
import { GroupedTag, GroupedTags } from "@/lib/types/info";
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

type TagPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function TagPage({ conf, activePageId }: TagPageProps) {
  const router = useRouter();
  const {
    value: tagId,
    isReady,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
  } = useNumericQueryParam(router, "id");

  const {
    data: tags,
    error,
    isLoading,
  } = useSWR<GroupedTags>(`${conf.dataRoot}/tags.json`, fetcher);

  const tag: GroupedTag | null = useMemo(() => {
    if (!tags || tagId === null) return null;
    const tag = tags[tagId];
    if (!tag) return null;
    return tag;
  }, [tags, tagId]);

  const bookmarks = useMemo(() => getBookmarks(), []);

  const days: ScheduleDay[] = useMemo(() => {
    if (!tag) return [];
    return buildScheduleDaysFromGrouped(tag.schedule);
  }, [tag]);

  const defaultDay = useMemo(() => {
    if (days.length === 0) return null;
    const nowSeconds = Math.floor(Date.now() / 1000);
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

  useEffect(() => {
    if (!defaultDay) return;
    if (!selectedDay || !days.some(({ day }) => day === selectedDay)) {
      setSelectedDay(defaultDay);
    }
  }, [defaultDay, days, selectedDay]);

  const handleSelectDay = useCallback((day: string) => {
    setSelectedDay(day);
  }, []);

  if (!isReady) return <LoadingScreen />;
  if (isIdInvalid) return <ErrorScreen msg="Invalid tag id." />;
  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  if (isIdMissing) return <ErrorScreen msg="Missing tag id." />;
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
      <SiteHeader conference={conf} activePageId={activePageId} />
      <main>
        <h1 className="text-3xl font-bold text-center mb-6 my-10">
          {tag.label} Schedule
        </h1>
        {days.length > 0 && selectedDay ? (
          <ScheduleEvents
            conf={conf}
            days={days}
            selectedDay={selectedDay}
            onSelectDay={handleSelectDay}
            bookmarks={bookmarks}
          />
        ) : (
          <p className="mt-8 text-center text-gray-500">
            No events found for this tag.
          </p>
        )}
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<TagPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "tag" } };
};
