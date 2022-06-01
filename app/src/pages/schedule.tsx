import type { NextPage } from "next";
import Head from "next/head";
import Schedule from "../components/schedule/Schedule";

const SchedulePage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>info.defcon.org</title>
        <meta name='description' content='DEF CON 30' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Schedule />
      </main>
    </div>
  );
};

export default SchedulePage;
