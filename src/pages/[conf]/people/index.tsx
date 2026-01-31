import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import PeopleList from "@/features/people/PeopleList";
import { People } from "@/lib/types/info";
import Head from "next/head";

export default function PeoplePage() {
  const {
    data: people,
    error,
    isLoading,
  } = useSWR<People>("/ht/people.json", fetcher);

  if (isLoading) return <LoadingScreen />;
  if (error || !people) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>People | DEF CON Singapore 2026</title>
        <meta
          name="description"
          content="Browse bios and sessions for all DEF CON Singapore 2026 participants."
        />
      </Head>
      <main>
        <SiteHeader />
        <PeopleList people={people} />
      </main>
    </>
  );
}
