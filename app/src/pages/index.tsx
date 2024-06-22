import Heading from "@/components/heading/Heading";
import Splash from "@/components/splash/Splash";
import Head from "next/head";
import React from "react";

export default function Home() {
  return (
    <div>
      <Head>
        <title>info.defcon.org</title>
        <meta name="description" content="DEF CON 32" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mb-20">
        <Heading />
        <Splash />
      </main>
    </div>
  );
}
