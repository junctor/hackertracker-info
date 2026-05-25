import type { ReactNode } from "react";

import type { ConferenceManifest } from "@/lib/conferences";
import type { PageId } from "@/lib/types/page-meta";

import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type Props = {
  conference: ConferenceManifest;
  activePageId: PageId;
  children: ReactNode;
  className?: string;
};

export default function ConferenceLayout({ conference, activePageId, children, className }: Props) {
  return (
    <div
      className={["ui-page-shell", className].filter(Boolean).join(" ")}
      data-conference={conference.slug}
    >
      <SiteHeader conference={conference} activePageId={activePageId} />
      <main id="main-content" className="ui-page-main">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
