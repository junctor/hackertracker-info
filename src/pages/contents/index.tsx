"use client";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import Contents from "@/components/content/Contents";
import Head from "next/head";
import type { ProcessedContents, TagTypes } from "@/types/info";

export default function ContentsPage() {
  const {
    data: items,
    error,
    isLoading,
  } = useSWR<ProcessedContents>("/ht/processedContent.json", fetcher);

  const {
    data: tags,
    error: tagError,
    isLoading: tagIsLoading,
  } = useSWR<TagTypes>("/ht/tagTypes.json", fetcher);

  if (isLoading || tagIsLoading) return <Loading />;
  if (error) return <Error msg="Failed to load content" />;
  if (tagError) return <Error msg="Failed to load tags" />;

  return (
    <>
      <Head>
        <title>Content | DEF CON</title>
        <meta name="description" content="All DEF CON 33 contents." />
      </Head>
      <main>
        <Heading />
        <Contents content={items!} tags={tags ?? []} />
      </main>
    </>
  );
}
