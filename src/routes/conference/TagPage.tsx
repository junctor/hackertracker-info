import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ScheduleSessions from "@/features/schedule/ScheduleSessions";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { useNowSeconds } from "@/lib/hooks/useNowSeconds";
import { getBookmarks } from "@/lib/storage";
import { TagDetailsById } from "@/lib/types/ht-types/views";
import { PageId } from "@/lib/types/page-meta";
import useNumericQueryParam from "@/lib/utils/useNumericQueryParam";

type TagPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function TagPage({ conf, activePageId }: TagPageProps) {
  const nowSeconds = useNowSeconds();
  const {
    value: tagId,
    isReady,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
  } = useNumericQueryParam("id");
  const shouldLoadTag = isReady && !isIdMissing && !isIdInvalid && tagId !== null;

  const {
    data: tagsById,
    error,
    isLoading,
  } = useConferenceJson<TagDetailsById>(conf, shouldLoadTag ? "details/tags.json" : null);

  const tagDetail = shouldLoadTag ? tagsById?.[String(tagId)] : undefined;

  const bookmarks = useMemo(() => getBookmarks(), []);

  const tag = tagDetail?.tag ?? null;
  const days = useMemo(() => tagDetail?.days ?? [], [tagDetail]);

  const defaultDay = useMemo(() => {
    if (days.length === 0) return null;
    for (const { day, sessions } of days) {
      for (const session of sessions) {
        if (
          session.beginTimestampSeconds <= nowSeconds &&
          nowSeconds <= session.endTimestampSeconds
        ) {
          return day;
        }
      }
    }
    return days[0].day;
  }, [days, nowSeconds]);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDay(null);
  }, [tagId]);

  const resolvedDay = useMemo(() => {
    if (selectedDay && days.some(({ day }) => day === selectedDay)) {
      return selectedDay;
    }
    return defaultDay;
  }, [defaultDay, days, selectedDay]);

  const handleSelectDay = useCallback((day: string) => {
    setSelectedDay(day);
  }, []);

  const emptyMessage = "No sessions are scheduled for this tag.";

  if (!isReady) return <LoadingScreen />;
  if (isIdInvalid) return <ErrorScreen msg="Invalid tag id." />;
  if (isIdMissing) return <ErrorScreen msg="Missing tag id." />;
  if (isLoading) return <LoadingScreen />;
  if (error || !tagDetail) return <ErrorScreen />;
  if (!tag) return <ErrorScreen msg="Tag not found" />;

  return (
    <>
      <Head>
        <title>
          {tag.label} | {conf.name}
        </title>
        <meta name="description" content={`${conf.name} schedule for ${tag.label}`} />
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <h1 className="ui-heading-1 ui-container ui-page-title-centered ui-page-title-accent">
          {tag.label} Schedule
        </h1>
        {days.length > 0 && resolvedDay ? (
          <ScheduleSessions
            key={tag.id}
            conf={conf}
            days={days}
            selectedDay={resolvedDay}
            onSelectDay={handleSelectDay}
            bookmarks={bookmarks}
            nowSeconds={nowSeconds}
            activeFilter="tags"
          />
        ) : (
          <div className="ui-container ui-empty-state ui-page-empty-offset">
            <p>{emptyMessage}</p>
            <Link
              to={`/${conf.slug}/tags/`}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action"
            >
              Browse Tags
            </Link>
          </div>
        )}
      </ConferenceLayout>
    </>
  );
}
