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
  } = useSWR<OrgsType>("/ht/dcsg2026/organizations.json", fetcher);

  if (isLoading) return <Loading />;
  if (error || !organizations) return <Error />;

  const communities = organizations
    .filter((org) => org.tag_ids.includes(48953))
    .sort((a, b) => {
      return alphaSort(a.name, b.name);
    });

  return (
    <>
      <Head>
        <title>Communities | DEF CON Singapore 2026</title>
        <meta
          name="description"
          content="Explore all DEF CON Singapore 2026 Communities"
        />
      </Head>
      <main>
        <Heading />
        <Orgs orgs={communities} title="Communities" confSlug="dcsg2026" />
      </main>
    </>
  );
}
