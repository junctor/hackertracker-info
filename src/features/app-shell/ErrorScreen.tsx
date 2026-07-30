import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router";

import { getConference } from "@/lib/conferences";
import { conferenceMenuPath } from "@/lib/routes";

type Props = {
  msg?: string;
  title?: string;
  copy?: string;
  kicker?: string;
  primaryActionHref?: string;
  primaryActionLabel?: string;
  secondaryActionHref?: string;
  secondaryActionLabel?: string;
  retryActionLabel?: string;
};

function reloadPage() {
  window.location.reload();
}

export default function ErrorScreen({
  msg,
  title = "We couldn't load this page",
  copy = "Try again in a moment, or head back to the conference home page.",
  kicker = "Something went wrong",
  primaryActionHref,
  primaryActionLabel,
  secondaryActionHref,
  secondaryActionLabel,
  retryActionLabel,
}: Props) {
  const location = useLocation();
  const hasMessage = Boolean(msg?.trim());
  const [conferenceSegment = ""] = location.pathname.split("/").filter(Boolean);
  const conference = getConference(conferenceSegment);
  const homeHref = conference ? conferenceMenuPath(conference) : "/";
  const resolvedPrimaryHref = primaryActionHref ?? homeHref;
  const resolvedPrimaryLabel = primaryActionLabel ?? (conference ? "Conference Home" : "Site Home");
  const showDefaultHomeIcon = !primaryActionHref || resolvedPrimaryHref === homeHref;

  return (
    <main id="main-content" className="ui-page-shell ui-detail-card">
      <div aria-hidden="true" className="ui-screen-glow-error" />

      <section className="ui-page-main ui-screen-main">
        <div className="ui-card ui-error-card">
          <div aria-hidden="true" className="ui-screen-card-rule-critical" />

          <div className="ui-inset-highlight ui-error-icon">
            <ExclamationTriangleIcon className="ui-icon-lg" aria-hidden="true" />
          </div>

          <p className="ui-kicker ui-kicker-critical ui-screen-kicker">{kicker}</p>
          <h1 className="ui-error-title">{title}</h1>
          <p role={hasMessage ? undefined : "alert"} className="ui-error-copy">
            {copy}
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
            {retryActionLabel ? (
              <button
                type="button"
                className="ui-btn-base ui-btn-primary ui-focus-ring ui-error-retry-button"
                onClick={reloadPage}
              >
                <ArrowPathIcon className="ui-icon-sm" aria-hidden="true" />
                <span>{retryActionLabel}</span>
              </button>
            ) : null}
            <Link
              to={resolvedPrimaryHref}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-error-home-link"
            >
              {showDefaultHomeIcon ? (
                <HomeIcon className="ui-icon-sm" aria-hidden="true" />
              ) : (
                <ArrowLeftIcon className="ui-icon-sm" aria-hidden="true" />
              )}
              <span>{resolvedPrimaryLabel}</span>
            </Link>
            {secondaryActionHref && secondaryActionLabel ? (
              <Link
                to={secondaryActionHref}
                className="ui-btn-base ui-btn-secondary ui-focus-ring ui-error-secondary-link"
              >
                <HomeIcon className="ui-icon-sm" aria-hidden="true" />
                <span>{secondaryActionLabel}</span>
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
