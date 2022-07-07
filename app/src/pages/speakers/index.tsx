import type { NextPage } from "next";
import { promises as fs } from "fs";
import path from "path";
import Head from "next/head";
import Categories from "../../components/categories/Categories";
import { toCategories, toSpeakers } from "../../utils/misc";
import Speakers from "../../components/speakers/Speakers";

const SpeakersPage: NextPage<SpeakersProps> = (props) => {
  const { speakers } = props;
  return (
    <div>
      <Head>
        <title>D3F C0N Speakers</title>
        <meta name='description' content='DEF CON 30 Speakers' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-black'>
        <Speakers speakers={speakers} />
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const fileToRead = path.join(
    process.cwd(),
    "./public/static/conf/events.json"
  );

  let eventFile = await fs.readFile(fileToRead, {
    encoding: "utf-8",
  });

  let events: HTEvent[] = JSON.parse(eventFile) ?? [];

  let speakerData = toSpeakers(events);

  return {
    props: {
      speakers: speakerData,
    },
  };
}

export default SpeakersPage;
