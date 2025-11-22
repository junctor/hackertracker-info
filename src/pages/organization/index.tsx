import React from "react";
import useSWR from "swr";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import OrgDetails from "@/components/organization/OrganizationDetails";
import { Organizations } from "@/types/info";

export default function OrganizationPage() {
  const {
    data: organizations,
    error,
    isLoading,
  } = useSWR<Organizations>("/ht/organizations.json", fetcher);
  const params = useSearchParams();
  const idParam = params.get("id");
  const orgId = idParam ? Number(idParam) : null;

  if (isLoading) return <Loading />;
  if (error || !organizations) return <Error />;
  const org = organizations.find((o) => o.id === orgId) ?? null;
  if (!org) return <Error msg="Organization not found" />;

  return (
    <>
      <Head>
        <title>{org.name} | DEF CON Singapore 2025</title>
        <meta name="description" content={org.description.slice(0, 150)} />
      </Head>

      <main>
        <Heading />
        <OrgDetails org={org} />
      </main>
    </>
  );
}
