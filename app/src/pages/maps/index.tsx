/* eslint-disable react/function-component-definition */
import type { NextPage } from "next";
import Head from "next/head";
import { promises as fs } from "fs";
import path from "path";
import Maps from "../../components/maps/Maps";

const MapsPage: NextPage<MapProps> = (props) => {
  const { conference } = props;
  return (
    <div>
      <Head>
        <title>D3F C0N Maps</title>
        <meta name='description' content='DEF CON 30 Maps' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-black'>
        <Maps conference={conference} />
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const confFile = path.join(
    process.cwd(),
    "./public/static/conf/conference.json"
  );

  const confData = await fs.readFile(confFile, {
    encoding: "utf-8",
  });

  const conference: HTConference = JSON.parse(confData) ?? null;

  return {
    props: {
      conference,
    },
  };
}

export default MapsPage;
