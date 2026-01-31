import React from "react";
import AppsLanding from "@/features/apps/AppsLanding";
import Head from "next/head";
import SiteHeader from "@/features/app-shell/SiteHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { PageId } from "@/lib/types/page-meta";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";

type AppsPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function AppsPage({ conf, activePageId }: AppsPageProps) {
  return (
    <>
      <Head>
        <title>Apps | {conf.name}</title>
        <meta
          name="description"
          content="Download the official Hacker Tracker apps for iOS and Android."
        />
      </Head>
      <main>
        <SiteHeader conference={conf} activePageId={activePageId} />
        <AppsLanding />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<AppsPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "apps" } };
};
