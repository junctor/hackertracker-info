import { ArrowTopRightOnSquareIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import Markdown from "@/components/markdown/Markdown";
import { ConferenceManifest } from "@/lib/conferences";
import { OrganizationEntity } from "@/lib/types/ht-types";

type Props = {
  org: OrganizationEntity;
  conference: ConferenceManifest;
};

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function OrganizationDetails({ org, conference }: Props) {
  const initials = useMemo(
    () =>
      org.name
        .split(" ")
        .map((word) => word[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [org.name],
  );

  const description = org.description?.trim();
  const hasLinks = org.links.length > 0;

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-800 sm:h-24 sm:w-24">
            {org.logoUrl ? (
              <Image
                src={org.logoUrl}
                alt={`${org.name} logo`}
                fill
                className="object-contain p-2"
                priority
                sizes="(min-width: 640px) 6rem, 5rem"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center bg-slate-800 font-mono text-xl font-semibold tracking-wide text-white"
                role="img"
                aria-label={`${org.name} logo`}
              >
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{org.name}</h1>

            {org.tagIdAsOrganizer && (
              <div className="mt-4">
                <Link
                  href={`/${conference.slug}/tag?id=${org.tagIdAsOrganizer}`}
                  className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-100 transition hover:bg-indigo-500/15 focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none"
                >
                  <CalendarIcon className="h-4 w-4 text-indigo-300" aria-hidden />
                  <span>View Schedule</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mt-8 space-y-6">
        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
          <h2 className="text-sm font-semibold tracking-[0.14em] text-slate-200 uppercase">
            About
          </h2>

          <div className="prose prose-invert mt-4 max-w-none text-slate-300">
            {description ? (
              <Markdown content={description} />
            ) : (
              <p className="text-slate-400">No description available.</p>
            )}
          </div>
        </section>

        {hasLinks && (
          <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
            <h2 className="text-sm font-semibold tracking-[0.14em] text-slate-200 uppercase">
              Links
            </h2>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {org.links.map((link) => {
                const hostname = getHostname(link.url);

                return (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full items-center justify-between rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 transition hover:border-white/20 hover:bg-slate-800/60 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-slate-100">
                          {link.label}
                        </div>
                        <div className="truncate text-xs text-slate-400">{hostname}</div>
                      </div>

                      <ArrowTopRightOnSquareIcon
                        className="ml-3 h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-slate-300"
                        aria-hidden
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
