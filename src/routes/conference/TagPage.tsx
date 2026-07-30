import { Navigate, useLocation } from "react-router";

import ConferenceLoadingScreen from "@/features/app-shell/ConferenceLoadingScreen";
import ErrorScreen from "@/features/app-shell/ErrorScreen";
import { TAG_GROUP_PARAM } from "@/features/schedule/scheduleFilters";
import { ConferenceManifest } from "@/lib/conferences";
import { conferenceCollectionPath } from "@/lib/routes";
import { PageId } from "@/lib/types/page-meta";
import useNumericRouteParam from "@/lib/utils/useNumericRouteParam";

type TagPageProps = {
  conf: ConferenceManifest;
  activePageId: PageId;
};

function buildFilteredSchedulePath(confSlug: string, tagId: number, search: string, hash: string) {
  const params = new URLSearchParams(search);
  params.delete(TAG_GROUP_PARAM);
  params.append(TAG_GROUP_PARAM, String(tagId));

  const query = params.toString();
  return `/${confSlug}/schedule/${query ? `?${query}` : ""}${hash}`;
}

export default function TagPage({ conf, activePageId }: TagPageProps) {
  const location = useLocation();
  const {
    value: tagId,
    isReady,
    isMissing: isIdMissing,
    isInvalid: isIdInvalid,
    isRedirectingLegacyUrl,
  } = useNumericRouteParam("id", {
    legacyCanonicalBasePath: conferenceCollectionPath(conf, "tags"),
  });
  const filtersHref = `/${conf.slug}/filters/`;
  const scheduleHref = conf.schedulePath ?? `/${conf.slug}/schedule/`;

  if (!isReady || isRedirectingLegacyUrl) {
    return (
      <ConferenceLoadingScreen conference={conf} activePageId={activePageId} label="filters" />
    );
  }

  if (isIdMissing) {
    return <Navigate to={filtersHref} replace />;
  }

  if (isIdInvalid || tagId === null || tagId <= 0) {
    return (
      <ErrorScreen
        title="Tag not found"
        copy="Use a numeric tag ID, or browse all filters."
        kicker="Not found"
        primaryActionHref={filtersHref}
        primaryActionLabel="Browse Filters"
        secondaryActionHref={scheduleHref}
        secondaryActionLabel="Schedule"
      />
    );
  }

  return (
    <Navigate
      to={buildFilteredSchedulePath(conf.slug, tagId, location.search, location.hash)}
      replace
    />
  );
}
