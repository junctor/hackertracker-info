"use client";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import ContentList from "@/features/content/ContentList";
import Head from "next/head";
import type { ProcessedContents, TagTypes } from "@/lib/types/info";

export default function ContentsPage() {
  const {
    data: items,
    error,
    isLoading,
  } = useSWR<ProcessedContents>("/ht//dcsg2026/processedContent.json", fetcher);

  const {
    data: tags,
    error: tagError,
    isLoading: tagIsLoading,
  } = useSWR<TagTypes>("/ht/tagtypes.json", fetcher);

  if (isLoading || tagIsLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen msg="Failed to load content" />;
  if (tagError) return <ErrorScreen msg="Failed to load tags" />;

  return (
    <>
      <Head>
        <title>Content | DEF CON Singapore 2026</title>
        <meta
          name="description"
          content="All DEF CON Singapore 2026 contents."
        />
      </Head>
      <main>
        <SiteHeader />
        <ContentList content={items!} tags={tags ?? []} />
      </main>
    </>
  );
}
