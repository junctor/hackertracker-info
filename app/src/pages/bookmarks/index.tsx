/* eslint-disable react/function-component-definition */
import type { NextPage } from "next";
import { promises as fs } from "fs";
import path from "path";
import Head from "next/head";
import { toEventsData } from "../../utils/misc";
import Bookmarks from "../../components/bookmarks/Bookmarks";
import type { HTEvent } from "../../ht";

const BookmarksPage: NextPage<ScheduleProps> = (props) => {
  const { events } = props;
  return (
    <div>
      <Head>
        <title>D3F C0N Bookmarks</title>
        <meta name='description' content='DEF CON 30 Bookmarks' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-black'>
        <Bookmarks events={events} title='Bookmarks' />
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

  const eventsData = toEventsData(events);

  return {
    props: {
      events: eventsData,
    },
  };
}

export default BookmarksPage;
