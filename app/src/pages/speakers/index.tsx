/* eslint-disable react/function-component-definition */
import type { NextPage } from "next";
import { promises as fs } from "fs";
import path from "path";
import Head from "next/head";
import Speakers from "../../components/speakers/Speakers";
import { toSpeakers } from "../../utils/misc";

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
  const confFile = path.join(
    process.cwd(),
    "./public/static/con/speakers.json"
  );

  const speakerFile = await fs.readFile(confFile, {
    encoding: "utf-8",
  });

  const speakers: HTSpeaker[] = JSON.parse(speakerFile) ?? [];

  const speakerData = toSpeakers(speakers);

  return {
    props: {
      speakers: speakerData,
    },
  };
}

export default SpeakersPage;
