import React from "react";
import Heading from "@/components/heading/Heading";
import Head from "next/head";

export default function MapsPage() {
  return (
    <>
      <Head>
        <title>Maps | DEF CON</title>
        <meta name="description" content="DEF CON 33 Maps" />
      </Head>
      <main>
        <Heading />
        {/* Placeholder for maps content */}
        <div>
          <h1 className="text-3xl font-bold mb-6 mt-10 mx-10">Maps</h1>
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400" />
            <pre className="bg-black text-green-400 font-mono p-4 rounded mx-10 mt-6 text-sm shadow-md">
              {`> Initiating geospatial subroutine...
> Decoding SIGINT...
> Searching for: Las Vegas Convention Center layout...
> Access denied.
> Retrying...
> Retrying...
> Access granted.
> Rendering map...

> Stay tuned for the official DEF CON 33 maps, coming soon!`}
            </pre>
          </div>
        </div>
      </main>
    </>
  );
}
