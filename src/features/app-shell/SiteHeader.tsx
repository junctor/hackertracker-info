"use client";

import React from "react";
import Link from "next/link";
import {
  CodeBracketSquareIcon,
  DevicePhoneMobileIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GlobalSearch from "./GlobalSearch";
import localFont from "next/font/local";
import { getSiteMenu } from "@/lib/menu";
import { ConferenceManifest } from "@/lib/conferences";

const museoFont = localFont({
  src: "../../../public/fonts/Museo700-Regular.woff2",
  display: "swap",
  variable: "--font-museo",
});

export default function SiteHeader({ conference }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-black/90 text-white px-5 py-3 border-b border-gray-800 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + Primary Nav */}
        <div className="flex items-center space-x-6">
          <Link href="/">
            <h1
              className={`${museoFont.className} text-2xl md:text-3xl font-bold logo`}
            >
              <span className="block md:hidden">{conference.code}</span>
              <span className="hidden md:block">{conference.name}</span>
            </h1>
          </Link>

          {/* Primary Nav */}
          <nav aria-label="Primary">
            <details className="relative">
              <summary className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm text-gray-200 hover:text-white">
                <RocketLaunchIcon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:block">Explore</span>
              </summary>
              <div className="absolute left-0 top-full mt-2 w-64 rounded-lg border border-gray-800 bg-gray-950 p-2 shadow-lg">
                <ul className="grid gap-2">
                  {getSiteMenu(conference).map(
                    ({ title, href, description, icon: Icon }) => (
                      <li key={title}>
                        <Link
                          href={href}
                          className="flex flex-col gap-1 rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-gray-900"
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="w-5 h-5 shrink-0" />
                            <span className="font-medium">{title}</span>
                          </span>
                          <span className="text-xs text-gray-400 hidden sm:block">
                            {description}
                          </span>
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </details>
          </nav>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-2">
          <Link href={`/${conference.slug}/apps`}>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-300 transition hover:text-white cursor-pointer"
              aria-label="Mobile Apps"
            >
              <DevicePhoneMobileIcon className="h-5 w-5" />
            </button>
          </Link>
          <a
            href="https://github.com/junctor/hackertracker-info"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-300 transition hover:text-white cursor-pointer"
              aria-label="View on GitHub"
            >
              <CodeBracketSquareIcon className="h-5 w-5" />
            </button>
          </a>
          {/* <GlobalSearch /> */}
        </div>
      </div>
      <hr className="absolute bottom-0 left-0 right-0 border-gray-800" />
    </header>
  );
}

type Props = {
  conference: ConferenceManifest;
};
