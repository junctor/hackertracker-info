import type { NextPage } from "next";
import Head from "next/head";
import Event from "../../components/events/Event";

const SchedulePage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>D3F C0N Event</title>
        <meta name='description' content='DEF CON 30' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-black'>
        <Event />
      </main>
    </div>
  );
};

export default SchedulePage;
