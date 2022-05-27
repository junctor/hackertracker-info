import type { NextPage } from "next";
import Head from "next/head";
import Countdown from "../components/countdown/Countdown";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>info.defcon.org</title>
        <meta name='description' content='DEF CON 30' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Countdown />
      </main>
    </div>
  );
};

export default Home;
