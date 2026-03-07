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
    glowSize: "h-14 w-14 sm:h-[4.5rem] sm:w-[4.5rem] lg:h-24 lg:w-24",
    glowOpacity: 0.12,
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
    glowSize: "h-7 w-7 sm:h-8 sm:w-8",
    glowOpacity: 0.08,
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
      yPercent: 16,
      scale: 0.975,
      opacity: 0.2,
      filter: "blur(4px)",
      color: accent,
      textShadow: `0 0 14px ${accent}2e`,
    },
    {
      yPercent: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      color: accent,
      textShadow: `0 0 8px ${accent}1f`,
      duration: 0.26,
      ease: "power2.out",
    },
  ).to(
    valueEl,
    {
      color: settledColor,
      textShadow: "0 0 0 rgba(0,0,0,0)",
      duration: 0.2,
      ease: "power2.out",
    },
    "-=0.03",
  );

  if (glowEl) {
    tl.fromTo(
      glowEl,
      {
        opacity: 0,
        scale: 0.82,
      },
      {
        opacity: 0.7,
        scale: 1,
        duration: 0.16,
        ease: "power2.out",
      },
      0,
    ).to(
      glowEl,
      {
        opacity: 0,
        scale: 1.12,
        duration: 0.28,
        ease: "power1.out",
      },
      0.08,
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
                  className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-xl ${variant.glowSize}`}
                  ref={glowRefs[unit.key]}
                  style={{
                    background: `radial-gradient(circle, ${accent} 0%, ${accent}66 36%, transparent 72%)`,
                    opacity: variant.glowOpacity,
                  }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-transparent via-white/10 to-transparent"
                />
                <span
                  ref={valueRefs[unit.key]}
                  className={`${variant.valueClassName} ${atkinsonFont.className}`}
                  style={{
                    textShadow: `0 0 10px color-mix(in srgb, ${accent} 10%, transparent)`,
                  }}
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
