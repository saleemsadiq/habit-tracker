"use client";
import { useState } from "react";
import type { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import { toggleHabitCompletion } from "@/lib/habits";
import { getHabits, setHabits } from "@/lib/storage";

// props that will be recieved from habitlist
type Props = {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onUpdate: (updated: Habit) => void;
};

export default function HabitCard({
  habit,
  onEdit,
  onDelete,
  onUpdate,
}: Props) {
  // generate slug from habit name
  const slug = getHabitSlug(habit.name);

  // generate todays date in yyyy-mm-dd format
  const today = new Date().toISOString().split("T")[0];

  // check if habit is already completed for today
  const isCompletedToday = habit.completions.includes(today);

  // calculate current streak from completions array
  const currentStreak = calculateCurrentStreak(habit.completions);

  // control whether delete confirmation is showing
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // toggle completion for today
  const handleToggleComplete = () => {
    const updatedHabit = toggleHabitCompletion(habit, today);

    // save updated habit to localstorage
    const allHabits = getHabits();
    const updatedHabits = allHabits.map((h) =>
      h.id === updatedHabit.id ? updatedHabit : h
    );
    setHabits(updatedHabits);

    // notify parent component so ui re-renders
    onUpdate(updatedHabit);
  };

  // handle delete , first click confirmation, second ..confirm
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };
  const handleConfirmDelete = () => {
    onDelete(habit.id);
  };
  const handelCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100"
    >
      {/* delete confirmation overlay  */}
      {showDeleteConfirm && (
        <div
          className="mb-4 rounded-xl p-4 text-center"
          style={{ backgroundColor: "#FFF5F5" }}
        >
          <p className="mb-3 text-sm font-medium text-gray-700">
            Delete <span className="font-bold">{habit.name}</span>? This can not
            be undone !
          </p>
          <div className="flex gap-2 justify-center">
            {/* cancel  button  */}
            <button
              type="button"
              onClick={handelCancelDelete}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200"
            >
              Cancel
            </button>
            {/* confirm delete button  */}
            <button
              type="button"
              data-testid="confirm-delete-button"
              onClick={handleConfirmDelete}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "#EF4444" }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* main card componenet  */}
      <div className="flex items-center gap-3">
        {/* completion toggle button  */}
        <button
          type="button"
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggleComplete}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all"
          style={{
            backgroundColor: isCompletedToday ? "#9333EA" : "transparent",
            borderColor: isCompletedToday ? "#9333EA" : "#D1D5DB",
          }}
          aria-label={isCompletedToday ? "Mark incomplete" : "Mark complete"}
        >
          {isCompletedToday && (
            <span className="text-white text-sm font-bold">✓</span>
          )}
        </button>

        {/* habit name and streak  */}
        <div className="flex-1">
          <p
            className="font-semi-bold text-purple-500"
            style={{
              textDecoration: isCompletedToday ? "line-through" : "none",
              opacity: isCompletedToday ? 0.6 : 1,
            }}
          >
            {habit.name}
          </p>
          {/* streak display */}
          <div
            className="flex items-center gap-1 mt-1"
            data-testid={`habit-streak-${slug}`}
          >
            <span className="text-sm">🔥</span>
            <span className="text-sm font-medium" style={{ color: "#F97316" }}>
              {currentStreak} day streak
            </span>
          </div>
        </div>
        {/* edit and delete button  */}
        <div className="flex items-center gap-2">
          {/* Edit button */}
          <button
            type="button"
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit)}
            className="flex p-2 items-center justify-center rounded-lg text-gray-600 bg-gray-200 hover:bg-purple-300 hover:text-purple-600 hover:background transition-colors"
            aria-label="Edit habit"
          >
            Edit
          </button>

          {/* Delete button */}
          <button
            type="button"
            data-testid={`habit-delete-${slug}`}
            onClick={handleDeleteClick}
            className="flex p-2 items-center justify-center rounded-lg text-gray-600 bg-gray-200 hover:bg-red-100 hover:text-red-500 transition-colors"
            aria-label="Delete habit"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
