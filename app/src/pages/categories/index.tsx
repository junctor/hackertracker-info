import Head from "next/head";
import Categories from "../../components/categories/Categories";
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

  return (
    <div>
      <Head>
        <title>D3F C0N Categories</title>
        <meta name="description" content="DEF CON 31 Categories" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black mb-20 text-white">
        <Categories tags={data} />
      </main>
    </div>
  );
}
