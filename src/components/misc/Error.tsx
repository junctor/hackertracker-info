import Link from "next/link";
import React from "react";

export default function Error({ msg }: { msg?: string }) {
  return (
    <main className="relative grid min-h-screen place-items-center">
      {/* overlays */}
      <div aria-hidden className="scanlines absolute inset-0" />
      <div aria-hidden className="vignette absolute inset-0" />

      <div className="text-center">
        {/* Glitchy RGB title */}
        <div className="relative inline-block select-none isolation-isolate">
          <h1
            className="
              relative text-3xl md:text-5xl font-extrabold tracking-tight
              text-gray-100
              motion-safe:animate-[glitch_1.8s_steps(12,end)_infinite]
            "
          >
            ERROR
            {/* cyan layer */}
            <span
              aria-hidden
              className="
                absolute inset-0 text-cyan-300 mix-blend-screen opacity-95
                motion-safe:animate-[rgb_2.4s_ease-in-out_infinite]
              "
            >
              ERROR
            </span>
            {/* magenta layer */}
            <span
              aria-hidden
              className="
                absolute inset-0 text-fuchsia-400 mix-blend-screen opacity-95
                -translate-x-[1.5px] translate-y-[0.8px]
                motion-safe:animate-[rgb_2.4s_ease-in-out_infinite]
              "
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
            className="
              mx-auto mt-5 mb-6 max-w-xl overflow-x-auto rounded-lg
              border border-red-700/70 bg-red-950/30 p-4 text-left
              font-mono text-xs md:text-sm text-red-200
            "
          >
            {msg}
          </pre>
        ) : (
          <p className="mt-5 mb-6 text-sm md:text-base text-gray-300">
            Something went sideways.
          </p>
        )}

        {/* Action */}
        <Link
          href="/"
          className="
            inline-flex items-center justify-center gap-2
            rounded-md border border-gray-600/70 px-4 py-2
            text-sm font-semibold text-gray-100
            hover:bg-gray-800/70 hover:border-gray-500
            focus:outline-none focus:ring-2 focus:ring-indigo-400
            transition-colors
          "
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
