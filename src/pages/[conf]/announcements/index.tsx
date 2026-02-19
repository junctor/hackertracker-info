import React from "react";
import useSWR from "swr";
import Head from "next/head";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import AnnouncementsList from "@/features/announcements/AnnouncementsList";
import { ConferenceManifest } from "@/lib/conferences";
import { ArticlesStore } from "@/lib/types/ht-types";
import { PageId } from "@/lib/types/page-meta";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";
import SiteFooter from "@/features/app-shell/SiteFooter";

type AnnouncementsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function AnnouncementsPage({
  conf,
  activePageId,
}: AnnouncementsPageProps) {
  const {
    data: articles,
    error,
    isLoading,
  } = useSWR<ArticlesStore>(`${conf.dataRoot}/entities/articles.json`, fetcher);

  if (isLoading) return <LoadingScreen />;
  if (error || !articles) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Announcements | {conf.name}</title>
        <meta
          name="description"
          content={`Latest announcements and updates for ${conf.name}.`}
        />
      </Head>
      <div className="min-h-screen flex flex-col">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main className="flex-1">
          <AnnouncementsList announcements={articles} conference={conf} />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<AnnouncementsPageProps> = async (
  ctx,
) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "announcements" } };
};
