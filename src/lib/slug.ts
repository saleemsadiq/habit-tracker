// it converts a habit name into a url slug
export function getHabitSlug(name: string): string {
  return name
    .toLocaleLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
