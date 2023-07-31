import Head from "next/head";
import Schedule from "../../components/events/Schedule";
import useSWR from "swr";
import { fetcher, toEventsData } from "@/utils/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import { useSearchParams } from "next/navigation";

export default function CategoryPage() {
  const { data, error, isLoading } = useSWR<HTEvent[], Error>(
    "/ht/events.json",
    fetcher
  );

  const { data: tags, isLoading: tagsIsLoading } = useSWR<HTTag[], Error>(
    "/ht/tags.json",
    fetcher
  );

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");

  if (isLoading || tagsIsLoading) {
    return <Loading />;
  }

  if (data === undefined || tags === undefined || error !== undefined) {
    return <Error />;
  }

  const foundTag = tags
    .flatMap((t) => t.tags)
    .find((t) => String(t.id) === categoryId);

  if (foundTag === undefined) {
    return <Error />;
  }

  const tagEvents = data.filter((e) => e.tag_ids.includes(foundTag.id));

  const events = toEventsData(tagEvents, tags);

  return (
    <div>
      <Head>
        <title>{foundTag.label}</title>
        <meta name="description" content="DEF CON 31" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black mb-20 text-white">
        <Schedule events={events} title={foundTag.label} />
      </main>
    </div>
  );
}
