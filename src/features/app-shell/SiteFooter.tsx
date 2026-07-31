import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { forwardRef, useState } from "react";

import { resetConferenceCache } from "@/lib/cache/conference-cache";
import { type ConferenceManifest } from "@/lib/conferences";
import { useTransientStatus } from "@/lib/hooks/useTransientStatus";

type Props = {
  conference: ConferenceManifest;
};

const SiteFooter = forwardRef<HTMLElement, Props>(function SiteFooter({ conference }, ref) {
  const [isResetting, setIsResetting] = useState(false);
  const [status, setStatus] = useTransientStatus();

  const handleResetData = async () => {
    const confirmed = window.confirm(
      [
        "Reset downloaded conference data?",
        "",
        `This will remove cached schedule and conference data for ${conference.name} and download a fresh copy. Your bookmarks and preferences will not be changed.`,
      ].join("\n"),
    );

    if (!confirmed) return;

    setIsResetting(true);
    try {
      await resetConferenceCache(conference);
      setStatus("Downloaded data reset. Reloading...");
      window.location.reload();
    } catch {
      setStatus("Could not reset downloaded data. Try again in a moment.");
      setIsResetting(false);
    }
  };

  return (
    <footer ref={ref} className="ui-site-footer">
      <div className="ui-chrome-container ui-site-footer-inner">
        <div className="ui-site-footer-row">
          <div className="ui-site-footer-brand">
            <a href="/apps/" className="ui-focus-ring ui-site-footer-link">
              <p className="ui-section-label ui-site-footer-label hacker-tracker-text">
                Hacker Tracker
              </p>
            </a>
          </div>

          <div className="ui-site-footer-actions">
            <button
              type="button"
              className="ui-focus-ring ui-site-footer-reset"
              onClick={handleResetData}
              disabled={isResetting}
              aria-label="Refresh downloaded conference data"
              aria-busy={isResetting}
              title="Refresh downloaded conference data"
            >
              <ArrowPathIcon className="ui-icon-xs" aria-hidden="true" />
            </button>
            <a
              href="https://github.com/junctor/hackertracker-info"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="ui-icon-plain ui-site-footer-source"
            >
              <img
                src="/images/icons/github-invertocat-white.svg"
                alt=""
                className="ui-icon-xs"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
        <p role="status" aria-live="polite" className="ui-site-footer-status">
          {status}
        </p>
      </div>
    </footer>
  );
});

export default SiteFooter;
