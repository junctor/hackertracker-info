import { ArrowTopRightOnSquareIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useId, useMemo, useState } from "react";

import Markdown from "@/components/markdown/Markdown";
import { ConferenceManifest } from "@/lib/conferences";
import { OrganizationEntity } from "@/lib/types/ht-types";

type Props = {
  org: OrganizationEntity;
  conference: ConferenceManifest;
};

type TabKey = "about" | "links";

export default function OrganizationDetails({ org, conference }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("about");

  const initials = useMemo(
    () =>
      org.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [org.name],
  );

  const description = org.description?.trim();
  const hasLinks = org.links.length > 0;

  // Ensure we never land on a tab that doesn't exist.
  const effectiveTab: TabKey = hasLinks ? activeTab : "about";

  const baseId = useId();
  const tablistId = `${baseId}-org-tabs`;
  const aboutTabId = `${baseId}-tab-about`;
  const linksTabId = `${baseId}-tab-links`;
  const aboutPanelId = `${baseId}-panel-about`;
  const linksPanelId = `${baseId}-panel-links`;

  const tabClass = (selected: boolean) =>
    [
      "px-3 py-2 text-sm font-medium transition",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70",
      "focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
      selected ? "border-b-2 border-indigo-400 text-white" : "text-gray-400 hover:text-white",
    ].join(" ");

  const selectTab = (key: TabKey) => () => setActiveTab(key);

  const onTabKeyDown = (current: TabKey) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Minimal, native tab keyboard behavior: Left/Right to switch tabs.
    if (!hasLinks) return;

    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();

    const next: TabKey =
      current === "about"
        ? e.key === "ArrowRight"
          ? "links"
          : "links"
        : e.key === "ArrowRight"
          ? "about"
          : "about";

    setActiveTab(next);

    // Move focus to the newly-selected tab button.
    const nextId = next === "about" ? aboutTabId : linksTabId;
    const el = document.getElementById(nextId) as HTMLButtonElement | null;
    el?.focus();
  };

  return (
    <article className="mx-auto max-w-4xl space-y-8 px-4 py-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-6 rounded-lg bg-gray-800 p-6 transition-shadow hover:shadow-lg md:flex-row">
        {/* Logo container */}
        <div className="relative h-32 w-full max-w-xs shrink-0 overflow-hidden rounded-lg sm:h-40 md:h-48">
          {org.logoUrl ? (
            <Image
              src={org.logoUrl}
              alt={`${org.name} logo`}
              fill
              className="object-contain"
              priority
              sizes="(min-width: 768px) 12rem, 100vw"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center bg-gray-700 text-3xl text-white"
              role="img"
              aria-label={`${org.name} logo`}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Organization details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">{org.name}</h1>
          {org.tagIdAsOrganizer && (
            <Link
              href={`/${conference.slug}/tag?id=${org.tagIdAsOrganizer}`}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-100 transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:outline-none"
            >
              <CalendarIcon className="h-5 w-5 text-indigo-400" aria-hidden />
              <span>See {org.name} Events</span>
            </Link>
          )}
        </div>
      </section>

      {/* Tabs (native buttons + ARIA) */}
      <div>
        <div
          id={tablistId}
          role="tablist"
          aria-label="Organization details"
          className="flex gap-2 border-b border-gray-700"
        >
          <button
            id={aboutTabId}
            type="button"
            role="tab"
            aria-selected={effectiveTab === "about"}
            aria-controls={aboutPanelId}
            tabIndex={effectiveTab === "about" ? 0 : -1}
            className={tabClass(effectiveTab === "about")}
            onClick={selectTab("about")}
            onKeyDown={onTabKeyDown("about")}
          >
            About
          </button>

          {hasLinks && (
            <button
              id={linksTabId}
              type="button"
              role="tab"
              aria-selected={effectiveTab === "links"}
              aria-controls={linksPanelId}
              tabIndex={effectiveTab === "links" ? 0 : -1}
              className={tabClass(effectiveTab === "links")}
              onClick={selectTab("links")}
              onKeyDown={onTabKeyDown("links")}
            >
              Links
            </button>
          )}
        </div>

        <div className="py-4">
          <section
            id={aboutPanelId}
            role="tabpanel"
            aria-labelledby={aboutTabId}
            hidden={effectiveTab !== "about"}
            className={effectiveTab === "about" ? "block" : "hidden"}
          >
            <div className="prose prose-invert max-w-none text-gray-300">
              {description ? (
                <Markdown content={description} />
              ) : (
                <p className="text-gray-400">No description available.</p>
              )}
            </div>
          </section>

          {hasLinks && (
            <section
              id={linksPanelId}
              role="tabpanel"
              aria-labelledby={linksTabId}
              hidden={effectiveTab !== "links"}
              className={effectiveTab === "links" ? "block" : "hidden"}
            >
              <ul className="space-y-3">
                {org.links.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-200 transition hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:outline-none"
                    >
                      <span>{l.label}</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
