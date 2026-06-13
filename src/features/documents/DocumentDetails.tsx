import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import Markdown from "@/components/markdown/Markdown";
import PageHeader from "@/components/ui/PageHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { DocumentEntity } from "@/lib/types/ht-types";

type Props = {
  document: DocumentEntity;
  conference: ConferenceManifest;
};

export default function DocumentDetails({ document, conference }: Props) {
  const updatedAt = new Date(document.updatedAtMs);
  const updatedLabel = Number.isNaN(updatedAt.getTime())
    ? "Unknown"
    : updatedAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  return (
    <article className="ui-container ui-page-content ui-detail-page">
      <nav aria-label="Breadcrumb" className="ui-breadcrumb" role="navigation">
        <ol className="ui-breadcrumb-list">
          <li>
            <Link
              to={`/${conference.slug}/readme.nfo`}
              className="ui-link ui-focus-ring ui-breadcrumb-link"
            >
              readme.nfo
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRightIcon className="ui-icon-xs" />
          </li>
          <li aria-current="page" className="ui-breadcrumb-current ui-clip-text">
            {document.titleText}
          </li>
        </ol>
      </nav>

      <PageHeader title={document.titleText} resultLabel={`Last updated ${updatedLabel}`} />

      <section className="ui-document-body">
        <Markdown content={document.bodyText} />
      </section>
    </article>
  );
}
