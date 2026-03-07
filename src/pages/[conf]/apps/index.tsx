import type { GetStaticProps } from "next";

import Head from "next/head";
import React from "react";

import SiteFooter from "@/features/app-shell/SiteFooter";
import SiteHeader from "@/features/app-shell/SiteHeader";
import AppsLanding from "@/features/apps/AppsLanding";
import { ConferenceManifest } from "@/lib/conferences";
import { buildConferenceStaticPaths, getConferenceFromParams } from "@/lib/next-static";
import { PageId } from "@/lib/types/page-meta";

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
      <div className="ui-page-shell">
        <SiteHeader conference={conf} activePageId={activePageId} />
        <main id="main-content" className="ui-page-main">
          <AppsLanding conference={conf} />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<AppsPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "apps" } };
};
