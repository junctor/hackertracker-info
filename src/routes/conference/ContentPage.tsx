import { useMemo, type ReactElement } from "react";

import type {
  ContentCardsView,
  ContentDetailView,
  ContentDetailsById,
  TagTypesBrowseView,
} from "@/lib/types/ht-types/views";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ConferenceLoadingScreen from "@/features/app-shell/ConferenceLoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import ContentDetails from "@/features/content/ContentDetails";
import ContentList from "@/features/content/ContentList";
import { aiMetadata, conferenceDataFeeds, conferencePath } from "@/lib/aiMetadata";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { conferenceCollectionPath, conferenceMenuPath, contentPath } from "@/lib/routes";
import { getBookmarks } from "@/lib/storage";
import { PageId } from "@/lib/types/page-meta";
import useNumericRouteParam from "@/lib/utils/useNumericRouteParam";

type ContentPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export function resolveRelatedContentCards(
  contentDetail: ContentDetailView,
  contentDetailsById: ContentDetailsById,
): ContentCardsView {
  const relatedIds = contentDetail.content.relatedContentIds ?? [];
  const seenIds = new Set<number>();
  const relatedContent: ContentCardsView = [];

  for (const relatedId of relatedIds) {
    if (relatedId === contentDetail.content.id || seenIds.has(relatedId)) {
      continue;
    }

    seenIds.add(relatedId);

    const relatedDetail = contentDetailsById[String(relatedId)];
    if (!relatedDetail) continue;

    const card = {
      id: relatedDetail.content.id,
      tags: relatedDetail.tags,
      title: relatedDetail.content.title,
    };

    if (relatedDetail.content.logoUrl) {
      relatedContent.push({ ...card, logoUrl: relatedDetail.content.logoUrl });
    } else {
      relatedContent.push(card);
    }
  }

  return relatedContent;
}

export default function ContentPage({ conf, activePageId }: ContentPageProps) {
  const contentListHref = conferenceCollectionPath(conf, "content");
  const conferenceHomeHref = conferenceMenuPath(conf);
  const {
    value: contentId,
    isReady,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
    isRedirectingLegacyUrl,
  } = useNumericRouteParam("id", { legacyCanonicalBasePath: contentListHref });

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

  const contentDetail = shouldLoadDetails ? contentDetailsById?.[String(contentId)] : undefined;

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

  if (!isReady || isRedirectingLegacyUrl) {
    return (
      <ConferenceLoadingScreen conference={conf} activePageId={activePageId} label="content" />
    );
  }
  if (isIdInvalid) {
    return (
      <ErrorScreen
        title="Content not found"
        copy="Use a numeric content ID, or browse all conference content."
        kicker="Not found"
        primaryActionHref={contentListHref}
        primaryActionLabel="Browse Content"
        secondaryActionHref={conferenceHomeHref}
        secondaryActionLabel="Conference Home"
      />
    );
  }

  let pageTitle = `Content | ${conf.name}`;
  let pageDescription = `Sessions, talks, and presentation details for ${conf.name}.`;
  let pageContent: ReactElement;

  if (shouldLoadDetails) {
    if (contentDetailLoading) {
      return (
        <ConferenceLoadingScreen conference={conf} activePageId={activePageId} label="content" />
      );
    }
    if (contentDetailError) {
      return (
        <ErrorScreen
          title="Couldn't load content"
          copy="The content details could not be loaded. Try the content list instead."
          retryActionLabel="Retry"
          primaryActionHref={contentListHref}
          primaryActionLabel="Browse Content"
          secondaryActionHref={conferenceHomeHref}
          secondaryActionLabel="Conference Home"
        />
      );
    }
    if (!contentDetail) {
      return (
        <ErrorScreen
          title="Content not found"
          copy={`No content item exists for ID ${contentId}.`}
          kicker="Not found"
          primaryActionHref={contentListHref}
          primaryActionLabel="Browse Content"
          secondaryActionHref={conferenceHomeHref}
          secondaryActionLabel="Conference Home"
        />
      );
    }

    const { content, sessions, locations, people, tags } = contentDetail;
    const relatedContent = resolveRelatedContentCards(contentDetail, contentDetailsById ?? {});

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
        relatedContent={relatedContent}
        bookmarks={bookmarks}
        conference={conf}
      />
    );
  } else {
    if (contentCardsLoading || tagTypesLoading) {
      return (
        <ConferenceLoadingScreen conference={conf} activePageId={activePageId} label="content" />
      );
    }
    if (contentCardsError || tagTypesError || !contentCards || !tagTypes) {
      return (
        <ErrorScreen
          title="Couldn't load content"
          copy="The content list could not be loaded. Try again, or return to the conference home page."
          msg="Failed to load content."
          retryActionLabel="Retry"
          primaryActionHref={conferenceHomeHref}
          primaryActionLabel="Conference Home"
        />
      );
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
          path:
            shouldLoadDetails && contentId !== null
              ? contentPath(conf, contentId)
              : conferencePath(conf, "content/"),
          jsonFeeds: conferenceDataFeeds(conf),
        })}
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        {pageContent}
      </ConferenceLayout>
    </>
  );
}
