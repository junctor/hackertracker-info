import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

import {
  atkinsonFont,
  COUNTDOWN_UNITS,
  COUNTDOWN_UNIT_COLORS,
  EMPTY_COUNTDOWN_TIMER,
  formatCountdownLiveLabel,
  formatCountdownValue,
  hasKickoffPassed,
  museoFont,
  TimerUnitKey,
  useHomeModel,
  type CountdownTimer,
} from "@/features/home/homeModel";
import { ConferenceManifest } from "@/lib/conferences";
import { getCountdown } from "@/lib/timer";

type CountdownSize = "large" | "tiny";

const COUNTDOWN_VARIANTS: Record<
  CountdownSize,
  {
    sectionClassName: string;
    gridClassName: string;
    valueClassName: string;
    labelClassName: string;
    settledValueColor: string;
    liveAnnouncements: boolean;
  }
> = {
  large: {
    sectionClassName: "mt-4 w-full max-w-4xl px-2 sm:mt-8 md:mt-10",
    gridClassName: "grid grid-cols-2 gap-x-4 gap-y-5 text-center sm:grid-cols-4 sm:gap-x-6",
    valueClassName: "block text-3xl font-bold tabular-nums sm:text-4xl md:text-5xl lg:text-7xl",
    labelClassName:
      "text-[11px] tracking-[0.14em] text-slate-200 uppercase sm:text-xs md:text-sm lg:text-base",
    settledValueColor: "#fff",
    liveAnnouncements: true,
  },
  tiny: {
    sectionClassName: "mt-2 w-full",
    gridClassName: "grid grid-cols-4 gap-x-2 text-center",
    valueClassName: "block text-xs font-semibold tabular-nums text-slate-200 sm:text-sm",
    labelClassName: "text-[9px] tracking-[0.1em] text-slate-400 uppercase",
    settledValueColor: "#e2e8f0",
    liveAnnouncements: false,
  },
};

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

function flip(el: HTMLElement | null, color: string, settledColor: string) {
  if (!el) return;
  gsap.fromTo(
    el,
    { y: 10, opacity: 0, color },
    {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => {
        gsap.to(el, { color: settledColor, duration: 0.2, ease: "power2.out" });
      },
    },
  );
}

function useFlipAnimation(
  ref: RefObject<HTMLElement | null>,
  value: number,
  color: string,
  settledColor: string,
  prefersReducedMotion: boolean,
) {
  useGSAP(() => {
    if (prefersReducedMotion) return;
    flip(ref.current, color, settledColor);
  }, [color, prefersReducedMotion, settledColor, value]);
}

type Props = {
  conference: ConferenceManifest;
  size?: CountdownSize;
};

export default function Countdown({ conference, size = "large" }: Props) {
  const home = useHomeModel(conference);
  const [expired, setExpired] = useState(false);
  const [timer, setTimer] = useState<CountdownTimer>(EMPTY_COUNTDOWN_TIMER);
  const variant = COUNTDOWN_VARIANTS[size];

  const daysRef = useRef<HTMLSpanElement | null>(null);
  const hoursRef = useRef<HTMLSpanElement | null>(null);
  const minutesRef = useRef<HTMLSpanElement | null>(null);
  const secondsRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      const nowMs = Date.now();
      if (hasKickoffPassed(home.kickoffDateMs, nowMs)) {
        setExpired(true);
        setTimer(EMPTY_COUNTDOWN_TIMER);
        return;
      }

      setExpired(false);
      setTimer(getCountdown(home.kickoffDateMs));
      timeoutId = setTimeout(tick, 1000 - (nowMs % 1000));
    };

    tick();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [home.kickoffDateMs]);

  const valueRefs: Record<TimerUnitKey, RefObject<HTMLSpanElement | null>> = useMemo(
    () => ({
      days: daysRef,
      hours: hoursRef,
      minutes: minutesRef,
      seconds: secondsRef,
    }),
    [],
  );

  useFlipAnimation(
    daysRef,
    timer.days,
    COUNTDOWN_UNIT_COLORS.days,
    variant.settledValueColor,
    prefersReducedMotion,
  );
  useFlipAnimation(
    hoursRef,
    timer.hours,
    COUNTDOWN_UNIT_COLORS.hours,
    variant.settledValueColor,
    prefersReducedMotion,
  );
  useFlipAnimation(
    minutesRef,
    timer.minutes,
    COUNTDOWN_UNIT_COLORS.minutes,
    variant.settledValueColor,
    prefersReducedMotion,
  );
  useFlipAnimation(
    secondsRef,
    timer.seconds,
    COUNTDOWN_UNIT_COLORS.seconds,
    variant.settledValueColor,
    prefersReducedMotion,
  );

  const liveLabel = useMemo(() => formatCountdownLiveLabel(timer), [timer]);

  if (expired) return null;

  return (
    <section aria-label="Countdown to conference kickoff" className={variant.sectionClassName}>
      {variant.liveAnnouncements && (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {liveLabel}
        </p>
      )}
      <div
        role="timer"
        aria-label={`${conference.name}: ${liveLabel}`}
        aria-live="off"
        className={variant.gridClassName}
      >
        {COUNTDOWN_UNITS.map((unit) => (
          <div key={unit.key} className="min-w-0">
            <span
              ref={valueRefs[unit.key]}
              className={`${variant.valueClassName} ${atkinsonFont.className}`}
            >
              {formatCountdownValue(timer[unit.key])}
            </span>
            <span className={`${variant.labelClassName} ${museoFont.className}`}>{unit.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
