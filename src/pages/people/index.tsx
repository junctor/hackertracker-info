import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import PeopleDisplay from "@/components/people/people";
import { People } from "@/types/info";
import Head from "next/head";

export default function PeoplePage() {
  const {
    data: people,
    error,
    isLoading,
  } = useSWR<People>("/ht/people.json", fetcher);

  if (isLoading) return <Loading />;
  if (error || !people) return <Error />;

  return (
    <>
      <Head>
        <title>People | DEF CON Singapore 2025</title>
        <meta
          name="description"
          content="Browse bios and sessions for all DEF CON Singapore 2025 participants."
        />
      </Head>
      <main>
        <Heading />
        <PeopleDisplay people={people} />
      </main>
    </>
  );
}
