"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/shared/SplashScreen";
import { getSession } from "@/lib/storage";
import { SPLASH_DURATION } from "@/lib/constants";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    console.log("useEffect running");
    console.log("SPLASH_DURATION:", SPLASH_DURATION);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.log("Service worker registration failed:", error);
      });
    }

    const timer = setTimeout(() => {
      console.log("timer fired");
      const session = getSession();
      console.log("session:", session);

      if (session) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/login";
      }
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
