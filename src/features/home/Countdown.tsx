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

type CountdownState = {
  expired: boolean;
  timer: CountdownTimer;
  changedUnits: Record<TimerUnitKey, boolean>;
};

const UNCHANGED_COUNTDOWN_UNITS: Record<TimerUnitKey, boolean> = {
  days: false,
  hours: false,
  minutes: false,
  seconds: false,
};

function getCountdownState(kickoffDateMs: number, nowMs: number): CountdownState {
  const expired = hasKickoffPassed(kickoffDateMs, nowMs);
  return {
    expired,
    timer: expired ? EMPTY_COUNTDOWN_TIMER : getCountdown(kickoffDateMs, nowMs),
    changedUnits: UNCHANGED_COUNTDOWN_UNITS,
  };
}

function CountdownUnit({
  unit,
  value,
  changed,
  isLast,
  variant,
  prefersReducedMotion,
}: {
  unit: (typeof COUNTDOWN_UNITS)[number];
  value: number;
  changed: boolean;
  isLast: boolean;
  variant: (typeof COUNTDOWN_VARIANTS)[CountdownSize];
  prefersReducedMotion: boolean;
}) {
  const valueRef = useRef<HTMLSpanElement | null>(null);
  const glowRef = useRef<HTMLSpanElement | null>(null);

  useDigitAnimation(
    valueRef,
    glowRef,
    value,
    COUNTDOWN_UNIT_COLORS[unit.key],
    variant.settledValueColor,
    prefersReducedMotion,
    changed,
  );

  return (
    <div className={variant.itemClassName}>
      {!isLast && <span aria-hidden="true" className={variant.separatorClassName} />}

      <div className={variant.valueWrapClassName}>
        <span
          ref={glowRef}
          aria-hidden="true"
          className={`ui-countdown-glow ${variant.glowSize} ${COUNTDOWN_UNIT_TEXT_CLASS_NAMES[unit.key]}`}
        />
        <span aria-hidden="true" className="ui-countdown-rule" />
        <span ref={valueRef} className={`${variant.valueClassName} ${atkinsonFont.className}`}>
          {formatCountdownValue(value)}
        </span>
      </div>

      <span className={`${variant.labelClassName} ${museoFont.className}`}>{unit.label}</span>
    </div>
  );
}

export default function Countdown({ conference, size = "large" }: Props) {
  const home = useHomeModel(conference);
  const variant = COUNTDOWN_VARIANTS[size];
  const prefersReducedMotion = usePrefersReducedMotion();
  const [countdownState, setCountdownState] = useState(() =>
    getCountdownState(home.kickoffDateMs, Date.now()),
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { expired, timer, changedUnits } = countdownState;

  useEffect(() => {
    const tick = () => {
      const nowMs = Date.now();
      const nextState = getCountdownState(home.kickoffDateMs, nowMs);
      setCountdownState((current) => ({
        ...nextState,
        changedUnits: {
          days: current.timer.days !== nextState.timer.days,
          hours: current.timer.hours !== nextState.timer.hours,
          minutes: current.timer.minutes !== nextState.timer.minutes,
          seconds: current.timer.seconds !== nextState.timer.seconds,
        },
      }));
      if (!nextState.expired) {
        timeoutRef.current = setTimeout(tick, 1000 - (nowMs % 1000));
      }
    };

    timeoutRef.current = setTimeout(tick, 1000 - (Date.now() % 1000));

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [home.kickoffDateMs]);

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
            <CountdownUnit
              key={unit.key}
              unit={unit}
              value={timer[unit.key]}
              changed={changedUnits[unit.key]}
              isLast={isLast}
              variant={variant}
              prefersReducedMotion={prefersReducedMotion}
            />
          );
        })}
      </div>
    </section>
  );
}
