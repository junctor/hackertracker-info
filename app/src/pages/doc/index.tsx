import Head from "next/head";
import useSWR from "swr";
import { fetcher } from "../../lib/utils/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import { useSearchParams } from "next/navigation";
import React from "react";
import DocumentDetails from "@/components/documents/DocumentDetails";

export default function DocPage() {
  const { data, error, isLoading } = useSWR<HTDocument[], Error>(
    "/ht/documents.json",
    fetcher
  );

  const searchParams = useSearchParams();
  const docId = searchParams.get("id");

  if (isLoading) {
    return <Loading />;
  }

  if (data === undefined || error !== undefined) {
    return <Error />;
  }

  const foundDoc = data.find((d) => String(d.id) === docId);

  if (foundDoc === undefined) {
    return <Error msg="No Document found for ID" />;
  }

  return (
    <div>
      <Head>
        <title>{`DC32 ${foundDoc.title_text}`}</title>
        <meta
          name="description"
          content={`DEF CON 32 ${foundDoc.title_text}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <DocumentDetails doc={foundDoc} />
      </main>
    </div>
  );
}
