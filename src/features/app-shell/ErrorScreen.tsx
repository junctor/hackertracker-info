import { ExclamationTriangleIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

type Props = {
  msg?: string;
};

export default function ErrorScreen({ msg }: Props) {
  const hasMessage = Boolean(msg?.trim());

  return (
    <main id="main-content" className="ui-page-shell relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="ui-screen-glow-error pointer-events-none absolute inset-x-0 top-0 h-48"
      />

      <section className="ui-page-main grid place-items-center px-4 py-10 sm:py-14">
        <div className="ui-card relative w-full max-w-2xl overflow-hidden px-6 py-7 text-center shadow-2xl sm:px-8 sm:py-9">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--dc34-accent-critical)/45 to-transparent"
          />

          <div className="ui-inset-highlight mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-(--dc34-accent-critical)/20 bg-(--dc34-accent-critical)/10 text-white">
            <ExclamationTriangleIcon className="h-7 w-7" />
          </div>

          <p className="ui-kicker ui-kicker-critical mt-5">Something went wrong</p>
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
            <div className="ui-inset-highlight-soft mt-6 rounded-2xl border border-(--dc34-accent-critical)/16 bg-(--dc34-accent-critical)/10 p-4 text-left">
              <p className="text-xs font-semibold tracking-widest text-white/75 uppercase">
                Error details
              </p>
              <pre
                role="alert"
                className="mt-2 max-h-80 overflow-auto font-mono text-xs leading-6 wrap-break-word whitespace-pre-wrap text-white/90 sm:max-h-96 sm:text-sm"
              >
                {msg}
              </pre>
            </div>
          ) : null}

          <div className="mt-7 flex justify-center">
            <Link
              to="/"
              className="ui-btn-base ui-btn-secondary ui-focus-ring inline-flex min-w-44 gap-2 rounded-xl px-4 shadow-lg focus-visible:outline-none"
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
