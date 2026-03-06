import { useEffect } from "react";

export default function TVPage() {
  useEffect(() => {
    window.location.replace("https://junctor.github.io/defcon-microsites/tv/");
  }, []);

  return (
    <main className="grid min-h-screen place-items-center px-6 text-center text-gray-100">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">DEF CON TV</h1>
        <p className="text-gray-400">Redirecting to the live stream...</p>
        <a
          href="https://junctor.github.io/defcon-microsites/tv/"
          className="inline-flex items-center justify-center rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-100 transition hover:border-gray-500 hover:bg-gray-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
        >
          Open DEF CON TV
        </a>
      </div>
    </main>
  );
}
