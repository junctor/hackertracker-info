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
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";

type AnnouncementsPageProps = {
  conf: ConferenceManifest;
};

export default function AnnouncementsPage({ conf }: AnnouncementsPageProps) {
  const {
    data: articles,
    error,
    isLoading,
  } = useSWR<ArticlesStore>(
    `${conf.dataRoot}/entities/articles.json`,
    fetcher,
  );

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
      <main>
        <SiteHeader conference={conf} />
        <AnnouncementsList announcements={articles} conference={conf} />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<AnnouncementsPageProps> = async (
  ctx,
) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf } };
};
