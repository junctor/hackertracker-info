import Head from "next/head";
import useSWR from "swr";
import { fetcher } from "../../lib/utils/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import React from "react";
import Documents from "@/components/documents/Documents";

export default function ExhibitorsPage() {
  const { data, isLoading, error } = useSWR<HTDocument[], Error>(
    "/ht/documents.json",
    fetcher
  );

  if (isLoading) {
    return <Loading />;
  }

  if (data === undefined || error !== undefined) {
    return <Error />;
  }

  return (
    <div>
      <Head>
        <title>DC32 Documents</title>
        <meta name="description" content="DEF CON 32 Documents" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Heading />
        <Documents docs={data} />
      </main>
    </div>
  );
}
