import { promises as fs } from "fs";
import type { NextPage } from "next";
import Head from "next/head";
import path from "path";
import Event from "../../components/events/Event";

const EventPage: NextPage<EventProps> = (props) => {
  const { event } = props;

  return (
    <div>
      <Head>
        <title>{event.title}</title>
        <meta name='description' content='DEF CON 30' />
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
  const eventId = params.event ?? 0;

  const fileToRead = path.join(
    process.cwd(),
    "./public/static/conf/events.json"
  );

  let eventFile = await fs.readFile(fileToRead, {
    encoding: "utf-8",
  });

  let events: HTEvent[] = JSON.parse(eventFile) ?? [];
  let event = events.find((e) => e.id.toString() === eventId);

  return {
    props: {
      event: event,
    },
  };
}

export async function getStaticPaths() {
  const fileToRead = path.join(
    process.cwd(),
    "./public/static/conf/events.json"
  );

  let eventFile = await fs.readFile(fileToRead, {
    encoding: "utf-8",
  });

  let events: HTEvent[] = JSON.parse(eventFile) ?? [];

  const paths = events?.map((e) => {
    return {
      params: {
        event: e.id.toString(),
      },
    };
  });
  return {
    paths: paths,
    fallback: false,
  };
}

export default EventPage;
