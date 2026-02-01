import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import Head from "next/head";
import TagsList from "@/features/tags/TagsList";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";
import { PageId } from "@/lib/types/page-meta";
import { TagTypesBrowseView } from "@/lib/types/ht-types";

type TagsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function TagsPage({ conf, activePageId }: TagsPageProps) {
  const {
    data: tags,
    error,
    isLoading,
  } = useSWR<TagTypesBrowseView>(
    `/ht/${conf.slug}/views/tagTypesBrowse.json`,
    fetcher,
  );

  if (isLoading) return <LoadingScreen />;
  if (error || !tags) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Tags | {conf.name} 2026</title>
        <meta
          name="description"
          content={`Explore the various tags used in ${conf.name} 2026.`}
        />
      </Head>
      <main>
        <SiteHeader conference={conf} activePageId={activePageId} />
        <TagsList tagTypes={tags} />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<TagsPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "tags" } };
};
