export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#F8F7FF" }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* app logo  */}
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg"
          style={{ background: "linear-gradient (135deg, #9333EA, #6C63FF)" }}
        >
          <span className="text-4xl text-white">🔥</span>
        </div>
        {/* app name  */}
        <h1 className="text-4xl font-bold tracking-light">Habit Tracker</h1>
        <p className="text-sm font-medium" style={{ color: "#9333EA" }}>
          Build better habits, one day at a time.
        </p>
        {/* animation dots  */}
        <div className="mt-4 flex gap-2 items-center">
          <div
            className="h-2 w-2 rounded-full animate-bounce"
            style={{ backgroundColor: "#9333EA" }}
          />
          <div
            className="h-2 w-2 rounded-full animate-bounce"
            style={{ backgroundColor: "#6C63FF", animationDelay: "0.15s" }}
          />
          <div
            className="h-2 w-2 rounded-full animate-bounce"
            style={{ backgroundColor: "#43D9A2", animationDelay: "0.3s" }}
          />
        </div>
      </div>
    </div>
  );
}
