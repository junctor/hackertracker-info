import React from "react";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import DocumentsList from "@/features/documents/DocumentsList";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { DocumentsListView } from "@/lib/types/ht-types";
import { PageId } from "@/lib/types/page-meta";

type ReadmePageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function ReadmePage({ conf, activePageId }: ReadmePageProps) {
  const {
    data: documents,
    error,
    isLoading,
  } = useConferenceJson<DocumentsListView>(conf, "views/documentsList.json");

  if (isLoading) return <LoadingScreen />;
  if (error || !documents) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>readme.nfo | {conf.name}</title>
        <meta name="description" content={`Reference docs and updates for ${conf.name}.`} />
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <DocumentsList documents={documents} conference={conf} />
      </ConferenceLayout>
    </>
  );
}
