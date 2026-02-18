import type { ConferenceManifest } from "@/lib/conferences";
import localFont from "next/font/local";
import { useMemo } from "react";

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
  days: "#E0004E",
  hours: "#F1B435",
  minutes: "#0D294A",
  seconds: "#105F66",
};

export const HOME_SECTION_CLASS_NAME =
  "mx-auto w-full max-w-6xl px-4 py-12 sm:py-14 md:py-16";
export const HOME_HERO_STACK_CLASS_NAME =
  "mx-auto flex max-w-3xl flex-col items-center justify-center text-center";
export const HOME_HERO_LOGO_WRAP_CLASS_NAME =
  "relative h-[124px] w-[min(520px,90vw)] sm:h-[134px] md:h-[146px] lg:h-[158px]";
export const HOME_ACTION_LINK_CLASS_NAME =
  "mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
export const HOME_MENU_TILE_CLASS_NAME =
  "flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl bg-gray-800 px-4 py-5 text-center shadow-md transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/85 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900";

export const atkinsonFont = localFont({
  src: "../../../public/fonts/atkinson-hl.woff2",
  display: "swap",
  variable: "--font-atkinson",
});

export const museoFont = localFont({
  src: "../../../public/fonts/Museo700-Regular.woff2",
  display: "swap",
  variable: "--font-museo",
});

export function useHomeModel(conference: ConferenceManifest) {
  return useMemo(() => {
    const kickoffDateMs = Date.parse(conference.kickoff);
    const menuHref = `/${conference.slug}/menu`;

    return {
      menuHref,
      logoSrc: `/images/${conference.logoFile}`,
      logoAlt: `${conference.name} logo`,
      kickoffDateMs,
    };
  }, [
    conference.kickoff,
    conference.logoFile,
    conference.name,
    conference.slug,
  ]);
}

export function hasKickoffPassed(kickoffDateMs: number, nowMs = Date.now()) {
  return nowMs >= kickoffDateMs;
}

export function formatCountdownValue(value: number) {
  return value.toString().padStart(2, "0");
}

export function formatCountdownLiveLabel(timer: CountdownTimer) {
  return `${timer.days} days, ${timer.hours} hours, ${timer.minutes} minutes remaining`;
}
