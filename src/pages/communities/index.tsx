import React from "react";
import useSWR from "swr";
import Head from "next/head";
import { alphaSort, fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import { Organizations as OrgsType } from "@/types/info";
import Orgs from "@/components/organization/Organizations";

export default function CommunitiesPage() {
  const {
    data: organizations,
    error,
    isLoading,
  } = useSWR<OrgsType>("/ht/organizations.json", fetcher);

  if (isLoading) return <Loading />;
  if (error || !organizations) return <Error />;

  const communities = organizations
    .filter((org) => org.tag_ids.includes(47621))
    .sort((a, b) => {
      return alphaSort(a.name, b.name);
    });

  return (
    <>
      <Head>
        <title>Communities | DEF CON Singapore 2025</title>
        <meta
          name="description"
          content="Explore all DEF CON Singapore 2025 Communities"
        />
      </Head>
      <main>
        <Heading />
        <Orgs orgs={communities} title="Communities" />
      </main>
    </>
  );
}
