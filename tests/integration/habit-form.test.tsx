import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HabitList from "@/components/habits/HabitList";

// mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// set up a logged in session before each test
beforeEach(() => {
  localStorage.clear();

  // create a user
  const user = {
    id: "user-123",
    email: "test@example.com",
    password: "password123",
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem("habit-tracker-users", JSON.stringify([user]));

  // create a session for that user
  localStorage.setItem(
    "habit-tracker-session",
    JSON.stringify({ userId: "user-123", email: "test@example.com" })
  );
});

describe("habit form", () => {
  it("shows a validation error when habit name is empty", () => {
    render(<HabitList />);

    // open create form
    fireEvent.click(screen.getByTestId("create-habit-button"));

    // click save without entering a name
    fireEvent.click(screen.getByTestId("habit-save-button"));

    // validation error should appear
    expect(screen.getByText("Habit name is required")).toBeInTheDocument();
  });

  it("creates a new habit and renders it in the list", () => {
    render(<HabitList />);

    // open create form
    fireEvent.click(screen.getByTestId("create-habit-button"));

    // fill in habit name
    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Drink Water" },
    });

    // save the habit
    fireEvent.click(screen.getByTestId("habit-save-button"));

    // habit card should appear in the list
    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();
  });

  it("edits an existing habit and preserves immutable fields", () => {
    // set up an existing habit in localStorage
    const existingHabit = {
      id: "habit-abc",
      userId: "user-123",
      name: "Drink Water",
      description: "",
      frequency: "daily",
      createdAt: "2026-04-01T00:00:00.000Z",
      completions: ["2026-04-28"],
    };
    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify([existingHabit])
    );

    render(<HabitList />);

    // click edit button on the habit card
    fireEvent.click(screen.getByTestId("habit-edit-drink-water"));

    // change the name
    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Drink More Water" },
    });

    // save changes
    fireEvent.click(screen.getByTestId("habit-save-button"));

    // new name should appear
    expect(
      screen.getByTestId("habit-card-drink-more-water")
    ).toBeInTheDocument();

    // verify immutable fields preserved in localStorage
    const habits = JSON.parse(
      localStorage.getItem("habit-tracker-habits") ?? "[]"
    );
    expect(habits[0].id).toBe("habit-abc");
    expect(habits[0].createdAt).toBe("2026-04-01T00:00:00.000Z");
    expect(habits[0].completions).toEqual(["2026-04-28"]);
  });

  it("deletes a habit only after explicit confirmation", () => {
    // set up an existing habit
    const existingHabit = {
      id: "habit-abc",
      userId: "user-123",
      name: "Drink Water",
      description: "",
      frequency: "daily",
      createdAt: "2026-04-01T00:00:00.000Z",
      completions: [],
    };
    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify([existingHabit])
    );

    render(<HabitList />);

    // click delete — confirmation should appear
    fireEvent.click(screen.getByTestId("habit-delete-drink-water"));

    // habit should still be there — not deleted yet
    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();

    // now confirm deletion
    fireEvent.click(screen.getByTestId("confirm-delete-button"));

    // habit should now be gone
    expect(
      screen.queryByTestId("habit-card-drink-water")
    ).not.toBeInTheDocument();
  });

  it("toggles completion and updates the streak display", () => {
    const today = new Date().toISOString().split("T")[0];

    // set up habit with no completions
    const existingHabit = {
      id: "habit-abc",
      userId: "user-123",
      name: "Drink Water",
      description: "",
      frequency: "daily",
      createdAt: "2026-04-01T00:00:00.000Z",
      completions: [],
    };
    localStorage.setItem(
      "habit-tracker-habits",
      JSON.stringify([existingHabit])
    );

    render(<HabitList />);

    // streak should start at 0
    expect(screen.getByTestId("habit-streak-drink-water")).toHaveTextContent(
      "0 day streak"
    );

    // toggle completion
    fireEvent.click(screen.getByTestId("habit-complete-drink-water"));

    // streak should now show 1
    expect(screen.getByTestId("habit-streak-drink-water")).toHaveTextContent(
      "1 day streak"
    );
  });
});
