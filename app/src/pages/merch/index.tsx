import Head from "next/head";
import { fetcher } from "../../utils/misc";
import useSWR from "swr";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Merch from "@/components/merch/Merch";

export default function MerchPage() {
  const { data, error, isLoading } = useSWR<FBProducts, Error>(
    "https://firestore.googleapis.com/v1/projects/hackertest-5a202/databases/(default)/documents/conferences/DEFCON30/products?pageSize=1000",
    fetcher
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error !== undefined || data === undefined) {
    return <Error />;
  }

  return (
    <div>
      <Head>
        <title>DEF CON 31 Merch</title>
        <meta name="description" content="DEF CON 31 Merch" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black mb-20 text-white">
        <Merch products={data} />
      </main>
    </div>
  );
}
