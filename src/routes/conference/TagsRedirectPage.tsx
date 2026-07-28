import { Navigate, useLocation } from "react-router";

import { ConferenceManifest } from "@/lib/conferences";
import { PageId } from "@/lib/types/page-meta";

type TagsRedirectPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function TagsRedirectPage({ conf }: TagsRedirectPageProps) {
  const location = useLocation();

  return <Navigate to={`/${conf.slug}/filters/${location.search}${location.hash}`} replace />;
}
