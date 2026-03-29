import type { GetStaticProps } from "next";

import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo, type ReactElement } from "react";

import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import ContentDetails from "@/features/content/ContentDetails";
import ContentList from "@/features/content/ContentList";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { buildConferenceStaticPaths, getConferenceFromParams } from "@/lib/next-static";
import { getBookmarks } from "@/lib/storage";
import {
  ContentStore,
  EventsStore,
  LocationsStore,
  PeopleStore,
  TagsStore,
} from "@/lib/types/ht-types";
import { ContentCardsView, TagTypesBrowseView } from "@/lib/types/ht-types/views";
import { PageId } from "@/lib/types/page-meta";
import useNumericQueryParam from "@/lib/utils/useNumericQueryParam";

type ContentsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function ContentsPage({ conf, activePageId }: ContentsPageProps) {
  const router = useRouter();
  const {
    value: contentId,
    isReady,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
  } = useNumericQueryParam(router, "id");

  const shouldLoadDetails = isReady && !isIdMissing && !isIdInvalid && contentId !== null;
  const shouldLoadList = isReady && isIdMissing;

  const {
    data: contentCards,
    error: contentCardsError,
    isLoading: contentCardsLoading,
  } = useConferenceJson<ContentCardsView>(conf, shouldLoadList ? "views/contentCards.json" : null);

  const {
    data: tagTypes,
    error: tagTypesError,
    isLoading: tagTypesLoading,
  } = useConferenceJson<TagTypesBrowseView>(
    conf,
    shouldLoadList ? "views/tagTypesBrowse.json" : null,
  );

  const {
    data: contentStore,
    error: contentStoreError,
    isLoading: contentStoreLoading,
  } = useConferenceJson<ContentStore>(conf, shouldLoadDetails ? "entities/content.json" : null);

  const {
    data: peopleStore,
    error: peopleError,
    isLoading: peopleLoading,
  } = useConferenceJson<PeopleStore>(conf, shouldLoadDetails ? "entities/people.json" : null);

  const {
    data: eventsStore,
    error: eventsError,
    isLoading: eventsLoading,
  } = useConferenceJson<EventsStore>(conf, shouldLoadDetails ? "entities/events.json" : null);

  const {
    data: locationsStore,
    error: locationsError,
    isLoading: locationsLoading,
  } = useConferenceJson<LocationsStore>(conf, shouldLoadDetails ? "entities/locations.json" : null);

  const {
    data: tagsStore,
    error: tagsError,
    isLoading: tagsLoading,
  } = useConferenceJson<TagsStore>(conf, shouldLoadDetails ? "entities/tags.json" : null);

  const bookmarks = useMemo(() => getBookmarks(), []);

  const metaDescription = useMemo(() => {
    const fallback = `Learn more about ${conf.name} content.`;
    const rawDescription = contentStore?.byId[contentId ?? -1]?.description;
    const base = rawDescription && rawDescription.trim().length > 0 ? rawDescription : fallback;
    const normalized = base.replace(/\s+/g, " ").trim();
    if (normalized.length === 0) return fallback;
    if (normalized.length <= 150) return normalized;
    return `${normalized.slice(0, 147).trimEnd()}...`;
  }, [conf.name, contentId, contentStore]);

  if (!isReady) return <LoadingScreen />;
  if (isIdInvalid) return <ErrorScreen msg="Invalid content id." />;

  let pageTitle = `Content | ${conf.name}`;
  let pageDescription = `Sessions, talks, and presentation details for ${conf.name}.`;
  let pageContent: ReactElement;

  if (shouldLoadDetails) {
    const isDetailLoading =
      contentStoreLoading || peopleLoading || eventsLoading || locationsLoading || tagsLoading;
    const detailError =
      contentStoreError || peopleError || eventsError || locationsError || tagsError;

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
      .toSorted((a, b) => a.sortOrder - b.sortOrder)
      .map((p) => peopleStore.byId[p.personId])
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
    const tags = content.tagIds
      .map((id) => tagsStore.byId[id])
      .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag));
    const relatedContent = (content.relatedContentIds ?? [])
      .map((id) => contentStore.byId[id])
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    pageTitle = `${content.title} | ${conf.name}`;
    pageDescription = metaDescription;
    pageContent = (
      <ContentDetails
        content={content}
        sessions={sessions}
        locations={locations}
        people={people}
        related_content={relatedContent}
        tags={tags}
        bookmarks={bookmarks}
        conference={conf}
      />
    );
  } else {
    if (contentCardsLoading || tagTypesLoading) return <LoadingScreen />;
    if (contentCardsError || tagTypesError || !contentCards || !tagTypes) {
      return <ErrorScreen msg="Failed to load content." />;
    }
    pageContent = <ContentList content={contentCards} tags={tagTypes} conference={conf} />;
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          {pageContent}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<ContentsPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "content" } };
};
