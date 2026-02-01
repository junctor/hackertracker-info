import type { ConferenceManifest } from "@/lib/conferences";
import type { PageId } from "@/lib/types/page-meta";

export type OrganizationDirectoryPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};
