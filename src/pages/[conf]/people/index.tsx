import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import PeopleList from "@/features/people/PeopleList";
import { People } from "@/lib/types/info";
import Head from "next/head";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";
import { PageId } from "@/lib/types/page-meta";

type PeoplePageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function PeoplePage({ conf, activePageId }: PeoplePageProps) {
  const {
    data: people,
    error,
    isLoading,
  } = useSWR<People>("/ht/people.json", fetcher);

  if (isLoading) return <LoadingScreen />;
  if (error || !people) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>People | DEF CON Singapore 2026</title>
        <meta
          name="description"
          content="Browse bios and sessions for all DEF CON Singapore 2026 participants."
        />
      </Head>
      <main>
        <SiteHeader conference={conf} activePageId={activePageId} />
        <PeopleList people={people} />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<PeoplePageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "people" } };
};
