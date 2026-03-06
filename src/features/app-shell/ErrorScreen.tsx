import Link from "next/link";

type Props = {
  msg?: string;
};

export default function ErrorScreen({ msg }: Props) {
  return (
    <main className="relative grid min-h-screen place-items-center">
      {/* overlays */}
      <div aria-hidden className="scanlines absolute inset-0" />
      <div aria-hidden className="vignette absolute inset-0" />

      <div className="text-center">
        {/* Glitchy RGB title */}
        <div className="isolation-isolate relative inline-block select-none">
          <h1 className="relative text-3xl font-extrabold tracking-tight text-slate-100 motion-safe:animate-[glitch_1.8s_steps(12,end)_infinite] md:text-5xl">
            ERROR
            {/* cyan layer */}
            <span
              aria-hidden
              className="absolute inset-0 text-cyan-300 opacity-95 mix-blend-screen motion-safe:animate-[rgb_2.4s_ease-in-out_infinite]"
            >
              ERROR
            </span>
            {/* magenta layer */}
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-[1.5px] translate-y-[0.8px] text-fuchsia-400 opacity-95 mix-blend-screen motion-safe:animate-[rgb_2.4s_ease-in-out_infinite]"
              style={{ animationDelay: "0.15s" }}
            >
              ERROR
            </span>
          </h1>
        </div>

        {/* Message block (optional) */}
        {msg ? (
          <pre
            role="alert"
            className="mx-auto mt-5 mb-6 max-w-xl overflow-x-auto rounded-lg border border-red-700/70 bg-red-950/30 p-4 text-left font-mono text-xs text-red-200 md:text-sm"
          >
            {msg}
          </pre>
        ) : (
          <p className="mt-5 mb-6 text-sm text-slate-300 md:text-base">Something went sideways.</p>
        )}

        {/* Action */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-600/70 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:border-slate-500 hover:bg-slate-800/70 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
