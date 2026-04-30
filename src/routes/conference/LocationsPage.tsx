import React from "react";

import Head from "@/components/Head";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import LocationsList from "@/features/locations/LocationsList";
import { ConferenceManifest } from "@/lib/conferences";
import { useConferenceJson } from "@/lib/hooks/useConferenceJson";
import { LocationsStore } from "@/lib/types/ht-types";
import { PageId } from "@/lib/types/page-meta";

type LocationsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function LocationsPage({ conf, activePageId }: LocationsPageProps) {
  const {
    data: locations,
    error,
    isLoading,
  } = useConferenceJson<LocationsStore>(conf, "entities/locations.json");

  if (isLoading) return <LoadingScreen />;
  if (error || !locations) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Locations | {conf.name}</title>
        <meta name="description" content={`Rooms and venue locations for ${conf.name}.`} />
      </Head>
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          <LocationsList locations={locations} />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
