import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "@/lib/habits";
import type { Habit } from "@/types/habit";

// reusable base habit for all tests
const baseHabit: Habit = {
  id: "test-id-123",
  userId: "user-id-456",
  name: "Drink Water",
  description: "Stay hydrated",
  frequency: "daily",
  createdAt: "2026-04-01T00:00:00.000Z",
  completions: ["2026-04-27", "2026-04-28"],
};

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    // april 29 is not in completions — should be added
    const result = toggleHabitCompletion(baseHabit, "2026-04-29");
    expect(result.completions).toContain("2026-04-29");
    expect(result.completions).toHaveLength(3);
  });

  it("removes a completion date when the date already exists", () => {
    // april 28 IS in completions — should be removed
    const result = toggleHabitCompletion(baseHabit, "2026-04-28");
    expect(result.completions).not.toContain("2026-04-28");
    expect(result.completions).toHaveLength(1);
  });

  it("does not mutate the original habit object", () => {
    // original habit completions should not change after toggle
    const originalCompletions = [...baseHabit.completions];
    toggleHabitCompletion(baseHabit, "2026-04-29");
    expect(baseHabit.completions).toEqual(originalCompletions);
  });

  it("does not return duplicate completion dates", () => {
    // adding a date that already exists should not create duplicate
    const result = toggleHabitCompletion(baseHabit, "2026-04-27");
    const uniqueDates = new Set(result.completions);
    expect(uniqueDates.size).toBe(result.completions.length);
  });
});
