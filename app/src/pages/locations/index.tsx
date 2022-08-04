/* eslint-disable react/function-component-definition */
import type { NextPage } from "next";
import { promises as fs } from "fs";
import path from "path";
import Head from "next/head";
import Locations from "../../components/locations/Locations";

const LocationsPage: NextPage<LocationsProps> = (props) => {
  const { locations } = props;
  return (
    <div>
      <Head>
        <title>D3F C0N Info</title>
        <meta name='description' content='DEF CON 30 Info' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-black'>
        <Locations locations={locations} />
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const confFile = path.join(
    process.cwd(),
    "./public/static/con/locations.json"
  );

  const locData = await fs.readFile(confFile, {
    encoding: "utf-8",
  });

  const locations: HTLocations[] = JSON.parse(locData) ?? [];

  return {
    props: {
      locations,
    },
  };
}

export default LocationsPage;
