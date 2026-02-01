import React, { useMemo } from "react";
import useSWR from "swr";
import Head from "next/head";
import { useRouter } from "next/router";
import type { GetStaticProps } from "next";
import { fetcher } from "@/lib/misc";
import { getBookmarks } from "@/lib/storage";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import ContentList from "@/features/content/ContentList";
import ContentDetails from "@/features/content/ContentDetails";
import { ConferenceManifest } from "@/lib/conferences";
import { PageId } from "@/lib/types/page-meta";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import {
  ContentStore,
  EventsStore,
  LocationsStore,
  PeopleStore,
  TagsStore,
} from "@/lib/types/ht-types";
import {
  ContentCardsView,
  TagTypesBrowseView,
} from "@/lib/types/ht-types/views";
import useNumericQueryParam from "@/lib/utils/useNumericQueryParam";

type ContentsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function ContentsPage({
  conf,
  activePageId,
}: ContentsPageProps) {
  const router = useRouter();
  const {
    value: contentId,
    isReady,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
  } = useNumericQueryParam(router, "id");

  const shouldLoadDetails =
    isReady && !isIdMissing && !isIdInvalid && contentId !== null;
  const shouldLoadList = isReady && isIdMissing;

  const {
    data: contentCards,
    error: contentCardsError,
    isLoading: contentCardsLoading,
  } = useSWR<ContentCardsView>(
    shouldLoadList ? `${conf.dataRoot}/views/contentCards.json` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const {
    data: tagTypes,
    error: tagTypesError,
    isLoading: tagTypesLoading,
  } = useSWR<TagTypesBrowseView>(
    shouldLoadList ? `${conf.dataRoot}/views/tagTypesBrowse.json` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const {
    data: contentStore,
    error: contentStoreError,
    isLoading: contentStoreLoading,
  } = useSWR<ContentStore>(
    shouldLoadDetails ? `${conf.dataRoot}/entities/content.json` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const {
    data: peopleStore,
    error: peopleError,
    isLoading: peopleLoading,
  } = useSWR<PeopleStore>(
    shouldLoadDetails ? `${conf.dataRoot}/entities/people.json` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const {
    data: eventsStore,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR<EventsStore>(
    shouldLoadDetails ? `${conf.dataRoot}/entities/events.json` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const {
    data: locationsStore,
    error: locationsError,
    isLoading: locationsLoading,
  } = useSWR<LocationsStore>(
    shouldLoadDetails ? `${conf.dataRoot}/entities/locations.json` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const {
    data: tagsStore,
    error: tagsError,
    isLoading: tagsLoading,
  } = useSWR<TagsStore>(
    shouldLoadDetails ? `${conf.dataRoot}/entities/tags.json` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const bookmarks = useMemo(() => getBookmarks(), []);

  const metaDescription = useMemo(() => {
    const fallback = `Learn more about ${conf.name} content.`;
    const rawDescription = contentStore?.byId[contentId ?? -1]?.description;
    const base =
      rawDescription && rawDescription.trim().length > 0
        ? rawDescription
        : fallback;
    const normalized = base.replace(/\s+/g, " ").trim();
    if (normalized.length === 0) return fallback;
    if (normalized.length <= 150) return normalized;
    return `${normalized.slice(0, 147).trimEnd()}...`;
  }, [conf.name, contentId, contentStore]);

  if (!isReady) return <LoadingScreen />;
  if (isIdInvalid) return <ErrorScreen msg="Invalid content id." />;

  if (shouldLoadDetails) {
    const isDetailLoading =
      contentStoreLoading ||
      peopleLoading ||
      eventsLoading ||
      locationsLoading ||
      tagsLoading;
    const detailError =
      contentStoreError ||
      peopleError ||
      eventsError ||
      locationsError ||
      tagsError;

    if (isDetailLoading) return <LoadingScreen />;
    if (
      detailError ||
      !contentStore ||
      !peopleStore ||
      !eventsStore ||
      !locationsStore ||
      !tagsStore
    ) {
      return <ErrorScreen />;
    }

    const content = contentStore.byId[contentId] ?? null;
    if (!content) return <ErrorScreen msg="Content not found." />;

    const sessions = Object.values(eventsStore.byId).filter(
      (event) => event.contentId === content.id,
    );
    const locationIds = new Set(sessions.map((event) => event.locationId));
    const locations = Object.values(locationsStore.byId).filter((location) =>
      locationIds.has(location.id),
    );
    const people = (content.people ?? [])
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((p) => peopleStore.byId[p.personId])
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
    const tags = content.tagIds
      .map((id) => tagsStore.byId[id])
      .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag));
    const relatedContent = (content.relatedContentIds ?? [])
      .map((id) => contentStore.byId[id])
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    return (
      <>
        <Head>
          <title>
            {content.title} | {conf.name}
          </title>
          <meta name="description" content={metaDescription} />
        </Head>
        <main>
          <SiteHeader conference={conf} activePageId={activePageId} />
          <ContentDetails
            content={content}
            sessions={sessions}
            locations={locations}
            people={people}
            related_content={relatedContent}
            tags={tags}
            bookmarks={bookmarks}
          />
        </main>
      </>
    );
  }

  if (contentCardsLoading || tagTypesLoading) return <LoadingScreen />;
  if (contentCardsError || tagTypesError || !contentCards || !tagTypes) {
    return <ErrorScreen msg="Failed to load content." />;
  }

  return (
    <>
      <Head>
        <title>Content | {conf.name}</title>
        <meta
          name="description"
          content={`Browse talks, workshops, and presentations at ${conf.name}.`}
        />
      </Head>
      <main>
        <SiteHeader conference={conf} activePageId={activePageId} />
        <ContentList content={contentCards} tags={tagTypes} conference={conf} />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<ContentsPageProps> = async (
  ctx,
) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "content" } };
};
