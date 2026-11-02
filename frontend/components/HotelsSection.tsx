"use client";

import React from "react";
import { Hotel, Star, MapPin } from "lucide-react";

interface HotelsSectionProps {
  content: string;
}

export function HotelsSection({ content }: HotelsSectionProps) {
  if (!content) return null;

  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

  return (
    <div className="bg-white border-2 border-[#159447]/30 rounded-3xl p-6 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#DDEEDD] text-[#159447] flex items-center justify-center font-extrabold text-xs">
            03
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#171717] flex items-center gap-2">
              <span>Hotel Suggestions</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDEEDD] text-[#159447] border border-[#159447]/20">
                Tavily Agent
              </span>
            </h2>
            <p className="text-xs text-[#525252]">
              Verified accommodation options, locations, and nightly rates
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#DDEEDD] text-[#159447] hidden sm:block">
          <Hotel className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {lines.map((line, idx) => {
          const clean = line.replace(/^[-*•]\s*/, "");

          // Extract city/destination & hotel name if formatted as **Location**: Hotel
          const match = clean.match(/^\*\*(.*?)\*\*:(.*)$/);
          const locationHeader = match ? match[1] : null;
          const details = match ? match[2] : clean;

          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-[#FAFCFA] hover:bg-white border border-[#DDEEDD] hover:border-[#159447] transition-all flex flex-col justify-between shadow-xs hover:shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-[#159447] text-xs font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{locationHeader || `Option ${idx + 1}`}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#F28C00] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Recommended</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#171717] leading-relaxed font-medium">
                  {details.replace(/\*\*/g, "")}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#DDEEDD] flex items-center justify-between text-[11px] text-[#525252]">
                <span className="font-semibold text-[#159447]">Verified via Tavily</span>
                <span className="font-bold text-[#F28C00]">Best Available Rate</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
