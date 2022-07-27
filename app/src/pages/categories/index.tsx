/* eslint-disable react/function-component-definition */
import type { NextPage } from "next";
import { promises as fs } from "fs";
import path from "path";
import Head from "next/head";
import Categories from "../../components/categories/Categories";
import { toCategories } from "../../utils/misc";

const CategoriesPage: NextPage<CategoriesProps> = (props) => {
  const { categories } = props;
  return (
    <div>
      <Head>
        <title>D3F C0N Categories</title>
        <meta name='description' content='DEF CON 30 Categories' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-black'>
        <Categories categories={categories} />
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

  const categoryData = toCategories(events);

  return {
    props: {
      categories: categoryData,
    },
  };
}

export default CategoriesPage;
