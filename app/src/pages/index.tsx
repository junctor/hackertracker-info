import Error from "@/components/misc/Error";
import Loading from "@/components/misc/Loading";
import Splash from "@/components/splash/Splash";
import { fetcher } from "@/utils/misc";
import Head from "next/head";
import useSWR from "swr";

export default function Home() {
  const { data, error, isLoading } = useSWR<HTConference, Error>(
    "/ht/conference.json",
    fetcher
  );

  if (isLoading) {
    return <Loading />;
  }

  if (data === undefined || error !== undefined) {
    return <Error />;
  }

  return (
    <div>
      <Head>
        <title>info.defcon.org</title>
        <meta name="description" content="DEF CON 31" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black mb-20 text-white">
        <Splash />
      </main>
    </div>
  );
}
