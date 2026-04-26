// the streaks function logic works if today is not included, return 0, and if today is completed , count
//  everyday until a day is messed ...completed days ending with today

export function calculateCurrentStreak(
  completions: string[],
  today?: string
): number {
  if (completions.length === 0) {
    return 0;
  }

  // Use the provided 'today' date, or generate the actual current date
  const currentDate = today || new Date().toISOString().split("T")[0];

  // Remove duplicates using a Set
  const uniqueDates = Array.from(new Set(completions));

  // Sort descending (newest first)
  uniqueDates.sort((a, b) => b.localeCompare(a));

  // If today is not in the list, the streak is broken
  if (!uniqueDates.includes(currentDate)) {
    return 0;
  }

  // Calculate the streak
  let streak = 0;

  // Create a Date object to act as our "step backwards" counter
  const checkDate = new Date(currentDate);
  // Set time to noon to avoid daylight saving time bugs when subtracting days
  checkDate.setHours(12, 0, 0, 0);

  for (const recordDate of uniqueDates) {
    const expectedDateString = checkDate.toISOString().split("T")[0];

    if (recordDate === expectedDateString) {
      streak++; // Increment streak
      checkDate.setDate(checkDate.getDate() - 1); // Step back exactly 1 day
    } else if (recordDate < expectedDateString) {
      // The recorded date is older than what we expected, meaning a day was skipped
      break;
    }
  }

  return streak;
}
