"use client";
import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import Content from "@/components/content/Content";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import type { ProcessedContentById, ProcessedContentId } from "@/types/info";
import { getBookmarks } from "@/lib/storage";

export default function ContentPage() {
  const params = useSearchParams();
  const idParam = params.get("id");

  const contentId = useMemo<number | null>(
    () => (idParam ? Number(idParam) : null),
    [idParam]
  );

  const { data: contentsById, error } = useSWR<ProcessedContentById>(
    "/ht/processedContentById.json",
    fetcher
  );

  const selectedContent = useMemo<ProcessedContentId | undefined>(
    () =>
      contentId !== null && contentsById ? contentsById[contentId] : undefined,
    [contentsById, contentId]
  );

  const relatedContent = useMemo<ProcessedContentId[]>(() => {
    if (!selectedContent?.related_content_ids) return [];
    return selectedContent.related_content_ids
      .map((rid) => contentsById![rid])
      .filter(Boolean) as ProcessedContentId[];
  }, [contentsById, selectedContent]);

  const bookmarks = useMemo(() => getBookmarks(), []);

  if (error) {
    return <Error msg="Failed to load content" />;
  }

  if (!contentsById || contentId === null) {
    return <Loading />;
  }

  if (!selectedContent) {
    return <Error msg="Content not found" />;
  }

  return (
    <>
      <Head>
        <title>{`${selectedContent.title} | DEF CON Singapore 2025 Content`}</title>
        <meta name="description" content={selectedContent.description} />
      </Head>
      <main>
        <Heading />
        <Content
          content={selectedContent}
          related_content={relatedContent}
          bookmarks={bookmarks}
        />
      </main>
    </>
  );
}
