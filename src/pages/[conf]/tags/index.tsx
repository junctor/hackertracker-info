// src/pages/schedule/index.tsx
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import { TagTypes } from "@/lib/types/info";
import Head from "next/head";
import TagsList from "@/features/tags/TagsList";

export default function TagsPage() {
  const {
    data: tags,
    error,
    isLoading,
  } = useSWR<TagTypes>("/ht/tagtypes.json", fetcher);

  if (isLoading) return <LoadingScreen />;
  if (error || !tags) return <ErrorScreen />;

  return (
    <>
      <Head>
        <title>Tags | DEF CON Singapore 2026</title>
        <meta
          name="description"
          content="Explore the various tags used in DEF CON Singapore 2026."
        />
      </Head>
      <main>
        <SiteHeader />
        <TagsList tagTypes={tags} />
      </main>
    </>
  );
}
