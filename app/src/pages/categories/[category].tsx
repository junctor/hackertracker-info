/* eslint-disable react/function-component-definition */
import { promises as fs } from "fs";
import type { NextPage } from "next";
import Head from "next/head";
import path from "path";
import Schedule from "../../components/events/Schedule";
import { toEventsData } from "../../utils/misc";

const CategoryPage: NextPage<CategoryPageProps> = (props) => {
  const { category, events } = props;

  return (
    <div>
      <Head>
        <title>{category}</title>
        <meta name='description' content='DEF CON 30' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-black'>
        <Schedule events={events} title={category} />
      </main>
    </div>
  );
};

export async function getStaticProps(context: {
  params: { category: string };
}) {
  const { params } = context;
  const catId = params.category ?? 0;

  const confFile = path.join(process.cwd(), "./public/static/conf/events.json");

  const eventFile = await fs.readFile(confFile, {
    encoding: "utf-8",
  });

  const events: HTEvent[] = JSON.parse(eventFile) ?? [];
  const catEvent = events.find((e) => e.type.id.toString() === catId);
  const catEvents = events.filter((e) => e.type.id.toString() === catId);
  const eventsData = toEventsData(catEvents);

  return {
    props: {
      category: catEvent?.type.name ?? "",
      events: eventsData,
    },
  };
}

export async function getStaticPaths() {
  const confFile = path.join(process.cwd(), "./public/static/conf/events.json");

  const eventFile = await fs.readFile(confFile, {
    encoding: "utf-8",
  });

  const events: HTEvent[] = JSON.parse(eventFile) ?? [];

  const categores = events.reduce((ids, e) => {
    ids.add(e.type.id);
    return ids;
  }, new Set<number>());

  const paths = Array.from(categores)?.map((c) => ({
    params: {
      category: c.toString(),
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export default CategoryPage;
