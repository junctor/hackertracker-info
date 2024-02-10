import Splash from "@/components/splash/Splash";
import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>info.defcon.org</title>
        <meta name="description" content="DEF CON 32" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black mb-20 text-white">
        <Splash />
      </main>
    </div>
  );
}
