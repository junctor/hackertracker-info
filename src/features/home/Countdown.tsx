import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { getCountdown } from "@/lib/timer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ConferenceManifest } from "@/lib/conferences";
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

function flip(el: HTMLElement | null, color: string) {
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
        gsap.to(el, { color: "#fff", duration: 0.2, ease: "power2.out" });
      },
    },
  );
}

function useFlipAnimation(
  ref: RefObject<HTMLElement | null>,
  value: number,
  color: string,
  prefersReducedMotion: boolean,
) {
  useGSAP(() => {
    if (prefersReducedMotion) return;
    flip(ref.current, color);
  }, [color, prefersReducedMotion, value]);
}

export default function Countdown({
  conference,
}: {
  conference: ConferenceManifest;
}) {
  const home = useHomeModel(conference);
  const [expired, setExpired] = useState(() =>
    hasKickoffPassed(home.kickoffDateMs),
  );
  const [timer, setTimer] = useState<CountdownTimer>(() =>
    hasKickoffPassed(home.kickoffDateMs)
      ? EMPTY_COUNTDOWN_TIMER
      : getCountdown(home.kickoffDateMs),
  );

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

      setTimer(getCountdown(home.kickoffDateMs));
      timeoutId = setTimeout(tick, 1000 - (nowMs % 1000));
    };

    timeoutId = setTimeout(tick, 0);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [home.kickoffDateMs]);

  const valueRefs: Record<
    TimerUnitKey,
    RefObject<HTMLSpanElement | null>
  > = useMemo(
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
    prefersReducedMotion,
  );
  useFlipAnimation(
    hoursRef,
    timer.hours,
    COUNTDOWN_UNIT_COLORS.hours,
    prefersReducedMotion,
  );
  useFlipAnimation(
    minutesRef,
    timer.minutes,
    COUNTDOWN_UNIT_COLORS.minutes,
    prefersReducedMotion,
  );
  useFlipAnimation(
    secondsRef,
    timer.seconds,
    COUNTDOWN_UNIT_COLORS.seconds,
    prefersReducedMotion,
  );

  const liveLabel = useMemo(() => formatCountdownLiveLabel(timer), [timer]);

  if (expired) return null;

  return (
    <section
      aria-label="Countdown to conference kickoff"
      className="mt-4 w-full max-w-4xl px-2 sm:mt-8 md:mt-10"
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveLabel}
      </p>
      <div
        role="timer"
        aria-live="off"
        className="grid grid-cols-2 gap-x-4 gap-y-5 text-center sm:grid-cols-4 sm:gap-x-6"
      >
        {COUNTDOWN_UNITS.map((unit) => (
          <div key={unit.key} className="min-w-0">
            <span
              ref={valueRefs[unit.key]}
              className={`block text-3xl font-bold tabular-nums sm:text-4xl md:text-5xl lg:text-7xl ${atkinsonFont.className}`}
            >
              {formatCountdownValue(timer[unit.key])}
            </span>
            <span
              className={`text-[11px] uppercase tracking-[0.14em] text-gray-200 sm:text-xs md:text-sm lg:text-base ${museoFont.className}`}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
