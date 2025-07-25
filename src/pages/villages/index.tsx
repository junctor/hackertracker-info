import React from "react";
import useSWR from "swr";
import Head from "next/head";
import { alphaSort, fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import { Organizations as OrgsType } from "@/types/info";
import Orgs from "@/components/organization/Organizations";

export default function VillagesPage() {
  const {
    data: organizations,
    error,
    isLoading,
  } = useSWR<OrgsType>("/ht/organizations.json", fetcher);

  if (isLoading) return <Loading />;
  if (error || !organizations) return <Error />;

  const villages = organizations
    .filter((org) => org.tag_ids.includes(47614))
    .sort((a, b) => {
      return alphaSort(a.name, b.name);
    });

  return (
    <>
      <Head>
        <title>Villages | DEF CON</title>
        <meta name="description" content="Explore all DEF CON Villages" />
      </Head>
      <main>
        <Heading />
        <Orgs orgs={villages} title="Villages" />
      </main>
    </>
  );
}
