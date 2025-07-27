import Head from "next/head";
import useSWR from "swr";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Merch from "@/components/merch/Merch";
import React from "react";
import { fetcher } from "@/lib/misc";

export default function MerchPage() {
  const { data, error, isLoading } = useSWR<FBProducts, Error>(
    "https://firestore.googleapis.com/v1/projects/junctor-hackertracker/databases/(default)/documents/conferences/DEFCON32/products?pageSize=1000",
    fetcher
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error !== undefined || data === undefined) {
    return <Error />;
  }

  return (
    <div>
      <Head>
        <title>DC33 Merch</title>
        <meta name="description" content="DEF CON 33 Merch" />
      </Head>

      <main>
        <Merch products={data} />
      </main>
    </div>
  );
}
