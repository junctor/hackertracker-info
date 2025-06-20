import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import { Articles } from "@/types/info";
import Announcements from "@/components/announcements/Announcements";

export default function AnnoucementsPage() {
  const {
    data: articles,
    error,
    isLoading,
  } = useSWR<Articles>("/ht/articles.json", fetcher);

  if (isLoading) return <Loading />;
  if (error || !articles) return <Error />;

  return (
    <main>
      <Heading />
      <Announcements announcements={articles} />
    </main>
  );
}
