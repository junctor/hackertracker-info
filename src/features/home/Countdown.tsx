import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";

import {
  atkinsonFont,
  COUNTDOWN_UNIT_COLORS,
  COUNTDOWN_UNITS,
  EMPTY_COUNTDOWN_TIMER,
  formatCountdownLiveLabel,
  formatCountdownValue,
  hasKickoffPassed,
  museoFont,
  type CountdownTimer,
  type TimerUnitKey,
  useHomeModel,
} from "@/features/home/homeModel";
import { type ConferenceManifest } from "@/lib/conferences";
import { getCountdown } from "@/lib/timer";

gsap.registerPlugin(useGSAP);

type CountdownSize = "large" | "tiny";

const COUNTDOWN_VARIANTS: Record<
  CountdownSize,
  {
    sectionClassName: string;
    gridClassName: string;
    itemClassName: string;
    valueWrapClassName: string;
    valueClassName: string;
    labelClassName: string;
    separatorClassName: string;
    settledValueColor: string;
    liveAnnouncements: boolean;
    glowSize: string;
    glowOpacity: number;
  }
> = {
  large: {
    sectionClassName: "mt-4 w-full max-w-5xl px-2 sm:mt-8 md:mt-10",
    gridClassName:
      "grid grid-cols-2 gap-x-4 gap-y-6 text-center sm:grid-cols-4 sm:gap-x-6 lg:gap-x-8",
    itemClassName: "relative min-w-0 px-2 sm:px-3",
    valueWrapClassName:
      "relative mx-auto flex min-h-[3.5rem] items-center justify-center sm:min-h-[4.5rem] md:min-h-[5.25rem] lg:min-h-[6.5rem]",
    valueClassName:
      "relative z-10 block text-3xl font-bold leading-none tabular-nums text-slate-50 sm:text-4xl md:text-5xl lg:text-7xl",
    labelClassName:
      "mt-2 block text-[11px] tracking-[0.18em] text-slate-300 uppercase sm:text-xs md:text-sm lg:mt-3 lg:text-base",
    separatorClassName:
      "absolute right-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/14 to-transparent sm:block lg:h-16",
    settledValueColor: "#f8fafc",
    liveAnnouncements: true,
    glowSize: "h-16 w-16 sm:h-20 sm:w-20 lg:h-28 lg:w-28",
    glowOpacity: 0.2,
  },
  tiny: {
    sectionClassName: "mt-2 w-full",
    gridClassName: "grid grid-cols-4 gap-x-2 text-center",
    itemClassName: "relative min-w-0",
    valueWrapClassName: "relative mx-auto flex min-h-[1.4rem] items-center justify-center",
    valueClassName:
      "relative z-10 block text-xs font-semibold leading-none tabular-nums text-slate-100 sm:text-sm",
    labelClassName: "mt-1 block text-[9px] tracking-[0.12em] text-slate-400 uppercase",
    separatorClassName:
      "absolute right-0 top-1/2 hidden h-5 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent sm:block",
    settledValueColor: "#e2e8f0",
    liveAnnouncements: false,
    glowSize: "h-8 w-8 sm:h-10 sm:w-10",
    glowOpacity: 0.14,
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

function animateDigit({
  valueRef,
  glowRef,
  accent,
  settledColor,
  prefersReducedMotion,
}: {
  valueRef: RefObject<HTMLSpanElement | null>;
  glowRef: RefObject<HTMLSpanElement | null>;
  accent: string;
  settledColor: string;
  prefersReducedMotion: boolean;
}) {
  const valueEl = valueRef.current;
  const glowEl = glowRef.current;

  if (!valueEl) return;

  gsap.killTweensOf(valueEl);
  if (glowEl) gsap.killTweensOf(glowEl);

  if (prefersReducedMotion) {
    gsap.set(valueEl, {
      clearProps: "all",
      color: settledColor,
    });

    if (glowEl) {
      gsap.set(glowEl, {
        clearProps: "all",
        opacity: 0,
      });
    }

    return;
  }

  const tl = gsap.timeline({
    defaults: { overwrite: "auto" },
  });

  tl.fromTo(
    valueEl,
    {
      yPercent: 24,
      scale: 0.94,
      opacity: 0,
      filter: "blur(8px)",
      color: accent,
      textShadow: `0 0 24px ${accent}66`,
    },
    {
      yPercent: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      color: accent,
      textShadow: `0 0 16px ${accent}33`,
      duration: 0.34,
      ease: "power3.out",
    },
  ).to(
    valueEl,
    {
      color: settledColor,
      textShadow: "0 0 0 rgba(0,0,0,0)",
      duration: 0.24,
      ease: "power2.out",
    },
    "-=0.05",
  );

  if (glowEl) {
    tl.fromTo(
      glowEl,
      {
        opacity: 0,
        scale: 0.7,
      },
      {
        opacity: 1,
        scale: 1.08,
        duration: 0.18,
        ease: "power2.out",
      },
      0,
    ).to(
      glowEl,
      {
        opacity: 0,
        scale: 1.24,
        duration: 0.42,
        ease: "power2.out",
      },
      0.1,
    );
  }
}

function useDigitAnimation(
  valueRef: RefObject<HTMLSpanElement | null>,
  glowRef: RefObject<HTMLSpanElement | null>,
  value: number,
  accent: string,
  settledColor: string,
  prefersReducedMotion: boolean,
  shouldAnimate: boolean,
) {
  useGSAP(() => {
    if (!shouldAnimate) return;

    animateDigit({
      valueRef,
      glowRef,
      accent,
      settledColor,
      prefersReducedMotion,
    });
  }, [value, accent, settledColor, prefersReducedMotion, shouldAnimate]);
}

type Props = {
  conference: ConferenceManifest;
  size?: CountdownSize;
};

export default function Countdown({ conference, size = "large" }: Props) {
  const home = useHomeModel(conference);
  const variant = COUNTDOWN_VARIANTS[size];
  const prefersReducedMotion = usePrefersReducedMotion();

  const [expired, setExpired] = useState(false);
  const [timer, setTimer] = useState<CountdownTimer>(EMPTY_COUNTDOWN_TIMER);
  const [hasMounted, setHasMounted] = useState(false);

  const previousTimerRef = useRef<CountdownTimer | null>(null);

  const daysValueRef = useRef<HTMLSpanElement | null>(null);
  const hoursValueRef = useRef<HTMLSpanElement | null>(null);
  const minutesValueRef = useRef<HTMLSpanElement | null>(null);
  const secondsValueRef = useRef<HTMLSpanElement | null>(null);

  const daysGlowRef = useRef<HTMLSpanElement | null>(null);
  const hoursGlowRef = useRef<HTMLSpanElement | null>(null);
  const minutesGlowRef = useRef<HTMLSpanElement | null>(null);
  const secondsGlowRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    setHasMounted(true);

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
      days: daysValueRef,
      hours: hoursValueRef,
      minutes: minutesValueRef,
      seconds: secondsValueRef,
    }),
    [],
  );

  const glowRefs: Record<TimerUnitKey, RefObject<HTMLSpanElement | null>> = useMemo(
    () => ({
      days: daysGlowRef,
      hours: hoursGlowRef,
      minutes: minutesGlowRef,
      seconds: secondsGlowRef,
    }),
    [],
  );

  const changedUnits = useMemo<Record<TimerUnitKey, boolean>>(() => {
    const previous = previousTimerRef.current;

    if (!previous || !hasMounted) {
      return {
        days: false,
        hours: false,
        minutes: false,
        seconds: false,
      };
    }

    return {
      days: previous.days !== timer.days,
      hours: previous.hours !== timer.hours,
      minutes: previous.minutes !== timer.minutes,
      seconds: previous.seconds !== timer.seconds,
    };
  }, [hasMounted, timer]);

  useEffect(() => {
    previousTimerRef.current = timer;
  }, [timer]);

  useDigitAnimation(
    daysValueRef,
    daysGlowRef,
    timer.days,
    COUNTDOWN_UNIT_COLORS.days,
    variant.settledValueColor,
    prefersReducedMotion,
    changedUnits.days,
  );
  useDigitAnimation(
    hoursValueRef,
    hoursGlowRef,
    timer.hours,
    COUNTDOWN_UNIT_COLORS.hours,
    variant.settledValueColor,
    prefersReducedMotion,
    changedUnits.hours,
  );
  useDigitAnimation(
    minutesValueRef,
    minutesGlowRef,
    timer.minutes,
    COUNTDOWN_UNIT_COLORS.minutes,
    variant.settledValueColor,
    prefersReducedMotion,
    changedUnits.minutes,
  );
  useDigitAnimation(
    secondsValueRef,
    secondsGlowRef,
    timer.seconds,
    COUNTDOWN_UNIT_COLORS.seconds,
    variant.settledValueColor,
    prefersReducedMotion,
    changedUnits.seconds,
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
        {COUNTDOWN_UNITS.map((unit, index) => {
          const accent = COUNTDOWN_UNIT_COLORS[unit.key];
          const isLast = index === COUNTDOWN_UNITS.length - 1;

          return (
            <div
              key={unit.key}
              className={variant.itemClassName}
              style={
                {
                  "--countdown-accent": accent,
                  "--countdown-glow-opacity": variant.glowOpacity,
                } as CSSProperties
              }
            >
              {!isLast && <span aria-hidden="true" className={variant.separatorClassName} />}

              <div className={variant.valueWrapClassName}>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-2xl ${variant.glowSize}`}
                  ref={glowRefs[unit.key]}
                  style={{
                    backgroundColor: accent,
                  }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-transparent via-white/6 to-transparent"
                />
                <span
                  ref={valueRefs[unit.key]}
                  className={`${variant.valueClassName} ${atkinsonFont.className}`}
                >
                  {formatCountdownValue(timer[unit.key])}
                </span>
              </div>

              <span className={`${variant.labelClassName} ${museoFont.className}`}>
                {unit.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
