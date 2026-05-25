import React, { useMemo } from "react";
import { useSearchParams } from "react-router";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import DocumentDetails from "@/features/documents/DocumentDetails";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { DocumentEntity, DocumentsStore } from "@/lib/types/ht-types/entities";
import { PageId } from "@/lib/types/page-meta";

type DocumentPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function DocumentPage({ conf, activePageId }: DocumentPageProps) {
  const [searchParams] = useSearchParams();
  const idParam = useMemo(() => {
    return searchParams.get("id");
  }, [searchParams]);
  const docId = useMemo(() => {
    if (!idParam) return null;
    const parsed = Number(idParam);
    return Number.isFinite(parsed) ? parsed : null;
  }, [idParam]);

  const {
    data: documents,
    error,
    isLoading,
  } = useConferenceJson<DocumentsStore>(conf, "entities/documents.json");

  const selectedDocument = useMemo<DocumentEntity | null>(() => {
    if (docId === null) return null;
    return documents ? (documents.byId[docId] ?? null) : null;
  }, [documents, docId]);

  if (isLoading) return <LoadingScreen />;
  if (error || !documents) {
    return <ErrorScreen msg="Unable to load documents." />;
  }
  if (idParam === null) {
    return <ErrorScreen msg="Missing document id." />;
  }
  if (docId === null) {
    return <ErrorScreen msg="Invalid document id." />;
  }
  if (!selectedDocument) {
    return <ErrorScreen msg="Document not found." />;
  }

  return (
    <>
      <Head>
        <title>
          {selectedDocument.titleText} | {conf.name}
        </title>
        <meta name="description" content={`Reference document for ${conf.name}.`} />
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <DocumentDetails document={selectedDocument} conference={conf} />
      </ConferenceLayout>
    </>
  );
}
