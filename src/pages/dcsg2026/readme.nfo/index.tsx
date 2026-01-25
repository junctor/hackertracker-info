import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import Head from "next/head";
import DocumentsList from "@/features/documents/DocumentsList";
import { getConference } from "@/lib/conferences";
import { DocumentsStore } from "@/lib/types/ht-types";

const conference = getConference("dcsg2026");

export default function DocumentsPage() {
  const {
    data: documents,
    error,
    isLoading,
  } = useSWR<DocumentsStore>(
    `${conference.dataRoot}/entities/documents.json`,
    fetcher,
  );

  if (isLoading) return <LoadingScreen />;
  if (error || !documents) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>readme.nfo | {conference.name}</title>
        <meta
          name="description"
          content={`A collection of information related to ${conference.name}.`}
        />
      </Head>
      <main>
        <SiteHeader conference={conference} />
        <DocumentsList documents={documents} conference={conference} />
      </main>
    </>
  );
}
