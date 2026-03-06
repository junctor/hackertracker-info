export default function LoadingScreen() {
  return (
    <main className="relative grid min-h-screen place-items-center">
      {/* overlays */}
      <div aria-hidden className="scanlines absolute inset-0" />
      <div aria-hidden className="vignette absolute inset-0" />

      <div className="text-center">
        <div className="isolation-isolate relative inline-block select-none">
          {/* Base: rainbow gradient text */}
          <h1
            className="relative bg-[linear-gradient(90deg,#22d3ee_0%,#e879f9_20%,#f59e0b_40%,#22c55e_60%,#60a5fa_80%,#22d3ee_100%)] bg-size-[300%_100%] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent filter-[drop-shadow(0_0_10px_rgba(232,121,249,0.45))] motion-safe:animate-[slide_5s_linear_infinite]"
          >
            HT
            {/* shimmer sweep (utility-only) */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-x-8 inset-y-0 mix-blend-screen [background:linear-gradient(90deg,transparent_0%,rgba(34,211,238,.25)_45%,rgba(255,255,255,.5)_50%,rgba(232,121,249,.25)_55%,transparent_100%)] motion-safe:animate-[sweep_1.8s_ease-in-out_infinite]"
            />
          </h1>

          {/* Subtle RGB split layers (always visible) */}
          <span
            aria-hidden
            className="absolute inset-0 translate-x-[1.5px] -translate-y-[0.8px] text-cyan-300 opacity-95 mix-blend-screen"
          >
            HT
          </span>
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-[1.5px] translate-y-[0.8px] text-fuchsia-400 opacity-95 mix-blend-screen"
          >
            HT
          </span>
        </div>

        <p className="mt-2 font-mono text-xs text-gray-300/70">loading…</p>
      </div>
    </main>
  );
}
