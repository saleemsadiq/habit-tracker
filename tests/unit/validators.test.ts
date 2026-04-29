import { describe, it, expect } from "vitest";
import { validateHabitName } from "@/lib/validators";

describe("validateHabitName", () => {
  it("returns an error when habit name is empty", () => {
    // empty string should fail validation
    const result = validateHabitName("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Habit name is required");

    // spaces only should also fail — trim makes it empty
    const spacesResult = validateHabitName("   ");
    expect(spacesResult.valid).toBe(false);
    expect(spacesResult.error).toBe("Habit name is required");
  });

  it("returns an error when habit name exceeds 60 characters", () => {
    // create a string that is 61 characters long
    const longName = "a".repeat(61);
    const result = validateHabitName(longName);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Habit name must be 60 characters or fewer");
  });

  it("returns a trimmed value when habit name is valid", () => {
    // valid name should pass and return trimmed value
    const result = validateHabitName("  Drink Water  ");
    expect(result.valid).toBe(true);
    expect(result.value).toBe("Drink Water");
    expect(result.error).toBeNull();
  });
});
