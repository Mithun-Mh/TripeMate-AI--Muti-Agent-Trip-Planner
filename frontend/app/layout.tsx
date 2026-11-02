import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TripMate AI • Multi-Agent Trip Planner",
  description:
    "Intelligent travel planning with autonomous LangGraph agents, real flight routes, accommodations, and itemized budgets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-[#FFFFFF] text-[#171717] selection:bg-[#159447] selection:text-white flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
