// src/pages/schedule/index.tsx
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";

import Head from "next/head";
import TV from "@/components/tv/TV";
import { GroupedSchedule } from "@/types/info";

export default function TVPage() {
  const {
    data: schedule,
    error,
    isLoading,
  } = useSWR<GroupedSchedule>("/ht/schedule.json", fetcher);

  if (isLoading) return <Loading />;
  if (error || !schedule) return <Error />;

  return (
    <>
      <Head>
        <title>TV | DEF CON</title>
        <meta
          name="description"
          content="Full DEF CON 33 TV schedule of sessions, talks, and events."
        />
      </Head>
      <main>
        <TV dateGroup={schedule} />
      </main>
    </>
  );
}
