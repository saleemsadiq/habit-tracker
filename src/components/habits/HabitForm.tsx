"use client";
import { useState } from "react";
import type { Habit } from "@/types/habit";
import { validateHabitName } from "@/lib/validators";
import { getSession, getHabits, setHabits } from "@/lib/storage";

type Props = {
  habitToEdit: Habit | null;
  onSave: (habit: Habit) => void;
  onCancel: () => void;
};

export default function HabitForm({ habitToEdit, onSave, onCancel }: Props) {
  const [name, setName] = useState(habitToEdit?.name ?? "");
  const [description, setDescription] = useState(
    habitToEdit?.description ?? ""
  );
  const [nameError, setNameError] = useState<string | null>(null);

  // ── ALL the save logic lives inside this function ──
  const handleSave = () => {
    // validate the name first
    const validation = validateHabitName(name);

    if (!validation.valid) {
      setNameError(validation.error);
      return;
    }

    // clear any previous error
    setNameError(null);

    if (habitToEdit) {
      // editing — preserve id, userId, createdAt, completions
      const updatedHabit: Habit = {
        ...habitToEdit,
        name: validation.value,
        description: description.trim(),
      };
      const allHabits = getHabits();
      const updatedHabits = allHabits.map((h) =>
        h.id === updatedHabit.id ? updatedHabit : h
      );
      setHabits(updatedHabits);
      onSave(updatedHabit);
    } else {
      // creating — need session for userId
      const session = getSession();
      if (!session) return;

      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId: session.userId,
        name: validation.value,
        description: description.trim(),
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions: [],
      };
      const allHabits = getHabits();
      setHabits([...allHabits, newHabit]);
      onSave(newHabit);
    }
  };

  return (
    <div
      data-testid="habit-form"
      className="rounded-2xl bg-white p-6 shadow-md w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-6" style={{ color: "#2D2B55" }}>
        {habitToEdit ? "Edit Habit" : "Create New Habit"}
      </h2>

      <div className="mb-4">
        <label
          htmlFor="habit-name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Habit Name <span style={{ color: "#EF4444" }}>*</span>
        </label>
        <input
          id="habit-name"
          type="text"
          data-testid="habit-name-input"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(null);
          }}
          placeholder="e.g. Drink Water"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-gray-900"
        />
        {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
      </div>

      <div className="mb-4">
        <label
          htmlFor="habit-description"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Drink 8 glasses of water every day"
          rows={3}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-none text-gray-900"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="habit-frequency"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value="daily"
          disabled
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none bg-gray-50 text-gray-500 cursor-not-allowed"
        >
          <option value="daily">Daily</option>
        </select>
        <p className="mt-1 text-xs text-gray-400">
          Only daily frequency is supported at this stage
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="button"
          data-testid="habit-save-button"
          onClick={handleSave}
          className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-opacity"
          style={{ background: "linear-gradient(135deg, #9333EA, #2563EB)" }}
        >
          {habitToEdit ? "Save Changes" : "Create Habit"}
        </button>
      </div>
    </div>
  );
}
