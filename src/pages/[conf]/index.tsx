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
  const pageTitle = `${conf.name} | info.defcon.org`;
  const pageDescription = `${conf.name} schedule and conference information`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://info.defcon.org/${conf.slug}`} />
        <meta name="theme-color" content="#020617" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-dvh bg-slate-950 text-slate-100">
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
