import useSWR from "swr";
import { fetcher } from "../../lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import React, { useMemo } from "react";
import Heading from "@/components/heading/Heading";
import { useSearchParams } from "next/navigation";
import { People, Person } from "@/types/info";
import PersonDisplay from "@/components/people/person";

export default function PersonPage() {
  const searchParams = useSearchParams();
  const personId = searchParams.get("id");

  const {
    data: peopleJson,
    error: peopleError,
    isLoading: peopleLoading,
  } = useSWR<People, Error>(`../../../ht/people.json`, fetcher);

  const selectedPerson: Person | null = useMemo(() => {
    if (!personId || !peopleJson) return null;

    const id = Number(personId);
    return peopleJson.find((p) => p.id === id) || null;
  }, [personId, peopleJson]);

  if (peopleLoading) return <Loading />;
  if (peopleError) return <Error />;
  if (!personId || selectedPerson === null)
    return <Error msg="Person not found" />;

  return (
    <div>
      <main>
        <Heading />
        <PersonDisplay person={selectedPerson} />
      </main>
    </div>
  );
}
