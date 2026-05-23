import React from "react";

import Head from "@/components/Head";
import Splash from "@/features/home/Splash";
import { aiMetadata, conferenceDataFeeds, conferencePath } from "@/lib/aiMetadata";
import { ConferenceManifest } from "@/lib/conferences";

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
        {aiMetadata({
          title: pageTitle,
          description: pageDescription,
          path: conferencePath(conf),
          jsonFeeds: conferenceDataFeeds(conf),
        })}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main id="main-content" className="ui-page-shell">
        <Splash conference={conf} />
      </main>
    </>
  );
}
