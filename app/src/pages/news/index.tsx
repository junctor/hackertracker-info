import News from "../../components/news/News";
import { fetcher } from "@/lib/utils/misc";
import Head from "next/head";
import useSWR from "swr";
import Error from "@/components/misc/Error";
import Loading from "@/components/misc/Loading";
import React from "react";
import Heading from "@/components/heading/Heading";

export default function InfoPage() {
  const {
    data: newsData,
    isLoading: newsIsLoading,
    error: newsError,
  } = useSWR<HTNews[], Error>("/ht/news.json", fetcher);

  if (newsIsLoading) {
    return <Loading />;
  }

  if (newsData === undefined || newsError !== undefined) {
    return <Error />;
  }

  return (
    <div>
      <Head>
        <title>DC32 Info</title>
        <meta name="description" content="DEF CON 32 News" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mb-20 ">
        <Heading />
        <News news={newsData ?? []} />
      </main>
    </div>
  );
}
