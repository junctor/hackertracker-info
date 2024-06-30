import Information from "../../components/info/Information";
import { fetcher } from "@/lib/utils/misc";
import Head from "next/head";
import useSWR from "swr";
import Error from "@/components/misc/Error";
import Loading from "@/components/misc/Loading";
import React from "react";
import Heading from "@/components/heading/Heading";

export default function InfoPage() {
  const {
    data: conferenceData,
    error: conferenceError,
    isLoading: conferenceIsLoading,
  } = useSWR<HTConference, Error>("/ht/conference.json", fetcher);

  const { data: faqData, isLoading: faqIsLoading } = useSWR<HTFAQ[], Error>(
    "/ht/faq.json",
    fetcher
  );

  const { data: newsData, isLoading: newsIsLoading } = useSWR<HTNews[], Error>(
    "/ht/news.json",
    fetcher
  );

  if (conferenceIsLoading || faqIsLoading || newsIsLoading) {
    return <Loading />;
  }

  if (conferenceData === undefined || conferenceError !== undefined) {
    return <Error />;
  }

  return (
    <div>
      <Head>
        <title>DC32 Info</title>
        <meta name="description" content="DEF CON 32 Info" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mb-20 ">
        <Heading />
        <Information
          conference={conferenceData}
          faq={faqData ?? []}
          news={newsData ?? []}
        />
      </main>
    </div>
  );
}
