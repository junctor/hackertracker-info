import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import { Articles } from "@/lib/types/info";
import AnnouncementsList from "@/features/announcements/AnnouncementsList";

export default function AnnoucementsPage() {
  const {
    data: articles,
    error,
    isLoading,
  } = useSWR<Articles>("/ht/dcsg2026/articles.json", fetcher);

  if (isLoading) return <LoadingScreen />;
  if (error || !articles) return <ErrorScreen />;

  return (
    <main>
      <SiteHeader />
      <AnnouncementsList announcements={articles} />
    </main>
  );
}
