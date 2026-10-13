import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KidSync AI — Trusted Care. Brighter Tomorrows.",
  description: "AI-Powered Caregiver Discovery, Matching, Booking & Live Monitoring Platform for Parents and Trusted Caregivers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#f3f6fa]">
        {children}
      </body>
    </html>
  );
}
