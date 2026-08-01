import type { ComponentType, SVGProps } from "react";

import { CalendarDaysIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ConferenceLoadingScreen from "@/features/app-shell/ConferenceLoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import {
  buildFilterDestinationPath,
  FILTER_DESTINATION_PARAM,
  type FilterDestination,
  parseFilterDestination,
} from "@/features/filters/filterRoutes";
import {
  countMatchingContent,
  countMatchingSessions,
  filterTagGroupsToKnownIds,
  flattenTagGroups,
  getUnavailableTagIds,
  groupSelectedTagsByType,
  parseTagGroups,
  serializeTagGroups,
  TAG_GROUP_PARAM,
} from "@/features/filters/tagFilters";
import TagsList from "@/features/tags/TagsList";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { ContentCardsView, ScheduleDaysView, TagTypesBrowseView } from "@/lib/types/ht-types";
import { PageId } from "@/lib/types/page-meta";

type TagsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export type FilterViewConfig = {
  destination: FilterDestination;
  destinationHref: string;
  actionLabel: string;
  singularResultLabel: string;
  pluralResultLabel: string;
  emptyResultLabel: string;
  combinationResultLabel: string;
  combinationResultVerb: "match" | "matches";
  countingLabel: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export function resolveFilterViewConfig(
  conf: ConferenceManifest,
  searchParams: URLSearchParams,
): FilterViewConfig {
  const destination = parseFilterDestination(searchParams.get(FILTER_DESTINATION_PARAM));
  const destinationHref = buildFilterDestinationPath(conf.slug, destination, searchParams);

  if (destination === "content") {
    return {
      destination,
      destinationHref,
      actionLabel: "View Content",
      singularResultLabel: "content item",
      pluralResultLabel: "content items",
      emptyResultLabel: "No matching content",
      combinationResultLabel: "content",
      combinationResultVerb: "matches",
      countingLabel: "Counting content...",
      description: `Filter ${conf.name} content by tag.`,
      icon: DocumentTextIcon,
    };
  }

  return {
    destination,
    destinationHref,
    actionLabel: "View Schedule",
    singularResultLabel: "session",
    pluralResultLabel: "sessions",
    emptyResultLabel: "No matching sessions",
    combinationResultLabel: "sessions",
    combinationResultVerb: "match",
    countingLabel: "Counting sessions...",
    description: `Filter ${conf.name} schedule sessions by tag.`,
    icon: CalendarDaysIcon,
  };
}

export default function TagsPage({ conf, activePageId }: TagsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const destination = parseFilterDestination(searchParams.get(FILTER_DESTINATION_PARAM));
  const {
    data: tags,
    error,
    isLoading,
  } = useConferenceJson<TagTypesBrowseView>(conf, "views/tagTypesBrowse.json");

  const {
    data: scheduleDays,
    error: scheduleDaysError,
    isLoading: scheduleDaysLoading,
  } = useConferenceJson<ScheduleDaysView>(
    conf,
    destination === "schedule" ? "views/scheduleDays.json" : null,
  );

  const {
    data: contentCards,
    error: contentCardsError,
    isLoading: contentCardsLoading,
  } = useConferenceJson<ContentCardsView>(
    conf,
    destination === "content" ? "views/contentCards.json" : null,
  );

  const normalizedUrlTagGroups = useMemo(() => {
    if (!tags) return [];
    return filterTagGroupsToKnownIds(parseTagGroups(searchParams), tags);
  }, [searchParams, tags]);
  const selectedIds = useMemo(
    () => new Set(flattenTagGroups(normalizedUrlTagGroups)),
    [normalizedUrlTagGroups],
  );

  useEffect(() => {
    if (!tags) return;

    const normalizedParams = serializeTagGroups(searchParams, normalizedUrlTagGroups);
    if (normalizedParams.toString() === searchParams.toString()) return;

    setSearchParams(normalizedParams, { replace: true });
  }, [normalizedUrlTagGroups, searchParams, setSearchParams, tags]);

  const config = useMemo(() => {
    const paramsWithSelection = serializeTagGroups(searchParams, normalizedUrlTagGroups);
    return resolveFilterViewConfig(conf, paramsWithSelection);
  }, [conf, normalizedUrlTagGroups, searchParams]);

  const matchingResultCount = useMemo(() => {
    if (destination === "content") {
      return contentCards ? countMatchingContent(contentCards, normalizedUrlTagGroups) : null;
    }

    return scheduleDays ? countMatchingSessions(scheduleDays, normalizedUrlTagGroups) : null;
  }, [contentCards, destination, normalizedUrlTagGroups, scheduleDays]);

  const unavailableTagIds = useMemo(() => {
    if (!tags) return new Set<number>();

    if (destination === "content") {
      if (!contentCards) return new Set<number>();
      return getUnavailableTagIds(tags, selectedIds, (groups) =>
        countMatchingContent(contentCards, groups),
      );
    }

    if (!scheduleDays) return new Set<number>();
    return getUnavailableTagIds(tags, selectedIds, (groups) =>
      countMatchingSessions(scheduleDays, groups),
    );
  }, [contentCards, destination, scheduleDays, selectedIds, tags]);

  const handleToggleTag = useCallback(
    (tagId: number) => {
      if (!tags) return;

      const nextIds = new Set(selectedIds);
      if (nextIds.has(tagId)) {
        nextIds.delete(tagId);
      } else {
        nextIds.add(tagId);
      }

      setSearchParams(
        (current) => serializeTagGroups(current, groupSelectedTagsByType(nextIds, tags)),
        { replace: true },
      );
    },
    [selectedIds, setSearchParams, tags],
  );

  const handleClear = useCallback(() => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete(TAG_GROUP_PARAM);
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  if (isLoading) {
    return <ConferenceLoadingScreen conference={conf} activePageId={activePageId} />;
  }
  if (error || !tags) return <ErrorScreen />;

  const isPreviewLoading = destination === "content" ? contentCardsLoading : scheduleDaysLoading;
  const isPreviewUnavailable =
    destination === "content"
      ? Boolean(contentCardsError) || (!contentCardsLoading && !contentCards)
      : Boolean(scheduleDaysError) || (!scheduleDaysLoading && !scheduleDays);

  return (
    <>
      <Head>
        <title>Filters | {conf.name}</title>
        <meta name="description" content={config.description} />
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <TagsList
          tagTypes={tags}
          selectedIds={selectedIds}
          unavailableTagIds={unavailableTagIds}
          matchingResultCount={matchingResultCount}
          resultNouns={{
            singular: config.singularResultLabel,
            plural: config.pluralResultLabel,
            empty: config.emptyResultLabel,
            combination: config.combinationResultLabel,
            combinationVerb: config.combinationResultVerb,
            counting: config.countingLabel,
          }}
          isPreviewLoading={isPreviewLoading}
          isPreviewUnavailable={isPreviewUnavailable}
          destinationHref={config.destinationHref}
          destinationLabel={config.actionLabel}
          destinationIcon={config.icon}
          description={config.description}
          onClear={handleClear}
          onToggleTag={handleToggleTag}
        />
      </ConferenceLayout>
    </>
  );
}
