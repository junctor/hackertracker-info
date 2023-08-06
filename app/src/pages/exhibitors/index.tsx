import Head from "next/head";
import useSWR from "swr";
import { fetcher } from "@/utils/misc";
import Loading from "@/components/misc/Loading";
import Error from "@/components/misc/Error";
import Orgs from "@/components/organization/Organizations";

export default function ExhibitorsPage() {
  const exhibitorsId = 45691;

  const { data, isLoading, error } = useSWR<HTOrganization[], Error>(
    "/ht/organizations.json",
    fetcher
  );

  if (isLoading) {
    return <Loading />;
  }

  if (data === undefined || error !== undefined) {
    return <Error />;
  }

  const orgs = data
    .filter((t) => t.tag_ids.includes(exhibitorsId))
    .sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else {
        return -1;
      }
    });

  return (
    <div>
      <Head>
        <title>DEF CON 31 Villages</title>
        <meta name="description" content="DEF CON 31 Categories" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black mb-20 text-white">
        <Orgs orgs={orgs} title="Exhibitors" type="exhibitor" />
      </main>
    </div>
  );
}
