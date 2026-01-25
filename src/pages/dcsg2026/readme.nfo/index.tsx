import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import { Documents as HTDocuments } from "@/lib/types/info";
import Head from "next/head";
import DocumentsList from "@/features/documents/DocumentsList";

export default function DocumentsPage() {
  const {
    data: documents,
    error,
    isLoading,
  } = useSWR<HTDocuments>("/ht/dcsg2026/documents.json", fetcher);

  if (isLoading) return <LoadingScreen />;
  if (error || !documents) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>readme.nfo | DEF CON Singapore 2026</title>
        <meta
          name="description"
          content="A collection of information related to DEF CON Singapore 2026."
        />
      </Head>
      <main>
        <SiteHeader />
        <DocumentsList docs={documents} configSlug="dcsg2026" />
      </main>
    </>
  );
}
