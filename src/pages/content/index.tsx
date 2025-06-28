"use client";
import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import ContentList from "@/components/content/ContentList";
import ContentDetail from "@/components/content/ContentDetail";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import type { ProcessedContent, ProcessedContents } from "@/types/info";

export default function ContentPage() {
  const params = useSearchParams();
  const idParam = params.get("id");
  const contentId = useMemo(
    () => (idParam ? Number(idParam) : null),
    [idParam]
  );

  const {
    data: items,
    error,
    isLoading,
  } = useSWR<ProcessedContents>("/ht/processedContent.json", fetcher);

  const selectedContent = useMemo<ProcessedContent | null>(() => {
    if (!items || contentId === null) return null;
    return items.find((c) => c.id === contentId) ?? null;
  }, [items, contentId]);

  if (isLoading) return <Loading />;
  if (error) return <Error msg="Failed to load content" />;
  if (contentId !== null && !selectedContent)
    return <Error msg="Content not found" />;

  return (
    <>
      <Head>
        <title>
          {selectedContent
            ? selectedContent.title + " | DEF CON Content"
            : "Content | DEF CON"}
        </title>
        <meta
          name="description"
          content={
            selectedContent
              ? selectedContent.description
              : "All DEF CON 33 content items."
          }
        />
      </Head>
      <main>
        <Heading />
        {selectedContent ? (
          <ContentDetail content={selectedContent} />
        ) : (
          <ContentList content={items!} />
        )}
      </main>
    </>
  );
}
