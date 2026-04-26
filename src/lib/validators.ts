type ValidationResult = {
  valid: boolean;
  value: string;
  error: string | null;
};
// the function validates a habit name and returns the result which is cleaned value, if not it returns an error message
export function validateHabitName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) {
    return {
      valid: false,
      value: "",
      error: "Habit name is required",
    };
  }
  if (trimmed.length > 60) {
    return {
      valid: false,
      value: trimmed,
      error: "Habit name must be 60 characters or fewer",
    };
  }
  return {
    valid: true,
    value: trimmed,
    error: null,
  };
}
