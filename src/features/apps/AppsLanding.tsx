import {
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { type ComponentType, type SVGProps } from "react";

import { type ConferenceManifest } from "@/lib/conferences";

type Props = {
  conference?: ConferenceManifest;
};

type Platform = {
  name: string;
  href: string;
  destination: string;
  action: string;
  external: boolean;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const APP_PLATFORMS: ReadonlyArray<Omit<Platform, "href">> = [
  {
    name: "iOS",
    destination: "App Store",
    action: "Download on the App Store",
    external: true,
    Icon: DevicePhoneMobileIcon,
  },
  {
    name: "Android",
    destination: "Google Play",
    action: "Get it on Google Play",
    external: true,
    Icon: DevicePhoneMobileIcon,
  },
];

function getPlatforms(conference?: ConferenceManifest): ReadonlyArray<Platform> {
  return [
    {
      ...APP_PLATFORMS[0],
      href: "https://apps.apple.com/us/app/hackertracker/id1021141595?mt=8",
    },
    {
      ...APP_PLATFORMS[1],
      href: "https://play.google.com/store/apps/details?id=com.shortstack.hackertracker",
    },
    {
      name: "Web",
      href: conference ? `/${conference.slug}` : "/",
      destination: "Web schedule",
      action: "View the schedule",
      external: false,
      Icon: ComputerDesktopIcon,
    },
  ];
}

export default function AppsLanding({ conference }: Props) {
  const platforms = getPlatforms(conference);
  const kicker = conference
    ? `Official ${conference.name} schedule companion`
    : "Official DEF CON schedule companion";
  const subtitle = "Choose iOS, Android, or Web.";

  return (
    <section
      className="ui-container ui-apps-poster ui-page-content"
      aria-labelledby="apps-landing-title"
    >
      <div className="ui-apps-panel relative overflow-hidden rounded-4xl px-5 py-10 text-center backdrop-blur-xl sm:px-8 sm:py-14 lg:px-12 lg:py-18">
        <div aria-hidden="true" className="ui-apps-ambient pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="ui-apps-grid pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="ui-apps-panel-rule pointer-events-none absolute inset-x-0 top-0 h-px"
        />
        <div
          aria-hidden="true"
          className="ui-apps-orb pointer-events-none absolute top-0 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl">
          <p className="ui-kicker ui-apps-kicker mb-3 sm:mb-4">{kicker}</p>
          <p className="ui-apps-choice mx-auto mb-5 max-w-3xl text-balance">Choose your</p>

          <h1
            id="apps-landing-title"
            className="ui-apps-title group font-museo relative mx-auto inline-block cursor-default text-5xl font-semibold text-balance sm:text-7xl md:text-8xl lg:leading-none"
          >
            <span className="relative z-10">Hacker Tracker</span>
            <span
              aria-hidden="true"
              className="ui-title-glitch-layer ui-title-glitch-layer-start pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            >
              Hacker Tracker
            </span>
            <span
              aria-hidden="true"
              className="ui-title-glitch-layer ui-title-glitch-layer-end pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            >
              Hacker Tracker
            </span>
          </h1>

          <p className="ui-apps-subtitle mx-auto mt-5 max-w-2xl text-base leading-7 text-pretty sm:mt-6 sm:text-lg sm:leading-8 md:text-xl">
            {subtitle}
          </p>

          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
            {platforms.map((platform) => {
              const ActionIcon = platform.external ? ArrowTopRightOnSquareIcon : ArrowRightIcon;
              const PlatformIcon = platform.Icon;

              return (
                <a
                  key={platform.name}
                  href={platform.href}
                  target={platform.external ? "_blank" : undefined}
                  rel={platform.external ? "noopener noreferrer" : undefined}
                  className={[
                    "ui-focus-ring ui-app-card group relative isolate flex min-h-44 flex-col overflow-hidden rounded-3xl px-5 py-5 text-left transition duration-200 ease-out sm:min-h-48 sm:px-6 sm:py-6",
                    "hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className="ui-app-card-glow pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl transition-opacity duration-200 group-hover:opacity-100"
                  />
                  <span
                    aria-hidden="true"
                    className="ui-app-card-rule pointer-events-none absolute inset-x-4 top-0 h-px"
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="ui-app-card-eyebrow text-xs font-semibold uppercase">
                          {platform.destination}
                        </div>
                        <div className="mt-3 text-3xl leading-none font-semibold sm:text-4xl">
                          {platform.name}
                        </div>
                      </div>
                      <span className="ui-app-card-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                        <PlatformIcon aria-hidden="true" className="h-6 w-6" />
                      </span>
                    </div>
                  </div>

                  <div className="ui-app-card-action relative z-10 mt-6 flex items-center justify-between gap-4 text-sm leading-snug font-semibold sm:mt-7">
                    <span>{platform.action}</span>
                    <ActionIcon
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
