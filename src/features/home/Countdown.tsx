import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

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
  }
> = {
  large: {
    sectionClassName: "ui-countdown-large",
    gridClassName: "ui-countdown-grid-large",
    itemClassName: "ui-countdown-item-large",
    valueWrapClassName: "ui-countdown-value-wrap-large",
    valueClassName: "ui-countdown-value-large",
    labelClassName: "ui-countdown-label-large",
    separatorClassName: "ui-countdown-separator-large",
    settledValueColor: "var(--color-fg)",
    liveAnnouncements: true,
    glowSize: "ui-countdown-glow-large",
  },
  tiny: {
    sectionClassName: "ui-countdown-tiny",
    gridClassName: "ui-countdown-grid-tiny",
    itemClassName: "ui-countdown-item-tiny",
    valueWrapClassName: "ui-countdown-value-wrap-tiny",
    valueClassName: "ui-countdown-value-tiny",
    labelClassName: "ui-countdown-label-tiny",
    separatorClassName: "ui-countdown-separator-tiny",
    settledValueColor: "var(--color-muted)",
    liveAnnouncements: false,
    glowSize: "ui-countdown-glow-tiny",
  },
};

const COUNTDOWN_UNIT_TEXT_CLASS_NAMES: Record<TimerUnitKey, string> = {
  days: "ui-countdown-unit-days",
  hours: "ui-countdown-unit-hours",
  minutes: "ui-countdown-unit-minutes",
  seconds: "ui-countdown-unit-seconds",
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
      textShadow: `0 0 14px color-mix(in srgb, ${accent} 18%, transparent)`,
    },
    {
      yPercent: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      color: accent,
      textShadow: `0 0 8px color-mix(in srgb, ${accent} 12%, transparent)`,
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
        <p className="ui-visually-hidden" aria-live="polite" aria-atomic="true">
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
          const isLast = index === COUNTDOWN_UNITS.length - 1;

          return (
            <div key={unit.key} className={variant.itemClassName}>
              {!isLast && <span aria-hidden="true" className={variant.separatorClassName} />}

              <div className={variant.valueWrapClassName}>
                <span
                  aria-hidden="true"
                  className={`ui-countdown-glow ${variant.glowSize} ${COUNTDOWN_UNIT_TEXT_CLASS_NAMES[unit.key]}`}
                  ref={glowRefs[unit.key]}
                />
                <span aria-hidden="true" className="ui-countdown-rule" />
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
