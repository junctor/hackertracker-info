import React from "react";
import AppsLanding from "@/features/apps/AppsLanding";
import Head from "next/head";
import SiteHeader from "@/features/app-shell/SiteHeader";

export default function AppsPage() {
  return (
    <>
      <Head>
        <title>Apps | DEF CON Singapore 2026</title>
        <meta
          name="description"
          content="Download the official Hacker Tracker apps for iOS and Android."
        />
      </Head>
      <main>
        <SiteHeader />
        <AppsLanding />
      </main>
    </>
  );
}
