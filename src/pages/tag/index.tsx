// src/pages/schedule/index.tsx
import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import Events from "@/components/schedule/Events";
import { GroupedTag, GroupedTags } from "@/types/info";
import { getBookmarks } from "@/lib/storage";
import Head from "next/head";
import { useRouter } from "next/router";

export default function TagPage() {
  const router = useRouter();
  const idParam = useMemo(() => {
    if (!router.isReady) return null;
    const value = router.query.id;
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  }, [router.isReady, router.query.id]);
  const tagId = useMemo(() => (idParam ? Number(idParam) : null), [idParam]);

  const {
    data: tags,
    error,
    isLoading,
  } = useSWR<GroupedTags>("/ht/tags.json", fetcher);

  const tag: GroupedTag | null = useMemo(() => {
    if (!tags || tagId === null) return null;
    const tag = tags[tagId];
    if (!tag) return null;
    return tag;
  }, [tags, tagId]);

  const bookmarks = useMemo(() => getBookmarks(), []);

  if (!router.isReady) return <Loading />;
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  if (tagId === null || !tag) return <Error msg="Tag not found" />;

  return (
    <>
      <Head>
        <title>{tag.label} | DEF CON Singapore 2026</title>
        <meta
          name="description"
          content={`DEF CON Singapore 2026 schedule for ${tag.label}`}
        />
      </Head>
      <main>
        <Heading />
        <h1 className="text-3xl font-bold text-center mb-6 my-10">
          {tag.label} Schedule
        </h1>
        <Events dateGroup={tag.schedule} bookmarks={bookmarks} />
      </main>
    </>
  );
}
