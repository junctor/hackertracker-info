import Head from "next/head";
import Speaker from "../../components/speakers/Speaker";
import { fetcher } from "../../utils/misc";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";

export default function SpeakerPage() {
  const {
    data: speakersData,
    error: speakersError,
    isLoading: speakersIsLoading,
  } = useSWR<HTSpeaker[], Error>("/ht/speakers.json", fetcher);

  const searchParams = useSearchParams();
  const speakerId = searchParams.get("id");

  if (speakersIsLoading) {
    return <Loading />;
  }

  const speaker = speakersData?.find((s) => s.id.toString() === speakerId);

  if (speaker == null || speakersError !== undefined) {
    return <Error />;
  }
  return (
    <div>
      <Head>
        <title>{speaker.name}</title>
        <meta name="description" content="DEF CON 31 Speaker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black">
        <Speaker speaker={speaker} />
      </main>
    </div>
  );
}
