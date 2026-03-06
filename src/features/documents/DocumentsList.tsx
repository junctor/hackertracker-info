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
    <div className="mx-5 my-6">
      <header className="mb-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-100">readme.nfo</h1>
      </header>

      <ul className="space-y-4">
        {documents.map((doc) => (
          <li key={doc.id}>
            <Link
              href={`/${conference.slug}/document/?id=${doc.id}`}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/70 p-5 transition-colors hover:border-indigo-500 hover:bg-slate-800/90 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none"
            >
              <div>
                <h2 className="text-xl leading-snug font-semibold text-slate-100">
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
              <ChevronRightIcon className="h-6 w-6 text-slate-500" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
