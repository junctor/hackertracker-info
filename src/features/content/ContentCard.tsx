import { useState } from "react";
import { Link } from "react-router";

import type { ConferenceManifest } from "@/lib/conferences";
import type { ContentCard as ContentCardView } from "@/lib/types/ht-types/views";

import Image from "@/components/Image";
import { getAccentStyle } from "@/lib/color";
import { contentPath } from "@/lib/routes";

import { getVisibleContentLogoUrl } from "./contentLogo";

type Props = {
  conference: ConferenceManifest;
  item: ContentCardView;
};

export default function ContentCard({ conference, item }: Props) {
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null);
  const visibleTags = item.tags.slice(0, 4);
  const hiddenTagCount = item.tags.length - visibleTags.length;
  const itemColor = item.tags[0]?.colorBackground;
  const accentStyle = getAccentStyle(itemColor);
  const visibleLogoUrl = getVisibleContentLogoUrl(item.logoUrl, failedLogoUrl);

  return (
    <article
      style={accentStyle}
      className="ui-card ui-card-interactive ui-accent-card ui-content-list-card"
    >
      <span aria-hidden="true" className="ui-accent-rail" />
      <span aria-hidden="true" className="ui-accent-rail-overlay" />
      <Link to={contentPath(conference, item.id)} className="ui-focus-ring ui-accent-card-link">
        <div className="ui-content-list-row">
          <div className="ui-item-main ui-item-copy">
            <h2 className="ui-card-title ui-accent-card-title-md ui-clamp-two">{item.title}</h2>

            {visibleTags.length > 0 ? (
              <ul className="ui-chip-list-tight ui-content-list-tags">
                {visibleTags.map((tag) => (
                  <li
                    key={tag.id}
                    className="ui-tag-chip ui-tag-chip-strong ui-content-list-tag"
                    style={{
                      backgroundColor: tag.colorBackground,
                      color: tag.colorForeground,
                    }}
                  >
                    {tag.label}
                  </li>
                ))}
                {hiddenTagCount > 0 ? (
                  <li className="ui-tag-chip ui-tone-muted ui-content-list-tag-more">
                    +{hiddenTagCount} more
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>

          {visibleLogoUrl ? (
            <Image
              src={visibleLogoUrl}
              alt=""
              className="ui-image-contain ui-content-card-logo"
              onError={() => setFailedLogoUrl(visibleLogoUrl)}
            />
          ) : null}
        </div>
      </Link>
    </article>
  );
}
