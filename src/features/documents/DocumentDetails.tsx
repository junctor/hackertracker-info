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
    <article className="ui-container ui-page-content">
      <nav aria-label="Breadcrumb" className="mb-6" role="navigation">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <li>
            <Link
              to={`/${conference.slug}/readme.nfo`}
              className="ui-link ui-focus-ring flex items-center rounded focus-visible:outline-none"
            >
              readme.nfo
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRightIcon className="h-4 w-4 text-(--text-subtle)" />
          </li>
          <li aria-current="page" className="max-w-full min-w-0 truncate text-(--text-muted)">
            {document.titleText}
          </li>
        </ol>
      </nav>

      <PageHeader title={document.titleText} resultLabel={`Last updated ${updatedLabel}`} />

      <section className="max-w-prose">
        <Markdown content={document.bodyText} />
      </section>
    </article>
  );
}
