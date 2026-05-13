import Head from "@/components/Head";
import PageHeader from "@/components/ui/PageHeader";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import { type ConferenceManifest } from "@/lib/conferences";
import { type PageId } from "@/lib/types/page-meta";

type MerchPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function MerchPage({ conf, activePageId }: MerchPageProps) {
  return (
    <>
      <Head>
        <title>Merch | {conf.name}</title>
        <meta name="description" content={`Official merch information for ${conf.name}.`} />
      </Head>
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <section className="ui-container ui-section">
          <PageHeader title="Merch" description={`Official merch information for ${conf.name}.`} />
          <div className="ui-empty-state mt-10" role="status">
            <p>Merch information is not available yet.</p>
          </div>
        </section>
      </ConferenceLayout>
    </>
  );
}
