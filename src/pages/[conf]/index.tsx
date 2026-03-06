import type { GetStaticProps } from "next";

import Head from "next/head";
import React from "react";

import Splash from "@/features/home/Splash";
import { ConferenceManifest } from "@/lib/conferences";
import { buildConferenceStaticPaths, getConferenceFromParams } from "@/lib/next-static";

type HomePageProps = {
  conf: ConferenceManifest;
};

export default function Home({ conf }: HomePageProps) {
  return (
    <>
      <Head>
        <title>info.defcon.org</title>
        <meta name="description" content={conf.name} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Splash conference={conf} />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<HomePageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf } };
};
