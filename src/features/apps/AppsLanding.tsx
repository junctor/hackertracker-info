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
      <div className="ui-apps-panel">
        <div aria-hidden="true" className="ui-apps-ambient" />
        <div aria-hidden="true" className="ui-apps-grid" />
        <div aria-hidden="true" className="ui-apps-panel-rule" />
        <div aria-hidden="true" className="ui-apps-orb" />

        <div className="ui-apps-content">
          <p className="ui-kicker ui-apps-kicker">{kicker}</p>
          <p className="ui-apps-choice">Choose your</p>

          <h1 id="apps-landing-title" className="ui-apps-title">
            <span className="ui-apps-title-main">Hacker Tracker</span>
            <span aria-hidden="true" className="ui-title-glitch-layer ui-title-glitch-layer-start">
              Hacker Tracker
            </span>
            <span aria-hidden="true" className="ui-title-glitch-layer ui-title-glitch-layer-end">
              Hacker Tracker
            </span>
          </h1>

          <p className="ui-apps-subtitle">{subtitle}</p>

          <div className="ui-app-card-grid">
            {platforms.map((platform) => {
              const ActionIcon = platform.external ? ArrowTopRightOnSquareIcon : ArrowRightIcon;
              const PlatformIcon = platform.Icon;

              return (
                <a
                  key={platform.name}
                  href={platform.href}
                  target={platform.external ? "_blank" : undefined}
                  rel={platform.external ? "noopener noreferrer" : undefined}
                  className="ui-focus-ring ui-app-card"
                >
                  <span aria-hidden="true" className="ui-app-card-glow" />
                  <span aria-hidden="true" className="ui-app-card-rule" />

                  <div className="ui-app-card-content">
                    <div className="ui-app-card-header">
                      <div>
                        <div className="ui-app-card-eyebrow">{platform.destination}</div>
                        <div className="ui-app-card-name">{platform.name}</div>
                      </div>
                      <span className="ui-app-card-icon">
                        <PlatformIcon aria-hidden="true" className="ui-icon-md" />
                      </span>
                    </div>
                  </div>

                  <div className="ui-app-card-action">
                    <span>{platform.action}</span>
                    <ActionIcon aria-hidden="true" className="ui-app-card-action-icon" />
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
