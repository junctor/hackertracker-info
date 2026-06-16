import Markdown from "@/components/markdown/Markdown";
import PageHeader from "@/components/ui/PageHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { newsAgo, newsTime } from "@/lib/dates";
import { AnnouncementsListView } from "@/lib/types/ht-types/views";

type Props = {
  announcements: AnnouncementsListView;
  conference: ConferenceManifest;
};

export default function AnnouncementsList({ announcements, conference }: Props) {
  if (!announcements.length) {
    return (
      <div className="ui-container ui-page-content">
        <PageHeader
          title="Announcements"
          description="Official conference updates in publish order."
        />
        <div className="ui-empty-state" role="status">
          <p>No announcements at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="ui-container ui-page-content">
      <PageHeader
        title="Announcements"
        description="Official conference updates in publish order."
        resultLabel={`${announcements.length} ${announcements.length === 1 ? "update" : "updates"}`}
      />

      <ul className="ui-announcement-list" role="list">
        {announcements.map((item, index) => {
          const date = new Date(item.updatedAtMs);
          return (
            <li key={item.id}>
              <details open={index === 0} className="ui-card ui-announcement-card">
                <summary className="ui-focus-ring ui-announcement-summary">
                  <div className="ui-announcement-summary-row">
                    <h2 className="ui-card-title ui-announcement-title">{item.name}</h2>
                    <time
                      dateTime={date.toISOString()}
                      title={date.toLocaleString()}
                      className="ui-card-meta"
                    >
                      {newsAgo(date)} · {newsTime(date, conference.timezone, { showTz: true })}
                    </time>
                  </div>
                </summary>
                {item.text && (
                  <div className="ui-announcement-body">
                    <Markdown content={item.text} />
                  </div>
                )}
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
