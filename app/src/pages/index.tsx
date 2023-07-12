import Countdown from "@/components/Countdown";
import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>info.defcon.org</title>
        <meta name="description" content="DEF CON 31" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Countdown />
      </main>
    </div>
  );
}
