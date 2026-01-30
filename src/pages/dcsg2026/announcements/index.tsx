import React from "react";
import useSWR from "swr";
import Head from "next/head";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import AnnouncementsList from "@/features/announcements/AnnouncementsList";
import { getConference } from "@/lib/conferences";
import { ArticlesStore } from "@/lib/types/ht-types";

export default function AnnouncementsPage() {
  const conference = getConference("dcsg2026");
  if (!conference) {
    return <ErrorScreen msg="Conference not found." />;
  }

  const {
    data: articles,
    error,
    isLoading,
  } = useSWR<ArticlesStore>(
    `${conference.dataRoot}/entities/articles.json`,
    fetcher,
  );

  if (isLoading) return <LoadingScreen />;
  if (error || !articles) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Announcements | {conference.name}</title>
        <meta
          name="description"
          content={`Latest announcements and updates for ${conference.name}.`}
        />
      </Head>
      <main>
        <SiteHeader conference={conference} />
        <AnnouncementsList announcements={articles} conference={conference} />
      </main>
    </>
  );
}
