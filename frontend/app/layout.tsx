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
    <html lang="en" className="dark antialiased">
      <body className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
