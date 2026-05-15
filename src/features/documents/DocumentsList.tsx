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

      <ul className="ui-list-stack">
        {documents.map((doc) => (
          <li key={doc.id}>
            <Link
              to={`/${conference.slug}/document/?id=${doc.id}`}
              className="ui-focus-ring ui-card ui-card-interactive ui-document-list-link"
            >
              <div className="ui-item-main">
                <h2 className="ui-card-title ui-document-list-title">{doc.titleText}</h2>
                <p className="ui-card-meta ui-document-list-meta">
                  <span className="ui-muted-strong">Updated:</span>{" "}
                  {new Date(doc.updatedAtMs).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <ChevronRightIcon className="ui-icon-sm ui-document-list-icon" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
