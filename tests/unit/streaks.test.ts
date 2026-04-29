import { describe, it, expect } from "vitest";
import { calculateCurrentStreak } from "@/lib/streaks";

/* MENTOR_TRACE_STAGE3_HABIT_A91 */
describe("calculateCurrentStreak", () => {
  it("returns 0 when completions is empty", () => {
    // no completions at all should return 0
    const result = calculateCurrentStreak([], "2026-04-29");
    expect(result).toBe(0);
  });

  it("returns 0 when today is not completed", () => {
    // yesterday completed but not today — streak is broken
    const result = calculateCurrentStreak(["2026-04-28"], "2026-04-29");
    expect(result).toBe(0);
  });

  it("returns the correct streak for consecutive completed days", () => {
    // three consecutive days ending with today
    const result = calculateCurrentStreak(
      ["2026-04-27", "2026-04-28", "2026-04-29"],
      "2026-04-29"
    );
    expect(result).toBe(3);

    // only today completed — streak of 1
    const singleDay = calculateCurrentStreak(["2026-04-29"], "2026-04-29");
    expect(singleDay).toBe(1);
  });

  it("ignores duplicate completion dates", () => {
    // same date appearing twice should still count as 1 day
    const result = calculateCurrentStreak(
      ["2026-04-29", "2026-04-29", "2026-04-28"],
      "2026-04-29"
    );
    expect(result).toBe(2);
  });

  it("breaks the streak when a calendar day is missing", () => {
    // gap between apr 27 and apr 29 — streak should be 1 not 2
    const result = calculateCurrentStreak(
      ["2026-04-27", "2026-04-29"],
      "2026-04-29"
    );
    expect(result).toBe(1);
  });
});
