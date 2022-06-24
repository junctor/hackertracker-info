import type { NextPage } from "next";
import Head from "next/head";
import Schedule from "../../components/events/Schedule";

const SchedulePage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>D3F C0N Events</title>
        <meta name='description' content='DEF CON 30' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-black'>
        <Schedule />
      </main>
    </div>
  );
};

export default SchedulePage;
