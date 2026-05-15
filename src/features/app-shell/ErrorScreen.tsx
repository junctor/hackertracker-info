import { ExclamationTriangleIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

type Props = {
  msg?: string;
};

export default function ErrorScreen({ msg }: Props) {
  const hasMessage = Boolean(msg?.trim());

  return (
    <main id="main-content" className="ui-page-shell ui-detail-card">
      <div aria-hidden="true" className="ui-screen-glow-error" />

      <section className="ui-page-main ui-screen-main">
        <div className="ui-card ui-error-card">
          <div aria-hidden="true" className="ui-screen-card-rule-critical" />

          <div className="ui-inset-highlight ui-error-icon">
            <ExclamationTriangleIcon className="ui-icon-lg" />
          </div>

          <p className="ui-kicker ui-kicker-critical ui-screen-kicker">Something went wrong</p>
          <h1 className="ui-error-title">We couldn&apos;t load this page</h1>
          <p role={hasMessage ? undefined : "alert"} className="ui-error-copy">
            Try again in a moment, or head back to the conference home page.
          </p>

          {hasMessage ? (
            <div className="ui-inset-highlight-soft ui-error-details">
              <p className="ui-error-details-label">Error details</p>
              <pre role="alert" className="ui-error-message">
                {msg}
              </pre>
            </div>
          ) : null}

          <div className="ui-error-actions">
            <Link to="/" className="ui-btn-base ui-btn-secondary ui-focus-ring ui-error-home-link">
              <HomeIcon className="ui-icon-sm" aria-hidden="true" />
              <span>Go To Home</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
