import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import PageHeader from "@/components/ui/PageHeader";
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
      <PageHeader title="readme.nfo" description="Conference reference files and updates." />

      <ul className="space-y-4">
        {documents.map((doc) => (
          <li key={doc.id}>
            <Link
              to={`/${conference.slug}/document/?id=${doc.id}`}
              className="ui-focus-ring ui-card ui-card-interactive flex items-start justify-between gap-3 p-4 focus-visible:outline-none sm:items-center sm:p-5"
            >
              <div className="min-w-0">
                <h2 className="ui-card-title text-lg sm:text-xl">{doc.titleText}</h2>
                <p className="ui-card-meta mt-1">
                  <span className="font-medium text-(--text-primary)">Updated:</span>{" "}
                  {new Date(doc.updatedAtMs).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <ChevronRightIcon
                className="mt-0.5 h-5 w-5 shrink-0 text-(--text-muted) sm:h-6 sm:w-6"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
