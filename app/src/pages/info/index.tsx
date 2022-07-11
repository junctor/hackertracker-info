/* eslint-disable react/function-component-definition */
import type { NextPage } from "next";
import { promises as fs } from "fs";
import path from "path";
import Head from "next/head";
import Info from "../../components/info/info";

const InfoPage: NextPage<InfoProps> = (props) => {
  const { conference } = props;
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
        <Info conference={conference} />
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

  const conf: HTConference = JSON.parse(confData) ?? null;

  return {
    props: {
      conference: conf,
    },
  };
}

export default InfoPage;
