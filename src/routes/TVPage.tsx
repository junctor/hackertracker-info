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
      <main id="main-content" className="ui-tv-main">
        <div className="ui-tv-stack">
          <h1 className="ui-tv-title">DEF CON TV</h1>
          <p className="ui-tv-copy">Redirecting to the live stream...</p>
          <a href={TV_URL} className="ui-btn-base ui-btn-secondary ui-focus-ring">
            Open DEF CON TV
          </a>
        </div>
      </main>
    </>
  );
}
