import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import Markdown from "@/components/markdown/Markdown";
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
    <article className="container mx-auto px-4 py-8 lg:py-12">
      {/* Breadcrumb with chevron separators and improved color contrast */}
      <nav aria-label="Breadcrumb" className="mb-6" role="navigation">
        <ol className="inline-flex items-center space-x-2 text-sm">
          <li>
            <Link
              href={`/${conference.slug}/readme.nfo`}
              className="ui-link ui-focus-ring flex items-center rounded focus-visible:outline-none"
            >
              readme.nfo
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRightIcon className="h-4 w-4 text-slate-400 dark:text-slate-600" />
          </li>
          <li aria-current="page" className="text-slate-300">
            {document.titleText}
          </li>
        </ol>
      </nav>

      <header className="mb-6">
        <h1 id="doc-title" className="mb-2 text-4xl font-extrabold tracking-tight text-slate-100">
          {document.titleText}
        </h1>
        <p className="text-sm text-slate-400">Last updated {updatedLabel}</p>
      </header>

      <section className="max-w-prose">
        <Markdown content={document.bodyText} />
      </section>
    </article>
  );
}
