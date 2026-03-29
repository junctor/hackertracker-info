import type { GetStaticProps } from "next";

import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import DocumentDetails from "@/features/documents/DocumentDetails";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { buildConferenceStaticPaths, getConferenceFromParams } from "@/lib/next-static";
import { DocumentEntity, DocumentsStore } from "@/lib/types/ht-types/entities";
import { PageId } from "@/lib/types/page-meta";

type DocumentsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function DocumentsPage({ conf, activePageId }: DocumentsPageProps) {
  const router = useRouter();
  const idParam = useMemo(() => {
    if (!router.isReady) return null;
    const value = router.query.id;
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  }, [router.isReady, router.query.id]);
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

  if (!router.isReady || isLoading) return <LoadingScreen />;
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
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          <DocumentDetails document={selectedDocument} conference={conf} />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<DocumentsPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "document" } };
};
