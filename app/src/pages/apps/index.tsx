/* eslint-disable react/function-component-definition */
import type { NextPage } from "next";
import Head from "next/head";
import Apps from "../../components/apps/Apps";
import React from "react";
import Heading from "@/components/heading/Heading";

const AppsPage: NextPage = () => (
  <div>
    <Head>
      <title>DC32 Apps</title>
      <meta name="description" content="DEF CON 32 Apps" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <Heading />
      <Apps />
    </main>
  </div>
);

export default AppsPage;
