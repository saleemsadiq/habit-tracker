"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // only register if the browser supports service workers
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service worker registered:", registration.scope);
        })
        .catch((error) => {
          console.error("Service worker registration failed:", error);
        });
    }
  }, []); // empty array — runs once when the app first loads

  // this component renders nothing — it just runs the registration
  return null;
}
