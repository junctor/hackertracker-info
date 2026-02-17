import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import SiteFooter from "@/features/app-shell/SiteFooter";
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
    `${conf.dataRoot}/views/tagTypesBrowse.json`,
    fetcher,
  );

  if (isLoading) return <LoadingScreen />;
  if (error || !tags) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Tags | {conf.name}</title>
        <meta
          name="description"
          content={`Explore the various tags used in ${conf.name}.`}
        />
      </Head>
      <div className="min-h-screen flex flex-col">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main className="flex-1">
          <TagsList tagTypes={tags} conference={conf} />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<TagsPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "tags" } };
};
