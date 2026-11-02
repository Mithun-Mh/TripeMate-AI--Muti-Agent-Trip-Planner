"use client";

import React from "react";
import { Hotel, Star, MapPin, Sparkles } from "lucide-react";

interface HotelsSectionProps {
  content: string;
}

export function HotelsSection({ content }: HotelsSectionProps) {
  if (!content) return null;

  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
            03
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Hotel Suggestions</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60">
                Tavily Agent
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Verified accommodation options, locations, and nightly rates
            </p>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 hidden sm:block">
          <Hotel className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {lines.map((line, idx) => {
          const clean = line.replace(/^[-*•]\s*/, "");
          const isBullet = line.trim().startsWith("-") || line.trim().startsWith("*");

          // Extract city/destination & hotel name if formatted as **Location**: Hotel
          const match = clean.match(/^\*\*(.*?)\*\*:(.*)$/);
          const locationHeader = match ? match[1] : null;
          const details = match ? match[2] : clean;

          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-purple-400 text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{locationHeader || `Option ${idx + 1}`}</span>
                  </div>
                  <div className="flex items-center text-amber-400 text-[10px]">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="ml-1 text-slate-400 font-medium">Verified</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {details.replace(/[*_`]/g, "")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

