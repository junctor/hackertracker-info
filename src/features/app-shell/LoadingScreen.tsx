export default function LoadingScreen() {
  return (
    <main id="main-content" className="ui-page-shell relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(1,127,164,0.16),transparent_62%)]"
      />

      <section className="ui-page-main grid place-items-center px-4 py-10 sm:py-14">
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="ui-card relative w-full max-w-md overflow-hidden px-6 py-7 text-center shadow-[0_24px_70px_rgba(2,6,23,0.34)] sm:px-8 sm:py-8"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#6CCDBB]/60 to-transparent"
          />

          <div
            aria-hidden="true"
            className="relative mx-auto flex h-16 w-16 items-center justify-center"
          >
            <span className="absolute inset-0 rounded-full border border-[#017FA4]/20 bg-[#017FA4]/8" />
            <span className="absolute inset-[0.35rem] rounded-full border-2 border-slate-700/80 border-t-[#6CCDBB] motion-safe:animate-spin motion-reduce:animate-none" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#6CCDBB] shadow-[0_0_18px_rgba(108,205,187,0.55)] motion-safe:animate-pulse motion-reduce:animate-none" />
          </div>

          <p className="ui-kicker mt-5">Loading</p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-balance text-slate-50 sm:text-2xl">
            Loading conference data
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Pulling together sessions, content, and navigation.
          </p>

          <div aria-hidden="true" className="mt-6 space-y-2.5">
            <div className="h-2 rounded-full bg-white/6 motion-safe:animate-pulse motion-reduce:animate-none" />
            <div className="h-2 w-5/6 rounded-full bg-white/5 motion-safe:animate-pulse motion-reduce:animate-none" />
            <div className="h-2 w-2/3 rounded-full bg-white/4 motion-safe:animate-pulse motion-reduce:animate-none" />
          </div>

          <span className="sr-only">Loading conference data.</span>
        </div>
      </section>
    </main>
  );
}
