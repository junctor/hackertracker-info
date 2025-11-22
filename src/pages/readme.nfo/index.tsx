import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import { Documents as HTDocuments } from "@/types/info";
import Head from "next/head";
import Documents from "@/components/documents/Documents";

export default function DocumentsPage() {
  const {
    data: documents,
    error,
    isLoading,
  } = useSWR<HTDocuments>("/ht/documents.json", fetcher);

  if (isLoading) return <Loading />;
  if (error || !documents) return <Error />;

  return (
    <>
      <Head>
        <title>readme.nfo | DEF CON Singapore 2025</title>
        <meta
          name="description"
          content="A collection of information related to DEF CON Singapore 2025."
        />
      </Head>
      <main>
        <Heading />
        <Documents docs={documents} />
      </main>
    </>
  );
}
