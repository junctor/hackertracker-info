import Splash from "@/components/splash/Splash";
import Head from "next/head";
import React from "react";

export default function Home() {
  return (
    <>
      <Head>
        <title>info.defcon.org</title>
        <meta name="description" content="DEF CON Singapore 2025" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black">
        <Splash />
      </main>
    </>
  );
}
