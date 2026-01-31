"use client";
import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import ContentDetails from "@/features/content/ContentDetails";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ProcessedContentById, ProcessedContentId } from "@/lib/types/info";
import { getBookmarks } from "@/lib/storage";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";
import { PageId } from "@/lib/types/page-meta";

type ContentPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function ContentPage({ conf, activePageId }: ContentPageProps) {
  const router = useRouter();
  const idParam = useMemo(() => {
    if (!router.isReady) return null;
    const value = router.query.id;
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  }, [router.isReady, router.query.id]);

  const contentId = useMemo<number | null>(
    () => (idParam ? Number(idParam) : null),
    [idParam],
  );

  const { data: contentsById, error } = useSWR<ProcessedContentById>(
    "/ht/processedContentById.json",
    fetcher,
  );

  const selectedContent = useMemo<ProcessedContentId | undefined>(
    () =>
      contentId !== null && contentsById ? contentsById[contentId] : undefined,
    [contentsById, contentId],
  );

  const relatedContent = useMemo<ProcessedContentId[]>(() => {
    if (!selectedContent?.related_content_ids) return [];
    return selectedContent.related_content_ids
      .map((rid) => contentsById![rid])
      .filter(Boolean) as ProcessedContentId[];
  }, [contentsById, selectedContent]);

  const bookmarks = useMemo(() => getBookmarks(), []);

  if (error) {
    return <ErrorScreen msg="Failed to load content" />;
  }

  if (!router.isReady || !contentsById || contentId === null) {
    return <LoadingScreen />;
  }

  if (!selectedContent) {
    return <ErrorScreen msg="Content not found" />;
  }

  return (
    <>
      <Head>
        <title>{`${selectedContent.title} | DEF CON Singapore 2026 Content`}</title>
        <meta name="description" content={selectedContent.description} />
      </Head>
      <main>
        <SiteHeader conference={conf} activePageId={activePageId} />
        <ContentDetails
          content={selectedContent}
          related_content={relatedContent}
          bookmarks={bookmarks}
        />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<ContentPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "content" } };
};
