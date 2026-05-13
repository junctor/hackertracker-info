import React from "react";

import Head from "@/components/Head";
import ConferenceLayout from "@/features/app-shell/ConferenceLayout";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
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
      <ConferenceLayout conference={conf} activePageId={activePageId}>
        <LocationsList locations={locations} />
      </ConferenceLayout>
    </>
  );
}
