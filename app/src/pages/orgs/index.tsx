import Head from "next/head";
import useSWR from "swr";
import { fetcher } from "../../lib/utils/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Orgs from "@/components/organization/Organizations";
import Heading from "@/components/heading/Heading";
import { useSearchParams } from "next/navigation";
import { getOrg } from "@/lib/utils/orgs";
import React from "react";

export default function ExhibitorsPage() {
  const { data, isLoading, error } = useSWR<HTOrganization[], Error>(
    "/ht/organizations.json",
    fetcher
  );

  const searchParams = useSearchParams();
  const tagId = searchParams.get("id") ?? "0";
  const tagOrg = getOrg(tagId);

  if (isLoading) {
    return <Loading />;
  }

  if (data === undefined || error !== undefined || tagOrg.id === 0) {
    return <Error />;
  }

  const orgs = data
    .filter((t) => t.tag_ids.includes(tagOrg.id))
    .sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else {
        return -1;
      }
    });

  return (
    <div>
      <Head>
        <title>{`DEF CON 32 ${tagOrg.org}`}</title>
        <meta name="description" content="DEF CON 32 Categories" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mb-20">
        <Heading />
        <Orgs orgs={orgs} title={tagOrg.org} />
      </main>
    </div>
  );
}
