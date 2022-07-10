/* eslint-disable react/function-component-definition */
import { promises as fs } from "fs";
import type { NextPage } from "next";
import Head from "next/head";
import path from "path";
import Speaker from "../../components/speakers/Speaker";

const SpeakerPage: NextPage<SpeakerDetailProps> = (props) => {
  const { speaker } = props;

  return (
    <div>
      <Head>
        <title>{speaker.name}</title>
        <meta name='description' content='DEF CON 30 Speaker' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-black'>
        <Speaker speaker={speaker} />
      </main>
    </div>
  );
};

export async function getStaticProps(context: { params: { speaker: string } }) {
  const { params } = context;
  const speakerId = params.speaker ?? "";

  const confFile = path.join(
    process.cwd(),
    "./public/static/conf/speakers.json"
  );

  const speakerFile = await fs.readFile(confFile, {
    encoding: "utf-8",
  });

  const speakers: HTSpeaker[] = JSON.parse(speakerFile) ?? [];

  const speaker = speakers.find((s) => s.id.toString() === speakerId);

  return {
    props: {
      speaker,
    },
  };
}

export async function getStaticPaths() {
  const confFile = path.join(
    process.cwd(),
    "./public/static/conf/speakers.json"
  );

  const speakerFile = await fs.readFile(confFile, {
    encoding: "utf-8",
  });

  const speakers: HTSpeaker[] = JSON.parse(speakerFile) ?? [];

  const paths = speakers?.map((s) => ({
    params: {
      speaker: s.id.toString(),
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export default SpeakerPage;
