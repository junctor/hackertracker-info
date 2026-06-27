type TimedScheduleSession = {
  beginTimestampSeconds: number;
  endTimestampSeconds: number;
};

type TimedConference = {
  begin: string;
  end: string;
};

export const NEXT_WINDOW_SECONDS = 30 * 60;

function toTimestampSeconds(value: string): number {
  const timestampMs = Date.parse(value);
  return Number.isFinite(timestampMs) ? Math.floor(timestampMs / 1000) : Number.NaN;
}

export function isConferenceInProgress(conference: TimedConference, nowSeconds: number): boolean {
  const beginsAt = toTimestampSeconds(conference.begin);
  const endsAt = toTimestampSeconds(conference.end);

  return (
    Number.isFinite(beginsAt) &&
    Number.isFinite(endsAt) &&
    beginsAt <= nowSeconds &&
    nowSeconds <= endsAt
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
