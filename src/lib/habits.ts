import type {Habit} from '@/types/habit'
// a button toggles it so if date exists , it is removed . if it deosnt exist , it is added since sets prevents double data 

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  // Create a Set from existing completions
  const completionsSet = new Set(habit.completions);

  // Toggle the date using Set's built-in methods
  if (completionsSet.has(date)) {
    // Date exists — remove it (unmarking the habit)
    completionsSet.delete(date);
  } else {
    // Date missing — add it (marking the habit complete)
    completionsSet.add(date);
  }

  //Return a new object
  return {
    ...habit,
    completions: Array.from(completionsSet),
  };
}
