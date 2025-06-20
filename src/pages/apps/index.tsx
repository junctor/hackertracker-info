import React from "react";
import Apps from "@/components/apps/Apps";
import Head from "next/head";

export default function AppsPage() {
  return (
    <>
      <Head>
        <title>Apps | DEF CON</title>
        <meta
          name="description"
          content="Download the official Hacker Tracker apps for iOS and Android."
        />
      </Head>
      <main>
        <Apps />
      </main>
    </>
  );
}
