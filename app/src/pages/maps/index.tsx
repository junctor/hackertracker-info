import Maps from "../../components/maps/Maps";
import { fetcher } from "@/utils/misc";
import Head from "next/head";
import useSWR from "swr";
import Error from "@/components/misc/Error";
import Loading from "@/components/misc/Loading";

export default function MapsPage() {
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
        <title>D3F C0N Maps</title>
        <meta name="description" content="DEF CON 31 Maps" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black mb-20">
        <Maps conference={data} />
      </main>
    </div>
  );
}
