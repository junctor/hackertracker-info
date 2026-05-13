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
    <article
      className={`ui-card ui-card-interactive group relative w-full min-w-0 overflow-hidden ui-tone-${tone}`}
    >
      <span aria-hidden="true" className="ui-accent-rail" />
      <span aria-hidden="true" className="ui-accent-rail-overlay" />

      <Link
        to={getSearchResultHref(conf.slug, result)}
        className="ui-focus-ring ui-rounded-inherit relative z-10 flex min-w-0 items-start gap-3 px-4 py-4 pl-5 focus-visible:outline-none sm:px-5 sm:py-5 sm:pl-6"
      >
        <div className="min-w-0 flex-1 space-y-2">
          <span className={`ui-tag-chip ui-tag-chip-strong ui-tone-${tone}`}>{typeLabel}</span>

          <h2 className="line-clamp-3 text-lg leading-7 font-semibold text-slate-100 transition-colors group-hover:text-white sm:text-xl">
            {result.text}
          </h2>
        </div>

        <ArrowRightIcon
          aria-hidden="true"
          className="mt-1 h-5 w-5 shrink-0 text-(--event-color) transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-200"
        />
      </Link>
    </article>
  );
}
