"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import HabitList from "@/components/habits/HabitList";
import { getSession, getHabits, setSession } from "@/lib/storage";
import { calculateCurrentStreak } from "@/lib/streaks";

// shape of stats to render
type Stats = {
  completedToday: number;
  totalHabits: number;
  longestStreak: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    completedToday: 0,
    totalHabits: 0,
    longestStreak: 0,
  });

  const session = getSession();
  useEffect(() => {
    const session = getSession();
    if (!session) return;
    const today = new Date().toISOString().split("T")[0];
    const userHabits = getHabits().filter((h) => h.userId === session.userId);

    const completedToday = userHabits.filter((h) =>
      h.completions.includes(today)
    ).length;

    const longestStreak = userHabits.reduce((max, h) => {
      const streak = calculateCurrentStreak(h.completions);
      return streak > max ? streak : max;
    }, 0);
    setStats({
      completedToday,
      totalHabits: userHabits.length,
      longestStreak,
    });
  }, []);
  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-purple-100"
        // style={{ backgroundColor: "#F8F7FF" }}
        data-testid="dashboard-page"
      >
        {/* header */}
        <header className="bg-white shadow-sm">
          <div className="x-auto flex max-w-2xl items-center justify-between px-4 py-4">
            {/* logo */}
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: "linear-gradient(135deg, #9333EA, #2563EB)",
                }}
              >
                <span className="text-sm">🔥</span>
              </div>
              <span className="font-bold text-gray-900">Habit Tracker</span>
            </div>
            {/* user email and logout button  */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{session?.email}</span>
              <button
                type="button"
                data-testid="auth-logout-button"
                onClick={() => {
                  setSession(null);
                  router.push("/login");
                }}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-white"
                style={{
                  background: "linear-gradient(135deg, #9333EA, #2563EB)",
                }}
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* body  */}
        <main className="mx-auto max-w-2xl px-4 py-6">
          {/* Stats row */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Today</p>
              <p className="text-2xl font-bold" style={{ color: "#9333EA" }}>
                {stats.completedToday}/{stats.totalHabits}
              </p>
              <p className="text-xs text-gray-400">completed</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Streak</p>
              <p className="text-2xl font-bold" style={{ color: "#F97316" }}>
                {stats.longestStreak}
              </p>
              <p className="text-xs text-gray-400">days 🔥</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold" style={{ color: "#2563EB" }}>
                {stats.totalHabits}
              </p>
              <p className="text-xs text-gray-400">habits</p>
            </div>
          </div>
          <HabitList />
        </main>
      </div>
    </ProtectedRoute>
  );
}
