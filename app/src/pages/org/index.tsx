import Head from "next/head";
import useSWR from "swr";
import { fetcher } from "../../lib/utils/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import { useSearchParams } from "next/navigation";
import OrgDetails from "@/components/organization/OrganizationDetails";
import React from "react";

export default function OrgPage() {
  const { data, error, isLoading } = useSWR<HTOrganization[], Error>(
    "/ht/organizations.json",
    fetcher
  );

  const searchParams = useSearchParams();
  const tagId = searchParams.get("id");

  if (isLoading) {
    return <Loading />;
  }

  if (data === undefined || error !== undefined) {
    return <Error />;
  }

  const foundOrg = data.find((o) => String(o.id) === tagId);

  if (foundOrg === undefined) {
    return <Error msg="No Exhibitor found for ID" />;
  }

  return (
    <div>
      <Head>
        <title>{`DC32 ${foundOrg.name}`}</title>
        <meta name="description" content="DEF CON 32 Org" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <OrgDetails org={foundOrg} />
      </main>
    </div>
  );
}
