import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import Head from "next/head";
import DocumentsList from "@/features/documents/DocumentsList";
import { ConferenceManifest } from "@/lib/conferences";
import { DocumentsListView } from "@/lib/types/ht-types";
import { PageId } from "@/lib/types/page-meta";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";

type DocumentsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function DocumentsPage({
  conf,
  activePageId,
}: DocumentsPageProps) {
  const {
    data: documents,
    error,
    isLoading,
  } = useSWR<DocumentsListView>(
    `${conf.dataRoot}/views/documentsList.json`,
    fetcher,
  );

  if (isLoading) return <LoadingScreen />;
  if (error || !documents) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>readme.nfo | {conf.name}</title>
        <meta
          name="description"
          content={`A collection of information related to ${conf.name}.`}
        />
      </Head>
      <main>
        <SiteHeader conference={conf} activePageId={activePageId} />
        <DocumentsList documents={documents} conference={conf} />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<DocumentsPageProps> = async (
  ctx,
) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "readme" } };
};
