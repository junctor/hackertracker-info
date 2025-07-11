import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import { Documents } from "@/types/info";
import CodeOfConduct from "@/components/code-of-conduct/CodeOfConduct";
import Head from "next/head";

export default function CodeOfConductPage() {
  const {
    data: documents,
    error,
    isLoading,
  } = useSWR<Documents>("/ht/documents.json", fetcher);

  if (isLoading) return <Loading />;
  if (error || !documents) return <Error />;

  const getCoC = documents.find((doc) => doc.title_text === "Code of Conduct");

  if (!getCoC) {
    return <Error msg="Code of Conduct not found." />;
  }

  return (
    <>
      <Head>
        <title>Code of Conduct | DEF CON</title>
        <meta
          name="description"
          content="Community expectations and event rules."
        />
      </Head>
      <main>
        <Heading />
        <CodeOfConduct text={getCoC.body_text} />
      </main>
    </>
  );
}
