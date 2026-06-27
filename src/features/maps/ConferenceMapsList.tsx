import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";

import type { ConferenceEntity, ConferenceMapEntity } from "@/lib/types/ht-types";

import Image from "@/components/Image";
import PageHeader from "@/components/ui/PageHeader";

type Props = {
  conference: ConferenceEntity;
};

function getMapName(map: ConferenceMapEntity) {
  return map.name_text?.trim() || map.name.trim() || "Unnamed map";
}

function getMapFilename(map: ConferenceMapEntity) {
  return map.filename?.trim() || map.file?.trim() || null;
}

function compareMaps(a: ConferenceMapEntity, b: ConferenceMapEntity) {
  const sortOrderA = a.sort_order ?? Number.POSITIVE_INFINITY;
  const sortOrderB = b.sort_order ?? Number.POSITIVE_INFINITY;

  if (sortOrderA !== sortOrderB) return sortOrderA - sortOrderB;

  return getMapName(a).localeCompare(getMapName(b), undefined, {
    sensitivity: "base",
    numeric: true,
  });
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

function formatDateRange(conference: ConferenceEntity) {
  if (!conference.start_date && !conference.end_date) return null;
  if (!conference.start_date) return formatDate(conference.end_date!);
  if (!conference.end_date || conference.start_date === conference.end_date) {
    return formatDate(conference.start_date);
  }

  return `${formatDate(conference.start_date)} - ${formatDate(conference.end_date)}`;
}

export default function ConferenceMapsList({ conference }: Props) {
  const [brokenPreviewIds, setBrokenPreviewIds] = useState<Record<number, true>>({});
  const maps = useMemo(
    () => (conference.maps ?? []).filter(Boolean).toSorted(compareMaps),
    [conference.maps],
  );
  const dateRange = formatDateRange(conference);
  const headerMeta = [dateRange, conference.timezone].filter(Boolean).join(" · ");

  return (
    <section className="ui-container ui-section">
      <PageHeader
        kicker={headerMeta || undefined}
        title={`${conference.name} Maps`}
        description={`Venue maps for ${conference.name}.`}
        resultLabel={maps.length > 0 ? `${maps.length} maps` : undefined}
      />

      {maps.length === 0 ? (
        <div role="status" className="ui-empty-state ui-page-empty-offset">
          <p>No maps are available for this conference yet.</p>
        </div>
      ) : (
        <ul className="ui-map-list">
          {maps.map((map) => {
            const name = getMapName(map);
            const filename = getMapFilename(map);

            return (
              <li key={map.id}>
                <article className="ui-card ui-map-card">
                  <div className="ui-map-card-copy">
                    <div className="ui-map-card-heading">
                      <h2 className="ui-card-title">{name}</h2>
                      {filename ? <p className="ui-card-meta">{filename}</p> : null}
                    </div>

                    {map.description?.trim() ? (
                      <p className="ui-map-description">{map.description}</p>
                    ) : null}
                  </div>

                  {map.svg_url && !brokenPreviewIds[map.id] ? (
                    <div className="ui-map-preview-frame">
                      <Image
                        src={map.svg_url}
                        alt={`Preview of ${name}`}
                        className="ui-map-preview-image"
                        onError={() =>
                          setBrokenPreviewIds((current) =>
                            current[map.id] ? current : { ...current, [map.id]: true },
                          )
                        }
                      />
                    </div>
                  ) : null}

                  {map.url ? (
                    <a
                      href={map.url}
                      target="_blank"
                      rel="noreferrer"
                      className="ui-btn-base ui-btn-secondary ui-focus-ring ui-map-pdf-link"
                    >
                      Open PDF
                      <ArrowTopRightOnSquareIcon className="ui-icon-xs" aria-hidden="true" />
                    </a>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
