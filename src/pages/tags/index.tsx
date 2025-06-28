// src/pages/schedule/index.tsx
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import { TagTypes } from "@/types/info";
import Head from "next/head";
import Tags from "@/components/tags/Tags";

export default function TagsPage() {
  const {
    data: tags,
    error,
    isLoading,
  } = useSWR<TagTypes>("/ht/tagTypes.json", fetcher);

  if (isLoading) return <Loading />;
  if (error || !tags) return <Error />;

  return (
    <>
      <Head>
        <title>Tags | DEF CON</title>
        <meta
          name="description"
          content="Explore the various tags used in DEF CON 33."
        />
      </Head>
      <main>
        <Heading />
        <Tags tagTypes={tags} />
      </main>
    </>
  );
}
