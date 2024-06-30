import Head from "next/head";
import Locations from "../../components/locations/Locations";
import useSWR from "swr";
import { fetcher } from "../../lib/utils/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import React from "react";
import Heading from "@/components/heading/Heading";
export default function LocationsPage() {
  const { data, error, isLoading } = useSWR<HTLocation[], Error>(
    "/ht/locations.json",
    fetcher
  );

  if (isLoading) {
    return <Loading />;
  }

  if (data === undefined || error !== undefined) {
    return <Error />;
  }

  return (
    <div>
      <Head>
        <title>DC32 Locations</title>
        <meta name="description" content="DEF CON 32 Locations" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Heading />
        <Locations locations={data} />
      </main>
    </div>
  );
}
