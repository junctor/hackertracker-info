import type { GetStaticProps } from "next";

import Head from "next/head";
import React from "react";

import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import DocumentsList from "@/features/documents/DocumentsList";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { buildConferenceStaticPaths, getConferenceFromParams } from "@/lib/next-static";
import { DocumentsListView } from "@/lib/types/ht-types";
import { PageId } from "@/lib/types/page-meta";

type DocumentsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function DocumentsPage({ conf, activePageId }: DocumentsPageProps) {
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
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          <DocumentsList documents={documents} conference={conf} />
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
  return { props: { conf: result.conf, activePageId: "readme" } };
};
