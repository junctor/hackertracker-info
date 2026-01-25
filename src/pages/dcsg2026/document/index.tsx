import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import Head from "next/head";
import { useRouter } from "next/router";
import DocumentDetails from "@/features/documents/DocumentDetails";
import { DocumentEntity, DocumentsStore } from "@/lib/types/ht-types/entities";
import { getConference } from "@/lib/conferences";

export default function DocumentsPage() {
  const conference = getConference("dcsg2026");

  const router = useRouter();
  const idParam = useMemo(() => {
    if (!router.isReady) return null;
    const value = router.query.id;
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  }, [router.isReady, router.query.id]);
  const docId = useMemo(() => (idParam ? Number(idParam) : null), [idParam]);

  const {
    data: documents,
    error,
    isLoading,
  } = useSWR<DocumentsStore>(
    `${conference.dataRoot}/entities/documents.json`,
    fetcher,
  );

  const selectedDocument = useMemo<DocumentEntity | null>(() => {
    if (docId === null) return null;
    return documents ? (documents.byId[docId] ?? null) : null;
  }, [documents, docId]);

  if (!router.isReady) return <LoadingScreen />;
  if (isLoading) return <LoadingScreen />;
  if (error || !documents) return <ErrorScreen />;
  if (!selectedDocument) {
    return <ErrorScreen msg="Document not found." />;
  }

  return (
    <>
      <Head>
        <title>
          {selectedDocument.title_text} | {conference.name}
        </title>
        <meta
          name="description"
          content={`A collection of information related to ${conference.name}.`}
        />
      </Head>
      <main>
        <SiteHeader conference={conference} />
        <DocumentDetails document={selectedDocument} conference={conference} />
      </main>
    </>
  );
}
