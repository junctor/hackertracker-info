import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import { Document, Documents as HTDocuments } from "@/types/info";
import Head from "next/head";
import { useRouter } from "next/router";
import DocumentDetails from "@/components/documents/DocumentDetails";

export default function DocumentsPage() {
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
  } = useSWR<HTDocuments>("/ht/dcsg2026/documents.json", fetcher);

  const selectedDocument = useMemo<Document | null>(() => {
    if (docId === null) return null;
    return documents
      ? (documents.find((doc) => doc.id === docId) ?? null)
      : null;
  }, [documents, docId]);

  if (!router.isReady) return <Loading />;
  if (isLoading) return <Loading />;
  if (error || !documents) return <Error />;
  if (!selectedDocument) {
    return <Error msg="Document not found." />;
  }

  return (
    <>
      <Head>
        <title>{selectedDocument.title_text} | DEF CON Singapore 2026</title>
        <meta
          name="description"
          content="A collection of information related to DEF CON Singapore 2026."
        />
      </Head>
      <main>
        <Heading />
        <DocumentDetails doc={selectedDocument} configSlug="dcsg2026" />
      </main>
    </>
  );
}
