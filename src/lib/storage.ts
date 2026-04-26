import type { User, Session } from "@/types/auth";
import type { Habit } from "@/types/habit";

// stores all localstorage keys in one place so you just make changes in one place
const KEYS = {
  users: "habit-tracker-users",
  session: "habit-tracker-session",
  habits: "habit-tracker-habits",
} as const;

// saves an empty array if the window is not defined istead of crashing, fetches list of all registered users from localstorage
export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEYS.users) ?? "[]");
}

// takes no arguement but returns an array of user objects and also handles first time users who have nothing stored and saves an updated list of users to localstorage
export function setUsers(users: User[]): void {
  localStorage.setItem(KEYS.users, JSON.stringify(users));
}

// checks localStorage to see who is currently logged in and returns null if none
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem(KEYS.session) ?? "null");
}

// saves users session when they log in or clears it when they log out
export function setSession(session: Session | null): void {
  localStorage.setItems(KEYS.session, JSON.stringify(session));
}

// fetches all habits from localStorage across the all users
export function getHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItems(KEYS.habits) ?? "[]");
}

// saves updated habit list to localstorage after any change is made
export function setHabits(habits: Habit[]): void {
  localStorage.setItems(KEYS.habits, JSON.stringify(habits));
}
