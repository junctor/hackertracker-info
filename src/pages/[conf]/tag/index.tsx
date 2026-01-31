// src/pages/schedule/index.tsx
import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import LoadingScreen from "@/features/app-shell/LoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import SiteHeader from "@/features/app-shell/SiteHeader";
import ScheduleEvents from "@/features/schedule/ScheduleEvents";
import { GroupedTag, GroupedTags } from "@/lib/types/info";
import { getBookmarks } from "@/lib/storage";
import Head from "next/head";
import { useRouter } from "next/router";
import { ConferenceManifest } from "@/lib/conferences";
import {
  buildConferenceStaticPaths,
  getConferenceFromParams,
} from "@/lib/next-static";
import type { GetStaticProps } from "next";
import { PageId } from "@/lib/types/page-meta";

type TagPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

export default function TagPage({ conf, activePageId }: TagPageProps) {
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

  if (!router.isReady) return <LoadingScreen />;
  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  if (tagId === null || !tag) return <ErrorScreen msg="Tag not found" />;

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
        <SiteHeader conference={conf} activePageId={activePageId} />
        <h1 className="text-3xl font-bold text-center mb-6 my-10">
          {tag.label} Schedule
        </h1>
        <ScheduleEvents dateGroup={tag.schedule} bookmarks={bookmarks} />
      </main>
    </>
  );
}

export const getStaticPaths = buildConferenceStaticPaths;

export const getStaticProps: GetStaticProps<TagPageProps> = async (ctx) => {
  const result = getConferenceFromParams(ctx.params);
  if (!result) return { notFound: true };
  return { props: { conf: result.conf, activePageId: "tag" } };
};
