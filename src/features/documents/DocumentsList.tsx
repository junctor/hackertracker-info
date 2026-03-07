import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { ConferenceManifest } from "@/lib/conferences";
import { DocumentsListView } from "@/lib/types/ht-types";

export default function DocumentsList({
  documents,
  conference,
}: {
  documents: DocumentsListView;
  conference: ConferenceManifest;
}) {
  return (
    <div className="ui-container ui-page-content">
      <header className="mb-6">
        <h1 className="ui-heading-1">readme.nfo</h1>
      </header>

      <ul className="space-y-4">
        {documents.map((doc) => (
          <li key={doc.id}>
            <Link
              href={`/${conference.slug}/document/?id=${doc.id}`}
              className="ui-focus-ring ui-card ui-card-interactive flex items-start justify-between gap-3 p-4 sm:items-center sm:p-5 focus-visible:outline-none"
            >
              <div className="min-w-0">
                <h2 className="text-lg leading-snug font-semibold text-slate-100 sm:text-xl">
                  {doc.titleText}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  <span className="font-medium text-slate-200">Updated:</span>{" "}
                  {new Date(doc.updatedAtMs).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <ChevronRightIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 sm:h-6 sm:w-6" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
