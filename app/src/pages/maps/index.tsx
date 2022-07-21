/* eslint-disable react/function-component-definition */
import type { NextPage } from "next";
import Head from "next/head";
import Maps from "../../components/maps/Maps";

const MapsPage: NextPage = () => (
  <div>
    <Head>
      <title>D3F C0N Maps</title>
      <meta name='description' content='DEF CON 30 Maps' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, maximum-scale=1'
      />
      <link rel='icon' href='/favicon.ico' />
    </Head>

    <main className='bg-black'>
      <Maps />
    </main>
  </div>
);

export default MapsPage;
