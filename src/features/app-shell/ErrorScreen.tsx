import { ExclamationTriangleIcon, HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
  msg?: string;
};

export default function ErrorScreen({ msg }: Props) {
  const hasMessage = Boolean(msg?.trim());

  return (
    <main id="main-content" className="ui-page-shell relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.14),transparent_62%)]"
      />

      <section className="ui-page-main grid place-items-center px-4 py-10 sm:py-14">
        <div className="ui-card relative w-full max-w-2xl overflow-hidden px-6 py-7 text-center shadow-[0_24px_70px_rgba(2,6,23,0.38)] sm:px-8 sm:py-9">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-red-300/45 to-transparent"
          />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <ExclamationTriangleIcon className="h-7 w-7" />
          </div>

          <p className="ui-kicker mt-5 text-red-100/85">Something went wrong</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance text-slate-50 sm:text-4xl">
            We couldn&apos;t load this page
          </h1>
          <p
            role={hasMessage ? undefined : "alert"}
            className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base"
          >
            Try again in a moment, or head back to the conference home page.
          </p>

          {hasMessage ? (
            <div className="mt-6 rounded-2xl border border-red-400/16 bg-red-950/20 p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-red-100/75 uppercase">
                Error details
              </p>
              <pre
                role="alert"
                className="mt-2 max-h-[40dvh] overflow-auto font-mono text-xs leading-6 wrap-break-word whitespace-pre-wrap text-red-100/90 sm:text-sm"
              >
                {msg}
              </pre>
            </div>
          ) : null}

          <div className="mt-7 flex justify-center">
            <Link
              href="/"
              className="ui-btn-base ui-btn-secondary ui-focus-ring inline-flex min-w-44 gap-2 rounded-xl px-4 shadow-[0_10px_24px_rgba(2,6,23,0.18)] focus-visible:outline-none"
            >
              <HomeIcon className="h-5 w-5" aria-hidden="true" />
              <span>Go To Home</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
