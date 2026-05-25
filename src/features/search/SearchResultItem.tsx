import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import type { ConferenceManifest } from "@/lib/conferences";

import {
  getSearchResultHref,
  getSearchResultLabel,
  getSearchResultTone,
  type UniversalSearchResult,
} from "./searchData";

type Props = {
  conf: ConferenceManifest;
  result: UniversalSearchResult;
};

export default function SearchResultItem({ conf, result }: Props) {
  const tone = getSearchResultTone(result.type);
  const typeLabel = getSearchResultLabel(result.type);

  return (
    <article className={`ui-card ui-card-interactive ui-accent-card ui-tone-${tone}`}>
      <span aria-hidden="true" className="ui-accent-rail" />
      <span aria-hidden="true" className="ui-accent-rail-overlay" />

      <Link
        to={getSearchResultHref(conf.slug, result)}
        className="ui-focus-ring ui-search-result-link"
      >
        <div className="ui-item-main ui-item-copy">
          <span className={`ui-tag-chip ui-tag-chip-strong ui-tone-${tone}`}>{typeLabel}</span>

          <h2 className="ui-card-title ui-search-result-title ui-clamp-three">{result.text}</h2>
        </div>

        <ArrowRightIcon aria-hidden="true" className="ui-icon-sm ui-card-arrow" />
      </Link>
    </article>
  );
}
