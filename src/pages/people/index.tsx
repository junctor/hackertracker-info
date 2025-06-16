import useSWR from "swr";
import { fetcher } from "../../lib/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import React from "react";
import Heading from "@/components/heading/Heading";
import { People } from "@/types/info";
import PeopleDisplay from "@/components/people/people";

export default function PeoplePage() {
  const {
    data: peopleJson,
    error: peopleError,
    isLoading: peopleLoading,
  } = useSWR<People, Error>(`../../../ht/people.json`, fetcher);

  if (peopleLoading) {
    return <Loading />;
  }

  if (peopleJson === undefined || peopleError !== undefined) {
    return <Error />;
  }

  return (
    <div>
      <main>
        <Heading />
        <PeopleDisplay people={peopleJson} />
      </main>
    </div>
  );
}
