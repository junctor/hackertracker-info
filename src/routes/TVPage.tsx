import Head from "@/components/Head";

const TV_URL = "https://junctor.github.io/defcon-microsites/tv/";

export default function TVPage() {
  return (
    <>
      <Head>
        <link rel="canonical" href={TV_URL} />
      </Head>
      <main id="main-content" className="ui-tv-main">
        <div className="ui-tv-stack">
          <h1 className="ui-tv-title">DEF CON TV</h1>
          <p className="ui-tv-copy">Open the live stream in a new tab.</p>
          <a
            href={TV_URL}
            target="_blank"
            rel="noreferrer"
            className="ui-btn-base ui-btn-secondary ui-focus-ring"
          >
            Open DEF CON TV
          </a>
        </div>
      </main>
    </>
  );
}
