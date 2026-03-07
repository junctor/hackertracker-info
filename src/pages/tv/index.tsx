import Head from "next/head";

const TV_URL = "https://junctor.github.io/defcon-microsites/tv/";

export default function TVPage() {
  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content={`0;url=${TV_URL}`} />
        <link rel="canonical" href={TV_URL} />
      </Head>
      <main
        id="main-content"
        className="grid min-h-screen place-items-center px-6 text-center text-slate-100"
      >
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">DEF CON TV</h1>
          <p className="text-slate-400">Redirecting to the live stream...</p>
          <a
            href={TV_URL}
            className="inline-flex items-center justify-center rounded-md border border-slate-700/80 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none"
          >
            Open DEF CON TV
          </a>
        </div>
      </main>
    </>
  );
}
