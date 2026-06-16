import React, { useMemo } from "react";
import { useSearchParams } from "react-router";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import DocumentDetails from "@/features/documents/DocumentDetails";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { DocumentDetailView } from "@/lib/types/ht-types/views";
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
    data: selectedDocument,
    error,
    isLoading,
  } = useConferenceJson<DocumentDetailView>(
    conf,
    docId !== null ? `details/documents/${docId}.json` : null,
  );

  if (isLoading) return <LoadingScreen />;
  if (idParam === null) {
    return <ErrorScreen msg="Missing document id." />;
  }
  if (docId === null) {
    return <ErrorScreen msg="Invalid document id." />;
  }
  if (error) {
    return <ErrorScreen msg="Unable to load document." />;
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
        <DocumentDetails key={selectedDocument.id} document={selectedDocument} conference={conf} />
      </ConferenceLayout>
    </>
  );
}
