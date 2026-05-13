import { useEffect } from "react";

import Head from "@/components/Head";

const TV_URL = "https://junctor.github.io/defcon-microsites/tv/";

export default function TVPage() {
  useEffect(() => {
    window.location.replace(TV_URL);
  }, []);

  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content={`0;url=${TV_URL}`} />
        <link rel="canonical" href={TV_URL} />
      </Head>
      <main
        id="main-content"
        className="grid min-h-screen place-items-center px-6 text-center text-(--text-primary)"
      >
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">DEF CON TV</h1>
          <p className="text-(--text-muted)">Redirecting to the live stream...</p>
          <a
            href={TV_URL}
            className="ui-btn-base ui-btn-secondary ui-focus-ring focus-visible:outline-none"
          >
            Open DEF CON TV
          </a>
        </div>
      </main>
    </>
  );
}
