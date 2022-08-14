/* eslint-disable react/function-component-definition */
import type { NextPage } from "next";
import Head from "next/head";
import NFO from "../../components/nfo/NFO";

const NFOPage: NextPage = () => (
  <div>
    <Head>
      <title>NFO</title>
      <meta name='description' content='NFO' />
      <link rel='icon' href='/favicon.ico' />
    </Head>

    <main>
      <NFO />
    </main>
  </div>
);

export default NFOPage;
