import Head from "next/head";
import Speakers from "../../components/speakers/Speakers";
import { fetcher } from "../../lib/utils/misc";
import useSWR from "swr";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import React from "react";
import Heading from "@/components/heading/Heading";

export default function SpeakersPage() {
  const {
    data: speakers,
    error: speakersError,
    isLoading: speakersIsLoading,
  } = useSWR<HTSpeaker[], Error>("/ht/speakers.json", fetcher);

  if (speakersIsLoading) {
    return <Loading />;
  }

  if (speakersError !== undefined || speakers === undefined) {
    return <Error />;
  }

  return (
    <div>
      <Head>
        <title>DC32 Speakers</title>
        <meta name="description" content="DEF CON 32 Speakers" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Heading />
        <Speakers speakers={speakers} />
      </main>
    </div>
  );
}
