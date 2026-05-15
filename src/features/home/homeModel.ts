import { useMemo } from "react";

import type { ConferenceManifest } from "@/lib/conferences";

export type TimerUnitKey = "days" | "hours" | "minutes" | "seconds";

export type CountdownTimer = Record<TimerUnitKey, number>;

export const EMPTY_COUNTDOWN_TIMER: CountdownTimer = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export const COUNTDOWN_UNITS: ReadonlyArray<{
  key: TimerUnitKey;
  label: string;
}> = [
  { key: "days", label: "days" },
  { key: "hours", label: "hours" },
  { key: "minutes", label: "minutes" },
  { key: "seconds", label: "seconds" },
];

export const COUNTDOWN_UNIT_COLORS: Record<TimerUnitKey, string> = {
  days: "var(--dc34-accent-critical)",
  hours: "var(--dc34-accent-warning)",
  minutes: "var(--dc34-bg-primary)",
  seconds: "var(--dc34-bg-secondary)",
};

export const HOME_SECTION_CLASS_NAME = "ui-home-section";
export const HOME_HERO_STACK_CLASS_NAME = "ui-home-hero-stack";
export const HOME_HERO_LOGO_WRAP_CLASS_NAME = "ui-home-hero-logo";
export const HOME_ACTION_LINK_CLASS_NAME =
  "ui-btn-base ui-btn-primary ui-focus-ring ui-home-action-link";
export const HOME_MENU_TILE_CLASS_NAME =
  "ui-card ui-card-interactive ui-focus-ring ui-home-menu-tile";

export const atkinsonFont = {
  className: "ui-typeface-atkinson",
  variable: "--typeface-atkinson",
} as const;

export const museoFont = {
  className: "ui-typeface-museo",
  variable: "--typeface-museo",
} as const;

export function parseKickoffDateMs(kickoff: string): number {
  const kickoffDateMs = Date.parse(kickoff);
  if (Number.isNaN(kickoffDateMs)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Invalid conference kickoff date: ${kickoff}`);
    }
    return 0;
  }
  return kickoffDateMs;
}

export function useHomeModel(conference: ConferenceManifest) {
  return useMemo(() => {
    const kickoffDateMs = parseKickoffDateMs(conference.kickoff);
    const menuHref = `/${conference.slug}/menu`;

    return {
      menuHref,
      logoSrc: `/images/${conference.logoFile}`,
      logoAlt: `${conference.name} logo`,
      kickoffDateMs,
    };
  }, [conference.kickoff, conference.logoFile, conference.name, conference.slug]);
}

export function hasKickoffPassed(kickoffDateMs: number, nowMs = Date.now()) {
  return nowMs >= kickoffDateMs;
}

export function formatCountdownValue(value: number) {
  return value.toString().padStart(2, "0");
}

export function formatCountdownLiveLabel(timer: CountdownTimer) {
  if (timer.days === 0 && timer.hours === 0 && timer.minutes === 0 && timer.seconds === 0) {
    return "Starting now";
  }

  return `${timer.days} days, ${timer.hours} hours, ${timer.minutes} minutes, ${timer.seconds} seconds remaining`;
}
