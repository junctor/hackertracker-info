import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import DocumentDetails from "@/features/documents/DocumentDetails";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { conferenceMenuPath } from "@/lib/routes";
import { DocumentDetailsById } from "@/lib/types/ht-types/views";
import { PageId } from "@/lib/types/page-meta";
import useNumericQueryParam from "@/lib/utils/useNumericQueryParam";

type DocumentPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function DocumentPage({ conf, activePageId }: DocumentPageProps) {
  const { value: docId, isReady, isMissing, isInvalid } = useNumericQueryParam("id");
  const documentsHref = `/${conf.slug}/readme.nfo`;
  const conferenceHomeHref = conferenceMenuPath(conf);

  const {
    data: documentsById,
    error,
    isLoading,
  } = useConferenceJson<DocumentDetailsById>(
    conf,
    isReady && !isMissing && !isInvalid && docId !== null ? "details/documents.json" : null,
  );

  const selectedDocument = docId !== null ? documentsById?.[String(docId)] : undefined;

  if (!isReady) return <LoadingScreen />;
  if (isLoading) return <LoadingScreen />;
  if (isMissing) {
    return (
      <ErrorScreen
        title="Document ID required"
        copy="This page needs a document ID."
        primaryActionHref={documentsHref}
        primaryActionLabel="Browse Documents"
        secondaryActionHref={conferenceHomeHref}
        secondaryActionLabel="Conference Home"
      />
    );
  }
  if (isInvalid || docId === null) {
    return (
      <ErrorScreen
        title="Document not found"
        copy="Use a numeric document ID, or browse conference documents."
        kicker="Not found"
        primaryActionHref={documentsHref}
        primaryActionLabel="Browse Documents"
        secondaryActionHref={conferenceHomeHref}
        secondaryActionLabel="Conference Home"
      />
    );
  }
  if (error) {
    return (
      <ErrorScreen
        title="Couldn't load document"
        copy="The document could not be loaded. Try the document list instead."
        primaryActionHref={documentsHref}
        primaryActionLabel="Browse Documents"
        secondaryActionHref={conferenceHomeHref}
        secondaryActionLabel="Conference Home"
      />
    );
  }
  if (!selectedDocument) {
    return (
      <ErrorScreen
        title="Document not found"
        copy={`No document exists for ID ${docId}.`}
        kicker="Not found"
        primaryActionHref={documentsHref}
        primaryActionLabel="Browse Documents"
        secondaryActionHref={conferenceHomeHref}
        secondaryActionLabel="Conference Home"
      />
    );
  }

  return (
    <>
      <Head>
        <title>
          {selectedDocument.titleText} | {conf.name}
        </title>
        <meta name="description" content={`Reference document for ${conf.name}.`} />
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <DocumentDetails key={selectedDocument.id} document={selectedDocument} conference={conf} />
      </ConferenceLayout>
    </>
  );
}
