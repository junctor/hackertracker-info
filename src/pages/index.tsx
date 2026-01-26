import Head from "next/head";
import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dcsg2026");
  }, [router]);

  return (
    <>
      <Head>
        <title>info.defcon.org</title>
        <meta name="description" content="DEF CON" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main />
    </>
  );
}
