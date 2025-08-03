import Link from "next/link";
import React from "react";
import Markdown from "../markdown/Markdown";
import { Document } from "@/types/info";
import { ChevronRight } from "lucide-react";

export default function DocumentDetails({ doc }: { doc: Document }) {
  return (
    <article className="container mx-auto px-4 py-8 lg:py-12">
      {/* Breadcrumb with chevron separators and improved color contrast */}
      <nav aria-label="Breadcrumb" className="mb-6" role="navigation">
        <ol className="inline-flex items-center space-x-2 text-sm">
          <li>
            <Link
              href="/readme.nfo"
              className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            >
              readme.nfo
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          </li>
          <li aria-current="page" className="sr-only">
            {doc.title_text}
          </li>
        </ol>
      </nav>

      <header className="mb-6">
        <h1
          id="doc-title"
          className="text-4xl font-extrabold tracking-tight mb-2"
        >
          {doc.title_text}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated{" "}
          {new Date(doc.updated_at.seconds * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </header>

      <section className="prose max-w-prose dark:prose-invert">
        <Markdown content={doc.body_text} />
      </section>
    </article>
  );
}
