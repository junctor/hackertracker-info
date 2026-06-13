import type { ReactElement } from "react";

import type { ConferenceManifest } from "@/lib/conferences";

export const SITE_ORIGIN = "https://info.defcon.org";
export const SITE_NAME = "info.defcon.org";
export const SITE_DESCRIPTION =
  "Official DEF CON schedules and conference information for current and upcoming events.";

type JsonFeed = {
  href: string;
  title: string;
};

type AiMetadataProps = {
  title: string;
  description: string;
  path: string;
  jsonFeeds?: ReadonlyArray<JsonFeed>;
  structuredData?: ReadonlyArray<string>;
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function conferencePath(conf: ConferenceManifest, route?: string) {
  const suffix = route?.trim().replace(/^\/+/, "");
  return suffix ? `/${conf.slug}/${suffix}` : `/${conf.slug}`;
}

export function conferenceDataFeeds(conf: ConferenceManifest): ReadonlyArray<JsonFeed> {
  return [
    { title: `${conf.name} manifest`, href: `${conf.dataRoot}/manifest.json` },
    { title: `${conf.name} schedule events`, href: `${conf.dataRoot}/entities/events.json` },
    { title: `${conf.name} speakers and people`, href: `${conf.dataRoot}/entities/people.json` },
    { title: `${conf.name} search index`, href: `${conf.dataRoot}/views/searchData.json` },
  ];
}

export function collectionStructuredDataPath(
  conf: ConferenceManifest,
  collection: "schedule" | "search",
) {
  return `/structured-data/${conf.slug}-${collection}.collection.json`;
}

export function aiMetadata({
  title,
  description,
  path,
  jsonFeeds = [],
  structuredData = [],
}: AiMetadataProps): ReactElement[] {
  const canonical = absoluteUrl(path);
  const allStructuredData = ["/structured-data/website.json", ...structuredData];

  return [
    <meta key="description" name="description" content={description} />,
    <meta key="robots" name="robots" content="index,follow" />,
    <link key="canonical" rel="canonical" href={canonical} />,
    <link key="sitemap" rel="sitemap" type="application/xml" href="/sitemap.xml" />,
    <link key="llms" rel="alternate" type="text/plain" title="LLMs guide" href="/llms.txt" />,
    ...jsonFeeds.map((feed) => (
      <link
        key={feed.href}
        rel="alternate"
        type="application/json"
        title={feed.title}
        href={feed.href}
      />
    )),
    ...allStructuredData.map((href) => (
      <link key={`jsonld-${href}`} rel="alternate" type="application/ld+json" href={href} />
    )),
    <meta key="og-site-name" property="og:site_name" content={SITE_NAME} />,
    <meta key="og-title" property="og:title" content={title} />,
    <meta key="og-description" property="og:description" content={description} />,
    <meta key="og-type" property="og:type" content="website" />,
    <meta key="og-url" property="og:url" content={canonical} />,
    <meta
      key="og-image"
      property="og:image"
      content={absoluteUrl("/images/icons/skull-600x600.png")}
    />,
    <meta key="twitter-card" name="twitter:card" content="summary" />,
    <meta key="twitter-title" name="twitter:title" content={title} />,
    <meta key="twitter-description" name="twitter:description" content={description} />,
  ];
}
