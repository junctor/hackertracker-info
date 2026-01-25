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

export default function ContentPage() {
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
        <SiteHeader />
        <ContentDetails
          content={selectedContent}
          related_content={relatedContent}
          bookmarks={bookmarks}
        />
      </main>
    </>
  );
}
