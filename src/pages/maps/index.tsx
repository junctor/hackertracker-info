import React from "react";
import Heading from "@/components/heading/Heading";
import Head from "next/head";
import Maps from "@/components/maps/Maps";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import { Conference } from "@/types/info";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";

export default function MapsPage() {
  const {
    data: conference,
    error,
    isLoading,
  } = useSWR<Conference>("/ht/conference.json", fetcher);

  if (isLoading) return <Loading />;
  if (error || !conference) return <Error />;

  const mapLinks =
    conference.maps?.sort((a, b) => a.sort_order - b.sort_order) ?? [];

  return (
    <>
      <Head>
        <title>Maps | DEF CON</title>
        <meta name="description" content="DEF CON 33 Maps" />
      </Head>
      <main>
        <Heading />
        <Maps maps={mapLinks} />
      </main>
    </>
  );
}
