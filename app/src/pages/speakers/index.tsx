import Head from "next/head";
import Speakers from "../../components/speakers/Speakers";
import { fetcher, toSpeakers } from "../../utils/misc";
import useSWR from "swr";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";

export default function SpeakersPage() {
  const {
    data: speakersData,
    error: speakersError,
    isLoading: speakersIsLoading,
  } = useSWR<HTSpeaker[], Error>("/ht/speakers.json", fetcher);

  if (speakersIsLoading) {
    return <Loading />;
  }

  if (speakersError !== undefined || speakersData === undefined) {
    return <Error />;
  }

  const speakers = toSpeakers(speakersData);

  return (
    <div>
      <Head>
        <title>D3F C0N Speakers</title>
        <meta name="description" content="DEF CON 31 Speakers" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black">
        <Speakers speakers={speakers} />
      </main>
    </div>
  );
}
