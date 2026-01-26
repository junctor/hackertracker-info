import React, { useMemo } from "react";
import useSWR from "swr";
import Head from "next/head";
import { useRouter } from "next/router";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import OrganizationDetails from "@/features/organizations/OrganizationDetails";
import { getConference } from "@/lib/conferences";
import { OrganizationEntity, OrganizationsStore } from "@/lib/types/ht-types";

export default function OrganizationPage() {
  const conference = getConference("dcsg2026");

  const router = useRouter();
  const idParam = useMemo(() => {
    if (!router.isReady) return null;
    const value = router.query.id;
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  }, [router.isReady, router.query.id]);
  const docId = useMemo(() => (idParam ? Number(idParam) : null), [idParam]);

  const {
    data: organizations,
    error,
    isLoading,
  } = useSWR<OrganizationsStore>(
    `${conference.dataRoot}/entities/organizations.json`,
    fetcher,
  );

  const selectedOrganization = useMemo<OrganizationEntity | null>(() => {
    if (docId === null) return null;
    return organizations ? (organizations.byId[docId] ?? null) : null;
  }, [organizations, docId]);

  if (!router.isReady) return <LoadingScreen />;
  if (isLoading) return <LoadingScreen />;
  if (error || !organizations) return <ErrorScreen />;

  if (!selectedOrganization)
    return <ErrorScreen msg="Organization not found" />;

  return (
    <>
      <Head>
        <title>
          {selectedOrganization.name} | {conference.name}
        </title>
        <meta
          name="description"
          content={selectedOrganization.description?.slice(0, 150) ?? ""}
        />
      </Head>

      <main>
        <SiteHeader conference={conference} />
        <OrganizationDetails org={selectedOrganization} />
      </main>
    </>
  );
}
