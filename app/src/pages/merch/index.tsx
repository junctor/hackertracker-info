import Head from "next/head";
import { fetcher } from "../../lib/utils/misc";
import useSWR from "swr";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Merch from "@/components/merch/Merch";
import React from "react";
import { useTheme } from "next-themes";

export default function MerchPage() {
  const { setTheme } = useTheme();
  setTheme("dark");

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
        <title>DC32 Merch</title>
        <meta name="description" content="DEF CON 32 Merch" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Merch products={data} />
      </main>
    </div>
  );
}
