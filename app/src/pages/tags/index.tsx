import Head from "next/head";
import Tags from "../../components/tags/Tags";
import useSWR from "swr";
import { fetcher } from "@/utils/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";

export default function CategoriesPage() {
  const { data, isLoading, error } = useSWR<HTTag[], Error>(
    "/ht/tags.json",
    fetcher
  );

  if (isLoading) {
    return <Loading />;
  }

  if (data === undefined || error !== undefined) {
    return <Error />;
  }

  const tags = data.filter((t) => t.category === "content");

  return (
    <div>
      <Head>
        <title>DEF CON 31 Tags</title>
        <meta name="description" content="DEF CON 31 Categories" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black mb-20 text-white">
        <Tags tags={tags} />
      </main>
    </div>
  );
}
