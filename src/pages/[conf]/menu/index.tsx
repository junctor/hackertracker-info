import type { GetStaticProps } from "next";

import Head from "next/head";

import SiteFooter from "@/features/app-shell/SiteFooter";
import Menu from "@/features/home/Menu";
import { ConferenceManifest } from "@/lib/conferences";
import { buildConferenceStaticPaths, getConferenceFromParams } from "@/lib/next-static";

type MenuPageProps = {
  conf: ConferenceManifest;
};

export default function MenuPage({ conf }: MenuPageProps) {
  return (
    <>
      <Head>
        <title>{`${conf.name} | info.defcon.org`}</title>
        <meta name="description" content={conf.name} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <Menu conference={conf} />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<MenuPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf } };
};
