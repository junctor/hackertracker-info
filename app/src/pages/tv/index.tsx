import Head from "next/head";
import TV from "../../components/tv/TV";
import useSWR from "swr";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import React from "react";
import { fetcher, toEventsData } from "@/lib/utils/misc";

export default function TVPage() {
  const { data, error, isLoading } = useSWR<HTEvent[], Error>(
    "/ht/events.json",
    fetcher
  );

  const { data: tags, isLoading: tagsIsLoading } = useSWR<HTTag[], Error>(
    "/ht/tags.json",
    fetcher
  );

  if (isLoading || tagsIsLoading) {
    return <Loading />;
  }

  if (data === undefined || error !== undefined) {
    return <Error />;
  }

  const events = toEventsData(data, tags ?? []);

  return (
    <div>
      <Head>
        <title>Info Booth</title>
        <meta name="description" content="Info Booth" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mb-20">
        <TV events={events} />
      </main>
    </div>
  );
}
