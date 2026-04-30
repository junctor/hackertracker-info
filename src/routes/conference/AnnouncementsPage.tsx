import React from "react";

import Head from "@/components/Head";
import AnnouncementsList from "@/features/announcements/AnnouncementsList";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
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
  } = useConferenceJson<ArticlesStore>(conf, "entities/articles.json");

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
