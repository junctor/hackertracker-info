import React, { useEffect, useMemo } from "react";
import useSWR from "swr";
import Head from "next/head";
import { useRouter } from "next/router";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import { OrganizationDirectoryPageProps } from "@/features/organizations/types";
import {
  getOrganizationDirectoryConfig,
  OrganizationDirectoryConfig,
} from "@/lib/menu";
import {
  DerivedTagIdsByLabel,
  OrganizationsCardsView,
} from "@/lib/types/ht-types";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";
import useNumericQueryParam from "@/lib/utils/useNumericQueryParam";

export default function OrganizationPage({
  conf,
  activePageId,
}: OrganizationDirectoryPageProps) {
  const router = useRouter();
  const {
    value: docId,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
  } = useNumericQueryParam("id");

  const {
    data: organizations,
    error: organizationsError,
    isLoading: organizationsIsLoading,
  } = useSWR<OrganizationsCardsView>(
    docId !== null ? `${conf.dataRoot}/views/organizationsCards.json` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const {
    data: derivedTagIdsByLabel,
    error: tagError,
    isLoading: tagIsLoading,
  } = useSWR<DerivedTagIdsByLabel>(
    docId !== null ? `${conf.dataRoot}/derived/TagIdsByLabel.json` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const redirectTarget = useMemo(() => {
    if (!docId || !organizations || !derivedTagIdsByLabel) return null;

    const configs = [
      getOrganizationDirectoryConfig("communities"),
      getOrganizationDirectoryConfig("departments"),
      getOrganizationDirectoryConfig("villages"),
      getOrganizationDirectoryConfig("contests"),
      getOrganizationDirectoryConfig("contents"),
      getOrganizationDirectoryConfig("exhibitors"),
      getOrganizationDirectoryConfig("vendors"),
    ].filter((config): config is OrganizationDirectoryConfig => Boolean(config));

    for (const config of configs) {
      const tagId = derivedTagIdsByLabel.byLabel[config.tagLabel];
      const cards = tagId ? organizations[tagId] : null;
      if (cards?.some((org) => org.id === docId)) {
        return `/${conf.slug}/${config.slug}/?id=${docId}`;
      }
    }

    return null;
  }, [conf.slug, derivedTagIdsByLabel, docId, organizations]);

  useEffect(() => {
    if (redirectTarget) {
      void router.replace(redirectTarget);
    }
  }, [redirectTarget, router]);

  if (!router.isReady) return <LoadingScreen />;
  if (isIdMissing)
    return (
      <ErrorScreen msg="Missing organization id. Use the category URL instead." />
    );
  if (isIdInvalid) return <ErrorScreen msg="Invalid organization id." />;

  if (organizationsIsLoading || tagIsLoading) return <LoadingScreen />;
  if (organizationsError || tagError || !organizations || !derivedTagIdsByLabel)
    return <ErrorScreen />;

  if (redirectTarget) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>Organization | {conf.name}</title>
        <meta
          name="description"
          content="Organization pages now live under their category routes."
        />
      </Head>
      <main>
        <SiteHeader conference={conf} activePageId={activePageId} />
        <ErrorScreen msg="Organization pages now live under their category URLs (for example, /[conf]/communities/?id=####)." />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<OrganizationDirectoryPageProps> = async (
  ctx,
) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "organization" } };
};
