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
  const contentId = useMemo(
    () => (idParam ? Number(idParam) : null),
    [idParam]
  );

  const {
    data: contentsById,
    error,
    isLoading,
  } = useSWR<ProcessedContentById>("/ht/processedContentById.json", fetcher);

  const bookmarks = useMemo(() => getBookmarks(), []);

  const selectedContent = useMemo<ProcessedContentId | null>(() => {
    if (contentId === null) return null;
    return contentsById ? (contentsById[contentId] ?? null) : null;
  }, [contentsById, contentId]);

  if (isLoading) return <Loading />;
  if (error) return <Error msg="Failed to load content" />;
  if (selectedContent === null) return <Error msg="Content not found" />;

  return (
    <>
      <Head>
        <title>{selectedContent.title + " | DEF CON Content"}</title>
        <meta name="description" content={selectedContent.description} />
      </Head>
      <main>
        <Heading />
        <Content content={selectedContent} bookmarks={bookmarks} />
      </main>
    </>
  );
}
