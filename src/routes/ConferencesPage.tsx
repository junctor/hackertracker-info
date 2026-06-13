import { Link } from "react-router";

import Head from "@/components/Head";
import Image from "@/components/Image";
import { aiMetadata, conferenceDataFeeds, SITE_DESCRIPTION } from "@/lib/aiMetadata";
import { CONFERENCES, type ConferenceManifest } from "@/lib/conferences";

type ConferenceCardConfig = {
  conference: ConferenceManifest;
  startDateMs: number;
};

const ARCHIVED_CONFERENCES: ReadonlyArray<ConferenceCardConfig> = Object.values(CONFERENCES)
  .filter((conference) => !conference.showOnHome)
  .map((conference) => ({
    conference,
    startDateMs: Date.parse(conference.begin),
  }))
  .toSorted((a, b) => b.startDateMs - a.startDateMs);

export default function ConferencesPage() {
  return (
    <>
      <Head>
        <title>Past conferences | info.defcon.org</title>
        {aiMetadata({
          title: "Past conferences | info.defcon.org",
          description: SITE_DESCRIPTION,
          path: "/conferences",
          jsonFeeds: ARCHIVED_CONFERENCES.flatMap(({ conference }) =>
            conferenceDataFeeds(conference),
          ),
        })}
      </Head>

      <main id="main-content" className="ui-page-shell ui-conferences-shell">
        <div aria-hidden="true" className="ui-homepage-ambient" />
        <div aria-hidden="true" className="ui-homepage-grid" />
        <div aria-hidden="true" className="ui-homepage-top-light" />

        <div className="ui-container ui-conferences-content">
          <header className="ui-conferences-header">
            <Link to="/" className="ui-focus-ring ui-conferences-home-link">
              Back to home
            </Link>
            <p className="ui-kicker ui-conferences-kicker">Conference archive</p>
            <h1 className="ui-heading-1">Past conferences</h1>
            <p className="ui-page-description">
              Browse schedules and reference material from earlier DEF CON events.
            </p>
          </header>

          <section aria-label="Past conferences" className="ui-conferences-grid">
            {ARCHIVED_CONFERENCES.length > 0 ? (
              ARCHIVED_CONFERENCES.map(({ conference }) => (
                <ConferenceArchiveCard key={conference.slug} conference={conference} />
              ))
            ) : (
              <p className="ui-homepage-empty">No past conferences are currently available.</p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function ConferenceArchiveCard({ conference }: { conference: ConferenceManifest }) {
  return (
    <Link
      to={`/${conference.slug}`}
      aria-label={`View ${conference.name}`}
      className="ui-focus-ring ui-conference-archive-card"
    >
      <span className="ui-conference-archive-logo">
        <Image
          src={`/images/${conference.logoFile}`}
          alt={`${conference.name} logo`}
          fillContainer
          sizes="(min-width: 900px) 12rem, 7rem"
          className="ui-conference-archive-logo-image"
        />
      </span>

      <span className="ui-conference-archive-copy">
        <span className="ui-conference-archive-name">{conference.name}</span>
        <span className="ui-conference-archive-date">{conference.dateLabel}</span>
      </span>
    </Link>
  );
}
