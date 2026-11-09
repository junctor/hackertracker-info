export const MAX_COUNTDOWN_REFRESH_DELAY_MS = 2_147_483_647;

export function hasActiveCountdown(kickoff: string, nowMs = Date.now()) {
  const kickoffMs = Date.parse(kickoff);
  return Number.isFinite(kickoffMs) && kickoffMs > nowMs;
}

export function getCountdownRefreshDelay(kickoff: string, nowMs = Date.now()) {
  const kickoffMs = Date.parse(kickoff);
  if (!Number.isFinite(kickoffMs)) return null;

  const remainingMs = kickoffMs - nowMs;
  if (remainingMs <= 0) return 0;

  return Math.min(remainingMs + 1000, MAX_COUNTDOWN_REFRESH_DELAY_MS);
}
