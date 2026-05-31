import type { ConferenceManifest } from "@/lib/conferences";
import type { PageId } from "@/lib/types/page-meta";

import ConferenceLayout from "./ConferenceLayout";

type Props = {
  conference: ConferenceManifest;
  activePageId: PageId;
  variant?: "default" | "schedule";
};

export default function ConferenceLoadingScreen({
  conference,
  activePageId,
  variant = "default",
}: Props) {
  return (
    <ConferenceLayout
      conference={conference}
      activePageId={activePageId}
      className={variant === "schedule" ? "ui-schedule-page-shell" : undefined}
    >
      {variant === "schedule" ? <ScheduleLoadingContent /> : <DefaultLoadingContent />}
    </ConferenceLayout>
  );
}

function DefaultLoadingContent() {
  return (
    <section
      aria-label="Loading conference content"
      aria-busy="true"
      className="ui-container ui-page-content ui-route-loading"
    >
      <div aria-hidden="true" className="ui-route-loading-header">
        <span className="ui-skeleton-line ui-skeleton-line-kicker" />
        <span className="ui-skeleton-line ui-skeleton-line-title" />
        <span className="ui-skeleton-line ui-skeleton-line-copy" />
      </div>

      <div aria-hidden="true" className="ui-route-loading-list">
        {Array.from({ length: 4 }, (_, index) => (
          <span key={index} className="ui-card ui-route-loading-card" />
        ))}
      </div>

      <span className="ui-visually-hidden">Loading conference content.</span>
    </section>
  );
}

function ScheduleLoadingContent() {
  return (
    <div
      aria-label="Loading schedule"
      aria-busy="true"
      className="ui-schedule-shell ui-schedule-loading-shell"
    >
      <div className="ui-container ui-schedule-tools">
        <div aria-hidden="true" className="ui-schedule-tool-list">
          <span className="ui-skeleton-control ui-schedule-loading-tool" />
          <span className="ui-skeleton-control ui-schedule-loading-tool" />
        </div>
      </div>

      <div className="ui-topbar ui-schedule-day-tabs">
        <div className="ui-container ui-schedule-tabs-inner">
          <div className="ui-inset-highlight-soft ui-schedule-tabs-tray">
            <div aria-hidden="true" className="ui-scrollbar-none ui-schedule-tab-scroll">
              <div className="ui-schedule-tab-list">
                {Array.from({ length: 3 }, (_, index) => (
                  <span key={index} className="ui-skeleton-control ui-schedule-loading-tab" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="ui-container ui-schedule-loading-content">
        <div aria-hidden="true" className="ui-schedule-loading-heading">
          <span className="ui-skeleton-line ui-skeleton-line-title" />
          <span className="ui-skeleton-line ui-skeleton-line-pill" />
        </div>

        <ul aria-hidden="true" className="ui-schedule-event-list ui-schedule-loading-list">
          {Array.from({ length: 6 }, (_, index) => (
            <li key={index} className="ui-schedule-event-list-item">
              <span className="ui-card ui-schedule-loading-card" />
            </li>
          ))}
        </ul>

        <span className="ui-visually-hidden">Loading schedule.</span>
      </section>
    </div>
  );
}
