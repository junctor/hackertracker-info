import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import { Document, Documents as HTDocuments } from "@/types/info";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import DocumentDetails from "@/components/documents/DocumentDetails";

export default function DocumentsPage() {
  const params = useSearchParams();
  const idParam = params.get("id");
  const docId = useMemo(() => (idParam ? Number(idParam) : null), [idParam]);

  const {
    data: documents,
    error,
    isLoading,
  } = useSWR<HTDocuments>("/ht/documents.json", fetcher);

  const selectedDocument = useMemo<Document | null>(() => {
    if (docId === null) return null;
    return documents
      ? (documents.find((doc) => doc.id === docId) ?? null)
      : null;
  }, [documents, docId]);

  if (isLoading) return <Loading />;
  if (error || !documents) return <Error />;
  if (!selectedDocument) {
    return <Error msg="Document not found." />;
  }

  return (
    <>
      <Head>
        <title>{selectedDocument.title_text} | DEF CON</title>
        <meta
          name="description"
          content="A collection of information related to DEF CON."
        />
      </Head>
      <main>
        <Heading />
        <DocumentDetails doc={selectedDocument} />
      </main>
    </>
  );
}
