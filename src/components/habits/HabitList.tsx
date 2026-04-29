"use client";
import { useState } from "react";
import type { Habit } from "@/types/habit";
import { getHabits, setHabits, getSession } from "@/lib/storage";
import HabitCard from "@/components/habits/HabitCard";
import HabitForm from "@/components/habits/HabitForm";

export default function HabitList() {
  const session = getSession();

  // load all habits from local storage, filter to current user only
  const allStored = getHabits();
  const userHabits = session
    ? allStored.filter((h) => h.userId === session.userId)
    : [];

  // habits held in state so ui can re-render when list changes
  const [habits, setHabitsState] = useState<Habit[]>(userHabits);

  //   edit habit object or null = form hidden
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // handlers passed to habit card
  //   called when edit button is clicked
  const handleEdit = (habit: Habit) => {
    setHabitToEdit(habit);
    setShowCreateForm(false); //to close the form if open
  };

  // called when delete is confirmed inside habitcard
  const handleDelete = (habitId: string) => {
    // filter the deleted habit from state
    const remaining = habits.filter((h) => h.id !== habitId);
    setHabitsState(remaining);

    //   persist the change to localStorage, only remove the users deleted one, keep others
    const allHabits = getHabits();
    const updatedAll = allHabits.filter((h) => h.id !== habitId);
    setHabits(updatedAll);
  };

  //   called when completion is toggled insdie habitcard
  const handleUpdate = (updatedHabit: Habit) => {
    // replace old habit with updated one in state
    setHabitsState((prev) =>
      prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h))
    );
  };
  // called when HabitForm saves (create or edit)
  const handleFormSave = (savedHabit: Habit) => {
    if (habitToEdit) {
      // editing — replace in state
      setHabitsState((prev) =>
        prev.map((h) => (h.id === savedHabit.id ? savedHabit : h))
      );
      setHabitToEdit(null);
    } else {
      // creating — add to state
      setHabitsState((prev) => [...prev, savedHabit]);
      setShowCreateForm(false);
    }
  };

  // called when HabitForm cancel is clicked
  const handleFormCancel = () => {
    setHabitToEdit(null);
    setShowCreateForm(false);
    };

  return (
    <div className="w-full">
      {/* ── Header row: title + add button ── */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Habits</h2>
        {/* only show Add button when no form is open */}
        {!showCreateForm && !habitToEdit && (
          <button
            type="button"
            data-testid="create-habit-button"
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #9333EA, #2563EB)" }}
          >
            + Add Habit
          </button>
        )}
      </div>

      {/* ── Create form ── */}
      {showCreateForm && (
        <div className="mb-6">
          <HabitForm
            habitToEdit={null}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {/* ── Edit form ── */}
      {habitToEdit && (
        <div className="mb-6">
          <HabitForm
            habitToEdit={habitToEdit}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {/* ── Empty state ── */}
      {habits.length === 0 && !showCreateForm && (
        <div
          data-testid="empty-state"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <span className="text-5xl mb-4">🥲</span>
          <p className="text-gray-500 text-sm">
            No habits yet. Add one to get started!
          </p>
        </div>
      )}

      {/* ── Habit cards ── */}
      <div className="flex flex-col gap-3">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
}
