import Head from "next/head";
import Speaker from "../../components/speakers/Speaker";
import { fetcher } from "../../lib/utils/misc";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import React from "react";
import Heading from "@/components/heading/Heading";

export default function SpeakerPage() {
  const {
    data: speakersData,
    error: speakersError,
    isLoading: speakersIsLoading,
  } = useSWR<HTSpeaker[], Error>("/ht/speakers.json", fetcher);

  const searchParams = useSearchParams();
  const speakerId = searchParams.get("id");

  if (speakersIsLoading) {
    return <Loading />;
  }

  if (speakerId == null || speakerId === "") {
    return <Error msg="No speaker id provided" />;
  }

  const speaker = speakersData?.find((s) => s.id.toString() === speakerId);

  if (speaker === undefined) {
    return <Error msg={`No speaker found for id ${speakerId}`} />;
  }

  if (speakersError !== undefined) {
    return <Error />;
  }
  return (
    <div>
      <Head>
        <title>{`DC32 ${speaker.name}`}</title>
        <meta name="description" content="DEF CON 32 Speaker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Heading />
        <Speaker speaker={speaker} />
      </main>
    </div>
  );
}
