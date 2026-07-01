import React, { lazy, useMemo, type ReactElement } from "react";

import type {
  ContentCardsView,
  ContentDetailsById,
  TagTypesBrowseView,
} from "@/lib/types/ht-types/views";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ContentList from "@/features/content/ContentList";
import { aiMetadata, conferenceDataFeeds, conferencePath } from "@/lib/aiMetadata";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { getBookmarks } from "@/lib/storage";
import { PageId } from "@/lib/types/page-meta";
import useNumericQueryParam from "@/lib/utils/useNumericQueryParam";

type ContentPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

const ContentDetails = lazy(() => import("@/features/content/ContentDetails"));

export default function ContentPage({ conf, activePageId }: ContentPageProps) {
  const {
    value: contentId,
    isReady,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
  } = useNumericQueryParam("id");

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
    data: contentDetailsById,
    error: contentDetailError,
    isLoading: contentDetailLoading,
  } = useConferenceJson<ContentDetailsById>(
    conf,
    shouldLoadDetails ? "details/content.json" : null,
  );

  const contentDetail = contentId !== null ? contentDetailsById?.[String(contentId)] : undefined;

  const bookmarks = useMemo(() => getBookmarks(), []);

  const metaDescription = useMemo(() => {
    const fallback = `Learn more about ${conf.name} content.`;
    const rawDescription = contentDetail?.content.description;
    const base = rawDescription && rawDescription.trim().length > 0 ? rawDescription : fallback;
    const normalized = base.replace(/\s+/g, " ").trim();
    if (normalized.length === 0) return fallback;
    if (normalized.length <= 150) return normalized;
    return `${normalized.slice(0, 147).trimEnd()}...`;
  }, [conf.name, contentDetail]);

  if (!isReady) return <LoadingScreen />;
  if (isIdInvalid) return <ErrorScreen msg="Invalid content id." />;

  let pageTitle = `Content | ${conf.name}`;
  let pageDescription = `Sessions, talks, and presentation details for ${conf.name}.`;
  let pageContent: ReactElement;

  if (shouldLoadDetails) {
    const isDetailLoading = contentDetailLoading;
    const detailError = contentDetailError;

    if (isDetailLoading) return <LoadingScreen />;
    if (detailError || !contentDetail) {
      return <ErrorScreen />;
    }

    const { content, sessions, locations, people, tags } = contentDetail;

    pageTitle = `${content.title} | ${conf.name}`;
    pageDescription = metaDescription;
    pageContent = (
      <ContentDetails
        key={content.id}
        content={content}
        sessions={sessions}
        locations={locations}
        people={people}
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
        {aiMetadata({
          title: pageTitle,
          description: pageDescription,
          path: conferencePath(
            conf,
            shouldLoadDetails && contentId !== null ? `content/?id=${contentId}` : "content/",
          ),
          jsonFeeds: conferenceDataFeeds(conf),
        })}
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        {pageContent}
      </ConferenceLayout>
    </>
  );
}
