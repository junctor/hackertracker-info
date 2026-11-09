import { describe, expect, it } from "vite-plus/test";

import {
  getCountdownRefreshDelay,
  hasActiveCountdown,
  MAX_COUNTDOWN_REFRESH_DELAY_MS,
} from "./countdownVisibility";

describe("countdown visibility", () => {
  const nowMs = Date.parse("2026-01-01T00:00:00Z");

  it("shows only valid future countdowns", () => {
    expect(hasActiveCountdown("2026-01-01T00:00:01Z", nowMs)).toBe(true);
    expect(hasActiveCountdown("2026-01-01T00:00:00Z", nowMs)).toBe(false);
    expect(hasActiveCountdown("not-a-date", nowMs)).toBe(false);
  });

  it("caps long refreshes so the timer can re-arm", () => {
    expect(getCountdownRefreshDelay("2027-01-01T00:00:00Z", nowMs)).toBe(
      MAX_COUNTDOWN_REFRESH_DELAY_MS,
    );
  });

  it("refreshes just after kickoff for near-term conferences", () => {
    expect(getCountdownRefreshDelay("2026-01-01T00:00:05Z", nowMs)).toBe(6000);
    expect(getCountdownRefreshDelay("2025-12-31T23:59:59Z", nowMs)).toBe(0);
    expect(getCountdownRefreshDelay("not-a-date", nowMs)).toBeNull();
  });
});
