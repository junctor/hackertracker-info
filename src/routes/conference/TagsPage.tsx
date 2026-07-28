import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import {
  countMatchingSessions,
  filterTagGroupsToKnownIds,
  flattenTagGroups,
  groupSelectedTagsByType,
  parseTagGroups,
  serializeTagGroups,
  TAG_GROUP_PARAM,
} from "@/features/schedule/scheduleFilters";
import TagsList from "@/features/tags/TagsList";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { ScheduleDaysView, TagTypesBrowseView } from "@/lib/types/ht-types";
import { PageId } from "@/lib/types/page-meta";

type TagsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

function buildSchedulePath(confSlug: string, params: URLSearchParams): string {
  const query = params.toString();
  return `/${confSlug}/schedule/${query ? `?${query}` : ""}`;
}

export default function TagsPage({ conf, activePageId }: TagsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: tags,
    error,
    isLoading,
  } = useConferenceJson<TagTypesBrowseView>(conf, "views/tagTypesBrowse.json");

  const {
    data: scheduleDays,
    error: scheduleDaysError,
    isLoading: scheduleDaysLoading,
  } = useConferenceJson<ScheduleDaysView>(conf, "views/scheduleDays.json");

  const normalizedUrlTagGroups = useMemo(() => {
    if (!tags) return [];
    return filterTagGroupsToKnownIds(parseTagGroups(searchParams), tags);
  }, [searchParams, tags]);
  const selectedFromUrl = useMemo(
    () => flattenTagGroups(normalizedUrlTagGroups),
    [normalizedUrlTagGroups],
  );
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set(selectedFromUrl));

  useEffect(() => {
    setSelectedIds(new Set(selectedFromUrl));
  }, [selectedFromUrl]);

  useEffect(() => {
    if (!tags) return;

    const normalizedParams = serializeTagGroups(searchParams, normalizedUrlTagGroups);
    if (normalizedParams.toString() === searchParams.toString()) return;

    setSearchParams(() => normalizedParams, { replace: true });
  }, [normalizedUrlTagGroups, searchParams, setSearchParams, tags]);

  const selectedGroups = useMemo(
    () => (tags ? groupSelectedTagsByType(selectedIds, tags) : []),
    [selectedIds, tags],
  );

  const scheduleHref = useMemo(() => {
    return buildSchedulePath(conf.slug, serializeTagGroups(searchParams, selectedGroups));
  }, [conf.slug, searchParams, selectedGroups]);

  const matchingSessionCount = useMemo(() => {
    if (!scheduleDays) return null;
    return countMatchingSessions(scheduleDays, selectedGroups);
  }, [scheduleDays, selectedGroups]);

  const unavailableTagIds = useMemo(() => {
    const unavailable = new Set<number>();
    if (!tags || !scheduleDays) return unavailable;

    for (const tagType of tags) {
      for (const tag of tagType.tags) {
        if (selectedIds.has(tag.id)) continue;

        const candidateIds = new Set(selectedIds);
        candidateIds.add(tag.id);

        const candidateGroups = groupSelectedTagsByType(candidateIds, tags);
        if (countMatchingSessions(scheduleDays, candidateGroups) === 0) {
          unavailable.add(tag.id);
        }
      }
    }

    return unavailable;
  }, [scheduleDays, selectedIds, tags]);

  const handleToggleTag = useCallback((tagId: number) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  }, []);

  const handleClear = useCallback(() => {
    setSelectedIds(new Set());
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete(TAG_GROUP_PARAM);
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  if (isLoading) return <LoadingScreen />;
  if (error || !tags) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Filters | {conf.name}</title>
        <meta name="description" content={`Filter ${conf.name} schedule sessions by tag.`} />
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <TagsList
          tagTypes={tags}
          conference={conf}
          selectedIds={selectedIds}
          unavailableTagIds={unavailableTagIds}
          matchingSessionCount={matchingSessionCount}
          isPreviewLoading={scheduleDaysLoading}
          isPreviewUnavailable={
            Boolean(scheduleDaysError) || (!scheduleDaysLoading && !scheduleDays)
          }
          scheduleHref={scheduleHref}
          onClear={handleClear}
          onToggleTag={handleToggleTag}
        />
      </ConferenceLayout>
    </>
  );
}
