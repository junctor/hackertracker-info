import Link from "next/link";
import React from "react";
import Markdown from "@/components/markdown/Markdown";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { DocumentEntity } from "@/lib/types/ht-types";
import { ConferenceManifest } from "@/lib/conferences";

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
              className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            >
              readme.nfo
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          </li>
          <li aria-current="page" className="text-gray-300">
            {document.titleText}
          </li>
        </ol>
      </nav>

      <header className="mb-6">
        <h1
          id="doc-title"
          className="text-4xl font-extrabold tracking-tight mb-2"
        >
          {document.titleText}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated {updatedLabel}
        </p>
      </header>

      <section className="prose max-w-prose dark:prose-invert">
        <Markdown content={document.bodyText} />
      </section>
    </article>
  );
}
