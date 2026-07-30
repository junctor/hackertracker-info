import type { ConferenceManifest } from "@/lib/conferences";
import type { PageId } from "@/lib/types/page-meta";

import ConferenceLayout from "./ConferenceLayout";
import LoadingStatus from "./LoadingStatus";

type Props = {
  conference: ConferenceManifest;
  activePageId: PageId;
  variant?: "default" | "schedule";
  label?: string;
};

export default function ConferenceLoadingScreen({
  conference,
  activePageId,
  variant = "default",
  label,
}: Props) {
  const loadingLabel = label ?? getConferenceLoadingLabel(activePageId);

  return (
    <ConferenceLayout
      conference={conference}
      activePageId={activePageId}
      className={variant === "schedule" ? "ui-schedule-page-shell" : undefined}
    >
      {variant === "schedule" ? (
        <ScheduleLoadingContent label={loadingLabel} />
      ) : (
        <DefaultLoadingContent label={loadingLabel} />
      )}
    </ConferenceLayout>
  );
}

export function getConferenceLoadingLabel(activePageId: PageId) {
  switch (activePageId) {
    case "schedule":
      return "schedule";
    case "people":
      return "people";
    case "organization":
    case "communities":
    case "departments":
    case "exhibitors":
    case "vendors":
    case "villages":
      return "organizations";
    case "document":
    case "readme":
      return "document";
    case "maps":
      return "maps";
    case "search":
      return "search";
    case "announcements":
      return "announcements";
    case "bookmarks":
      return "bookmarks";
    case "tags":
    case "tag":
    case "filters":
      return "filters";
    case "contests":
      return "contests";
    case "locations":
      return "locations";
    case "merch":
      return "merch";
    case "menu":
      return "conference menu";
    case "apps":
      return "apps";
    case "content":
    default:
      return "content";
  }
}

type LoadingContentProps = {
  label: string;
};

function DefaultLoadingContent({ label }: LoadingContentProps) {
  return (
    <section
      aria-label="Loading conference content"
      aria-busy="true"
      className="ui-container ui-page-content ui-route-loading"
    >
      <LoadingStatus label={label} />

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

function ScheduleLoadingContent({ label }: LoadingContentProps) {
  return (
    <div
      aria-label="Loading schedule"
      aria-busy="true"
      className="ui-schedule-shell ui-schedule-loading-shell"
    >
      <div className="ui-container ui-schedule-loading-status">
        <LoadingStatus label={label} />
      </div>

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

        <ul aria-hidden="true" className="ui-schedule-session-list ui-schedule-loading-list">
          {Array.from({ length: 6 }, (_, index) => (
            <li key={index} className="ui-schedule-session-list-item">
              <span className="ui-card ui-schedule-loading-card" />
            </li>
          ))}
        </ul>

        <span className="ui-visually-hidden">Loading schedule.</span>
      </section>
    </div>
  );
}
