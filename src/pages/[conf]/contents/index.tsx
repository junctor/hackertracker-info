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
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";
import { PageId } from "@/lib/types/page-meta";

type ContentsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function ContentsPage({ conf, activePageId }: ContentsPageProps) {
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
        <SiteHeader conference={conf} activePageId={activePageId} />
        <ContentList content={items!} tags={tags ?? []} />
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
  return { props: { conf: result.conf, activePageId: "contents" } };
};
