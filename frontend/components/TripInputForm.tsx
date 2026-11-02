"use client";

import React, { useState } from "react";
import { Send, Sparkles, MapPin, Loader2, ArrowRight } from "lucide-react";

interface TripInputFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

const PRESET_QUERIES = [
  {
    title: "Germany to Sri Lanka",
    badge: "10 Days • 2 Adults",
    query:
      "Plan a 10-day trip from Germany to Sri Lanka for two adults with a total budget of LKR 300,000, including return flights, accommodation, food and transportation. Find affordable flights, hotels and attractions, and create a day-by-day itinerary with a detailed cost breakdown while staying within budget.",
  },
  {
    title: "Tokyo & Kyoto Cultural Tour",
    badge: "7 Days • Solo • $2,200",
    query:
      "Plan a 7-day solo cultural trip from London to Japan visiting Tokyo, Kyoto, and Nara with a $2,200 budget. Include bullet train transport, traditional ryokan suggestions, sushi spots, and historic shrines.",
  },
  {
    title: "Paris & Swiss Alps Romance",
    badge: "5 Days • Couple • €3,500",
    query:
      "Plan a 5-day romantic trip for a couple from New York to Paris and the Swiss Alps (Interlaken / Zermatt) with a €3,500 budget. Include scenic train routes, boutique hotels, and landmark sights.",
  },
  {
    title: "Kenya Wildlife Safari",
    badge: "4 Days • Family of 4 • $4,000",
    query:
      "Plan a 4-day wildlife safari adventure in Kenya (Maasai Mara and Lake Nakuru) for a family of 4 with comfortable safari lodges, game drives, and park fees breakdown.",
  },
];

export function TripInputForm({ onSubmit, isLoading }: TripInputFormProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // If query is empty, automatically use the top preset so the button is never a dead click
    const targetQuery = query.trim() || PRESET_QUERIES[0].query;
    if (!query.trim()) {
      setQuery(targetQuery);
    }
    onSubmit(targetQuery);
  };

  const handleSelectPreset = (presetQuery: string) => {
    setQuery(presetQuery);
    if (!isLoading) {
      onSubmit(presetQuery);
    }
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/40 backdrop-blur-xl relative overflow-hidden">
      {/* Background subtle ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <MapPin className="w-4 h-4" />
          </div>
          <label className="text-sm font-semibold text-slate-200">
            Where would you like to travel?
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Plan a 10-day trip from Germany to Sri Lanka for two adults with a budget of LKR 300,000 including flights, hotels, and daily activities..."
              rows={3}
              disabled={isLoading}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all resize-none shadow-inner"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-agent reasoning will search flights, hotels & budgets</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Planning with Agents...</span>
                </>
              ) : (
                <>
                  <span>Create Travel Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preset Prompt Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
            Or try these popular itineraries:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.query)}
                disabled={isLoading}
                className="text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all text-xs group flex items-start justify-between gap-2"
              >
                <div>
                  <span className="font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors block">
                    {preset.title}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {preset.badge}
                  </span>
                </div>
                <span className="text-slate-600 group-hover:text-cyan-400 transition-colors text-xs shrink-0 mt-0.5">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

