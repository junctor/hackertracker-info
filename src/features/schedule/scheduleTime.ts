type TimedScheduleSession = {
  beginTimestampSeconds: number;
  endTimestampSeconds: number;
};

type TimedScheduleDay = {
  sessions: readonly TimedScheduleSession[];
};

export const NEXT_WINDOW_SECONDS = 30 * 60;

export function isScheduleLiveWindowAvailable(
  days: readonly TimedScheduleDay[],
  nowSeconds: number,
): boolean {
  if (nowSeconds <= 0) return false;

  let earliestBeginSeconds: number | null = null;
  let latestEndSeconds: number | null = null;

  for (const { sessions } of days) {
    for (const session of sessions) {
      const beginsAt = session.beginTimestampSeconds;
      const endsAt = session.endTimestampSeconds;
      if (!Number.isFinite(beginsAt) || !Number.isFinite(endsAt) || endsAt < beginsAt) continue;

      if (earliestBeginSeconds === null || beginsAt < earliestBeginSeconds) {
        earliestBeginSeconds = beginsAt;
      }

      if (latestEndSeconds === null || endsAt > latestEndSeconds) {
        latestEndSeconds = endsAt;
      }
    }
  }

  return (
    earliestBeginSeconds !== null &&
    latestEndSeconds !== null &&
    earliestBeginSeconds - NEXT_WINDOW_SECONDS <= nowSeconds &&
    nowSeconds < latestEndSeconds
  );
}

export function isScheduleSessionLive(session: TimedScheduleSession, nowSeconds: number): boolean {
  const beginsAt = session.beginTimestampSeconds;
  const endsAt = session.endTimestampSeconds;

  return (
    Number.isFinite(beginsAt) &&
    Number.isFinite(endsAt) &&
    beginsAt <= nowSeconds &&
    nowSeconds < endsAt
  );
}

export function isScheduleSessionStartingSoon(
  session: TimedScheduleSession,
  nowSeconds: number,
): boolean {
  const beginsAt = session.beginTimestampSeconds;

  return (
    !isScheduleSessionLive(session, nowSeconds) &&
    Number.isFinite(beginsAt) &&
    beginsAt > nowSeconds &&
    beginsAt - nowSeconds <= NEXT_WINDOW_SECONDS
  );
}
