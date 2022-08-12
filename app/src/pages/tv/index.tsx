/* eslint-disable react/function-component-definition */
import type { NextPage } from "next";
import { promises as fs } from "fs";
import path from "path";
import Head from "next/head";
import { toTVData } from "../../utils/misc";
import TV from "../../components/tv/TV";

const TVPage: NextPage<TVProps> = (props) => {
  const { events } = props;
  return (
    <div>
      <Head>
        <title>Info Booth</title>
        <meta name='description' content='Info Booth' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-black'>
        <TV events={events} />
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const confFile = path.join(process.cwd(), "./public/static/con/events.json");

  const eventFile = await fs.readFile(confFile, {
    encoding: "utf-8",
  });

  const events: HTEvent[] = JSON.parse(eventFile) ?? [];

  const eventsData = toTVData(events);

  return {
    props: {
      events: eventsData,
    },
  };
}

export default TVPage;
