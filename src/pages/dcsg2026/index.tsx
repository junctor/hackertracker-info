import Splash from "@/features/home/Splash";
import { getConference } from "@/lib/conferences";
import Head from "next/head";
import React from "react";

export default function Home() {
  const conference = getConference("dcsg2026");

  return (
    <>
      <Head>
        <title>info.defcon.org</title>
        <meta name="description" content="DEF CON Singapore 2026" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black">
        <Splash conference={conference} />
      </main>
    </>
  );
}
