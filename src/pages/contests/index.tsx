import React from "react";
import useSWR from "swr";
import Head from "next/head";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import { Organizations as OrgsType } from "@/types/info";
import Orgs from "@/components/organization/Organizations";

export default function ContestsPage() {
  const {
    data: organizations,
    error,
    isLoading,
  } = useSWR<OrgsType>("/ht/organizations.json", fetcher);

  if (isLoading) return <Loading />;
  if (error || !organizations) return <Error />;

  const contests = organizations.filter((org) => org.tag_ids.includes(47622));

  return (
    <>
      <Head>
        <title>Contests | DEF CON</title>
        <meta name="description" content="Explore all DEF CON Contests" />
      </Head>
      <main>
        <Heading />
        <Orgs orgs={contests} title="Contests" />
      </main>
    </>
  );
}
