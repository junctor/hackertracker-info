import React from "react";

import Head from "@/components/Head";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import TagsList from "@/features/tags/TagsList";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { TagTypesBrowseView } from "@/lib/types/ht-types";
import { PageId } from "@/lib/types/page-meta";

type TagsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function TagsPage({ conf, activePageId }: TagsPageProps) {
  const {
    data: tags,
    error,
    isLoading,
  } = useConferenceJson<TagTypesBrowseView>(conf, "views/tagTypesBrowse.json");

  if (isLoading) return <LoadingScreen />;
  if (error || !tags) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Tags | {conf.name}</title>
        <meta name="description" content={`Explore the various tags used in ${conf.name}.`} />
      </Head>
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          <TagsList tagTypes={tags} conference={conf} />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
