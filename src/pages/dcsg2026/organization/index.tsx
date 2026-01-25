import React, { useMemo } from "react";
import useSWR from "swr";
import Head from "next/head";
import { useRouter } from "next/router";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import OrganizationDetails from "@/features/organizations/OrganizationDetails";
import { Organizations } from "@/lib/types/info";

export default function OrganizationPage() {
  const router = useRouter();
  const idParam = useMemo(() => {
    if (!router.isReady) return null;
    const value = router.query.id;
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  }, [router.isReady, router.query.id]);
  const orgId = idParam ? Number(idParam) : null;

  const {
    data: organizations,
    error,
    isLoading,
  } = useSWR<Organizations>("/ht/dcsg2026/organizations.json", fetcher);

  if (!router.isReady) return <LoadingScreen />;
  if (isLoading) return <LoadingScreen />;
  if (error || !organizations) return <ErrorScreen />;
  const org = organizations.find((o) => o.id === orgId) ?? null;
  if (!org) return <ErrorScreen msg="Organization not found" />;

  return (
    <>
      <Head>
        <title>{org.name} | DEF CON Singapore 2026</title>
        <meta name="description" content={org.description.slice(0, 150)} />
      </Head>

      <main>
        <SiteHeader />
        <OrganizationDetails org={org} />
      </main>
    </>
  );
}
