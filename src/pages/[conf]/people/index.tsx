import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import PeopleList from "@/features/people/PeopleList";
import Head from "next/head";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";
import { PageId } from "@/lib/types/page-meta";
import { PeopleCardsView } from "@/lib/types/ht-types/views";

type PeoplePageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function PeoplePage({ conf, activePageId }: PeoplePageProps) {
  const {
    data: people,
    error,
    isLoading,
  } = useSWR<PeopleCardsView>(
    `${conf.dataRoot}/views/peopleCards.json`,
    fetcher,
  );

  if (isLoading) return <LoadingScreen />;
  if (error || !people) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>People | {conf.name}</title>
        <meta
          name="description"
          content={`Browse bios and sessions for all ${conf.name} participants.`}
        />
      </Head>
      <main>
        <SiteHeader conference={conf} activePageId={activePageId} />
        <PeopleList people={people} conference={conf} />
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
