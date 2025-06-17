import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import PeopleDisplay from "@/components/people/people";
import { People } from "@/types/info";

export default function PeoplePage() {
  const {
    data: people,
    error,
    isLoading,
  } = useSWR<People>("/ht/people.json", fetcher);

  if (isLoading) return <Loading />;
  if (error || !people) return <Error />;

  return (
    <main>
      <Heading />
      <PeopleDisplay people={people} />
    </main>
  );
}
