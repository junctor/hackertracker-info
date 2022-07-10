/* eslint-disable react/function-component-definition */
import { promises as fs } from "fs";
import type { NextPage } from "next";
import Head from "next/head";
import path from "path";
import Event from "../../components/events/Event";

const EventPage: NextPage<EventDetailProps> = (props) => {
  const { event } = props;

  return (
    <div>
      <Head>
        <title>{event.title}</title>
        <meta name='description' content='DEF CON 30 Event' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-black'>
        <Event event={event} />
      </main>
    </div>
  );
};

export async function getStaticProps(context: { params: { event: string } }) {
  const { params } = context;
  const eventId = params.event ?? "";

  const confFile = path.join(process.cwd(), "./public/static/conf/events.json");

  const eventFile = await fs.readFile(confFile, {
    encoding: "utf-8",
  });

  const events: HTEvent[] = JSON.parse(eventFile) ?? [];
  const event = events.find((e) => e.id.toString() === eventId);

  return {
    props: {
      event,
    },
  };
}

export async function getStaticPaths() {
  const confFile = path.join(process.cwd(), "./public/static/conf/events.json");

  const eventFile = await fs.readFile(confFile, {
    encoding: "utf-8",
  });

  const events: HTEvent[] = JSON.parse(eventFile) ?? [];

  const paths = events?.map((e) => ({
    params: {
      event: e.id.toString(),
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export default EventPage;
