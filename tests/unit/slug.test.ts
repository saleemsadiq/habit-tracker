import { describe, it, expect } from "vitest";
import { getHabitSlug } from "@/lib/slug";

describe("getHabitSlug", () => {
  it("returns lowercase hyphenated slug for a basic habit name", () => {
    // basic two word name should become lowercase with hyphen
    expect(getHabitSlug("Drink Water")).toBe("drink-water");
    expect(getHabitSlug("Read Books")).toBe("read-books");
  });

  it("trims outer spaces and collapses repeated internal spaces", () => {
    // leading and trailing spaces should be removed
    expect(getHabitSlug("  Drink Water  ")).toBe("drink-water");
    // multiple spaces between words should become single hyphen
    expect(getHabitSlug("Drink  Water")).toBe("drink-water");
  });

  it("removes non alphanumeric characters except hyphens", () => {
    // special characters should be stripped out
    expect(getHabitSlug("Drink Water!")).toBe("drink-water");
    expect(getHabitSlug("Read & Write")).toBe("read-write");
  });
});
