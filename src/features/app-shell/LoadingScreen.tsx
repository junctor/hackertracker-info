export default function LoadingScreen() {
  return (
    <main id="main-content" className="ui-page-shell">
      <section className="ui-page-main grid place-items-center px-4">
        <div className="text-center">
          <div
            aria-hidden
            className="mx-auto h-10 w-10 rounded-full border-2 border-slate-700 border-t-[#017FA4] motion-safe:animate-spin"
          />
          <p className="mt-4 text-sm tracking-wide text-slate-300/85 uppercase">Loading</p>
          <p className="mt-1 text-xs text-slate-400">Preparing conference data...</p>
        </div>
      </section>
    </main>
  );
}
