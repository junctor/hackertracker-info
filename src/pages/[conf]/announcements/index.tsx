import type { GetStaticProps } from "next";

import Head from "next/head";
import React from "react";
import useSWR from "swr";

import AnnouncementsList from "@/features/announcements/AnnouncementsList";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { fetcher } from "@/lib/misc";
import { buildConferenceStaticPaths, getConferenceFromParams } from "@/lib/next-static";
import { ArticlesStore } from "@/lib/types/ht-types";
import { PageId } from "@/lib/types/page-meta";

type AnnouncementsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function AnnouncementsPage({ conf, activePageId }: AnnouncementsPageProps) {
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
        <meta name="description" content={`Latest announcements and updates for ${conf.name}.`} />
      </Head>
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          <AnnouncementsList announcements={articles} conference={conf} />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<AnnouncementsPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "announcements" } };
};
