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

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");

  if (isLoading) {
    return <Loading />;
  }

  if (data === undefined || error !== undefined) {
    return <Error />;
  }

  const catEventName =
    data.find((e) => e.type.id.toString() === categoryId)?.type.name ?? "";
  const catEvents = data.filter((e) => e.type.id.toString() === categoryId);

  const events = toEventsData(catEvents);

  return (
    <div>
      <Head>
        <title>{catEventName}</title>
        <meta name="description" content="DEF CON 31" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black mb-20 text-white">
        <Schedule events={events} title={catEventName} />
      </main>
    </div>
  );
}
