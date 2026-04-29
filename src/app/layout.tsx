import { Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/shared/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Habit Tracker",
  description: "Build better habits, one day at a time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#9333EA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={inter.className}>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
