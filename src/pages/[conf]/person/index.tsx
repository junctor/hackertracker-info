import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import PersonDetails from "@/features/people/PersonDetails";
import { useRouter } from "next/router";
import { People, Person } from "@/lib/types/info";
import Head from "next/head";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";
import { PageId } from "@/lib/types/page-meta";

type PersonPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function PersonPage({ conf, activePageId }: PersonPageProps) {
  const router = useRouter();
  const idParam = useMemo(() => {
    if (!router.isReady) return null;
    const value = router.query.id;
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  }, [router.isReady, router.query.id]);
  const personId = useMemo(() => (idParam ? Number(idParam) : null), [idParam]);

  const {
    data: people,
    error,
    isLoading,
  } = useSWR<People>("/ht/people.json", fetcher);

  const person: Person | null = useMemo(() => {
    if (!people || personId === null) return null;
    return people.find((p) => p.id === personId) ?? null;
  }, [people, personId]);

  if (!router.isReady) return <LoadingScreen />;
  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  if (personId === null || !person)
    return <ErrorScreen msg="Person not found" />;

  return (
    <>
      <Head>
        <title>{person.name} | Speaker at DEF CON Singapore 2026</title>
        <meta
          name="description"
          content={`Learn more about ${person.name}, a speaker at DEF CON Singapore 2026. See their bio, sessions, and contributions.`}
        />
      </Head>
      <main>
        <SiteHeader conference={conf} activePageId={activePageId} />
        <PersonDetails person={person} />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<PersonPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "person" } };
};
