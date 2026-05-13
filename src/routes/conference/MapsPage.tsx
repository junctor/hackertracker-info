import { type ConferenceManifest } from "@/lib/conferences";
import { type PageId } from "@/lib/types/page-meta";
import LocationsPage from "@/routes/conference/LocationsPage";

type MapsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function MapsPage({ conf, activePageId }: MapsPageProps) {
  return (
    <LocationsPage
      conf={conf}
      activePageId={activePageId}
      title="Map"
      description={`Venue map and location references for ${conf.name}.`}
    />
  );
}
