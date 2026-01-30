import React, { useMemo } from "react";
import useSWR from "swr";
import Head from "next/head";
import { useRouter } from "next/router";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import OrganizationDetails from "@/features/organizations/OrganizationDetails";
import { ConferenceManifest } from "@/lib/conferences";
import { OrganizationEntity, OrganizationsStore } from "@/lib/types/ht-types";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";

type OrganizationPageProps = {
  conf: ConferenceManifest;
};

export default function OrganizationPage({ conf }: OrganizationPageProps) {
  const router = useRouter();
  const idParam = useMemo(() => {
    if (!router.isReady) return null;
    const value = router.query.id;
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  }, [router.isReady, router.query.id]);
  const docId = useMemo(() => {
    if (!idParam) return null;
    const parsed = Number(idParam);
    return Number.isFinite(parsed) ? parsed : null;
  }, [idParam]);
  const hasInvalidId = router.isReady && idParam !== null && docId === null;

  const {
    data: organizations,
    error,
    isLoading,
  } = useSWR<OrganizationsStore>(
    `${conf.dataRoot}/entities/organizations.json`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const selectedOrganization = useMemo<OrganizationEntity | null>(() => {
    if (docId === null) return null;
    return organizations ? (organizations.byId[docId] ?? null) : null;
  }, [organizations, docId]);

  if (!router.isReady) return <LoadingScreen />;
  if (idParam === null) return <ErrorScreen msg="Missing organization id." />;
  if (hasInvalidId) return <ErrorScreen msg="Invalid organization id." />;
  if (isLoading) return <LoadingScreen />;
  if (error || !organizations) return <ErrorScreen />;

  if (!selectedOrganization)
    return <ErrorScreen msg="Organization not found" />;

  return (
    <>
      <Head>
        <title>
          {selectedOrganization.name} | {conf.name}
        </title>
        <meta
          name="description"
          content={selectedOrganization.description?.slice(0, 150) ?? ""}
        />
      </Head>

      <main>
        <SiteHeader conference={conf} />
        <OrganizationDetails org={selectedOrganization} />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<OrganizationPageProps> = async (
  ctx,
) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf } };
};
