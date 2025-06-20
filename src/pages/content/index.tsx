import React, { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Heading from "@/components/heading/Heading";
import PersonDisplay from "@/components/people/person";
import { useSearchParams } from "next/navigation";
import { People, Person } from "@/types/info";

export default function PersonPage() {
  const params = useSearchParams();
  const idParam = params.get("id");
  const personId = useMemo(() => (idParam ? Number(idParam) : null), [idParam]);

  const {
    data: people,
    error,
    isLoading,
  } = useSWR<People>("/ht/people.json", fetcher);

  const person: Person | null = useMemo(() => {
    if (!people || personId === null) return null;
    return people.find((p) => p.id === personId) ?? null;
  }, [people, personId]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  if (personId === null || !person) return <Error msg="Person not found" />;

  return (
    <main>
      <Heading />
      <PersonDisplay person={person} />
    </main>
  );
}
