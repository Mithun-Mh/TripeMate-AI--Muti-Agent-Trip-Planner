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
    <div className="w-full bg-white border-2 border-[#159447]/30 hover:border-[#159447] rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 relative overflow-hidden transition-all duration-300">
      {/* Background organic shape like reference image */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#DDEEDD]/60 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-[#DDEEDD] text-[#159447]">
            <MapPin className="w-4 h-4" />
          </div>
          <label className="text-sm sm:text-base font-extrabold text-[#171717] tracking-tight">
            Where would you like to travel?
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Plan a 10-day trip from Germany to Sri Lanka for two adults with a budget of LKR 300,000 including flights, hotels, and daily activities..."
              rows={3}
              disabled={isLoading}
              className="w-full bg-[#FAFCFA] border border-[#DDEEDD] focus:border-[#159447] focus:ring-2 focus:ring-[#159447]/20 rounded-2xl px-4 py-3.5 text-sm text-[#171717] placeholder:text-slate-400 outline-none transition-all resize-none shadow-xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="text-xs text-[#525252] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F28C00]" />
              <span>Multi-agent reasoning will search live flights, hotels & budgets</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-7 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-[#F28C00] hover:bg-[#d97d00] text-white shadow-lg shadow-[#F28C00]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shrink-0 cursor-pointer"
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

        {/* Preset Prompt Cards */}
        <div className="mt-6 pt-5 border-t border-[#DDEEDD]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#525252] mb-3">
            Or choose a featured destination itinerary:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.query)}
                disabled={isLoading}
                className="text-left p-3.5 rounded-2xl bg-[#FAFCFA] hover:bg-white border border-[#DDEEDD] hover:border-[#159447] transition-all text-xs group flex items-start justify-between gap-2 shadow-xs hover:shadow-md cursor-pointer"
              >
                <div>
                  <span className="font-bold text-[#171717] group-hover:text-[#159447] transition-colors block text-xs sm:text-sm">
                    {preset.title}
                  </span>
                  <span className="text-[11px] text-[#159447] font-semibold bg-[#DDEEDD] px-2 py-0.5 rounded-full inline-block mt-1">
                    {preset.badge}
                  </span>
                </div>
                <span className="text-[#F28C00] group-hover:translate-x-0.5 transition-transform text-sm font-bold shrink-0 mt-1">
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
