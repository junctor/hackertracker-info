import Link from "next/link";

type Props = {
  msg?: string;
};

export default function ErrorScreen({ msg }: Props) {
  return (
    <main id="main-content" className="ui-page-shell">
      <section className="ui-page-main grid place-items-center px-4 py-10">
        <div className="ui-card w-full max-w-xl p-6 text-center sm:p-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
            We Hit A Problem
          </h1>

          {msg ? (
            <pre
              role="alert"
              className="mx-auto mt-5 mb-6 max-w-full overflow-x-auto rounded-md border border-red-700/70 bg-red-950/30 p-4 text-left font-mono text-xs text-red-200 sm:text-sm"
            >
              {msg}
            </pre>
          ) : (
            <p className="mt-5 mb-6 text-sm text-slate-300 sm:text-base">
              We could not load this page. Try again or go to the homepage.
            </p>
          )}

          <Link
            href="/"
            className="ui-btn-base ui-btn-secondary ui-focus-ring focus-visible:outline-none"
          >
            Go To Home
          </Link>
        </div>
      </section>
    </main>
  );
}
