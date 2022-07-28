/* eslint-disable react/function-component-definition */
import type { NextPage } from "next";
import Head from "next/head";
import { promises as fs } from "fs";
import path from "path";
import Splash from "../components/splash/Splash";

const Home: NextPage<SplashProps> = (props) => {
  const { data } = props;

  return (
    <div>
      <Head>
        <title>info.defcon.org</title>
        <meta name='description' content='DEF CON 30' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Splash data={data} />
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const confFile = path.join(
    process.cwd(),
    "./public/static/con/conference.json"
  );

  const confData = await fs.readFile(confFile, {
    encoding: "utf-8",
  });

  const conference: HTConference = JSON.parse(confData);

  const eventsFile = path.join(
    process.cwd(),
    "./public/static/con/events.json"
  );

  const eventFile = await fs.readFile(eventsFile, {
    encoding: "utf-8",
  });

  const events: HTEvent[] = JSON.parse(eventFile) ?? [];

  const speakersFile = path.join(
    process.cwd(),
    "./public/static/con/speakers.json"
  );

  const speakerFile = await fs.readFile(speakersFile, {
    encoding: "utf-8",
  });

  const speakers: HTSpeaker[] = JSON.parse(speakerFile) ?? [];

  const splashData = {
    counts: {
      events: events.length,
      speakers: speakers.length,
    },
    kickoff: conference?.kickoff_timestamp_str ?? "2022-08-12T17:00:00+00:00",
  };

  return {
    props: {
      data: splashData,
    },
  };
}

export default Home;
