import Head from "next/head";
import TV from "../../components/tv/TV";
import useSWR from "swr";
import { fetcher, toTVData } from "@/utils/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";

export default function TVPage() {
  const { data, error, isLoading } = useSWR<HTEvent[], Error>(
    "/ht/events.json",
    fetcher
  );

  if (isLoading) {
    return <Loading />;
  }

  if (data === undefined || error !== undefined) {
    return <Error />;
  }

  const events = toTVData(data);

  return (
    <div>
      <Head>
        <title>Info Booth</title>
        <meta name="description" content="Info Booth" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black mb-20 text-white">
        <TV events={events} />
      </main>
    </div>
  );
}
