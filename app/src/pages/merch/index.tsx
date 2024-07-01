import Head from "next/head";
import { fetcher } from "../../lib/utils/misc";
import useSWR from "swr";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Merch from "@/components/merch/Merch";
import React from "react";
import Heading from "@/components/heading/Heading";

export default function MerchPage() {
  const { data, error, isLoading } = useSWR<FBProducts, Error>(
    "https://firestore.googleapis.com/v1/projects/hackertest-5a202/databases/(default)/documents/conferences/DEFCON31/products?pageSize=1000",
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
        <title>DC32 Merch</title>
        <meta name="description" content="DEF CON 32 Merch" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Heading />
        <Merch products={data} />
      </main>
    </div>
  );
}
