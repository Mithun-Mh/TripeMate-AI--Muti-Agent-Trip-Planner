"use client";

import React, { useState } from "react";
import { DayItinerary } from "@/lib/types";
import {
  CalendarDays,
  MapPin,
  Compass,
  Car,
  Hotel,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface DayByDaySectionProps {
  days: DayItinerary[];
}

export function DayByDaySection({ days }: DayByDaySectionProps) {
  if (!days || days.length === 0) return null;

  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const toggleDay = (dayNum: number) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
            04
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Day-by-Day Itinerary</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/60">
                Gemini 3.8 Agent
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Detailed daily schedule with attractions, transit, and stays
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
          <span>Total: </span>
          <span className="font-semibold text-amber-400">{days.length} Days Planned</span>
        </div>
      </div>

      {/* Days Stack */}
      <div className="space-y-3.5">
        {days.map((day) => {
          const isExpanded = expandedDay === day.dayNumber || expandedDay === null;

          return (
            <div
              key={day.dayNumber}
              className="rounded-xl border border-slate-800/80 bg-slate-950/50 hover:border-amber-500/40 transition-all overflow-hidden"
            >
              {/* Day Header Bar */}
              <button
                type="button"
                onClick={() => toggleDay(day.dayNumber)}
                className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left transition-colors hover:bg-slate-900/40"
              >
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold shrink-0 tracking-wider">
                    DAY {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-100">
                    {day.title}
                  </span>
                </div>

                <div className="text-slate-500 hover:text-slate-300 transition-colors ml-2 shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Day Body */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-slate-800/40 space-y-3">
                  {/* Structured sub-badges if parsed */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
                    {day.destination && (
                      <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-800/30 text-xs">
                        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Destination</span>
                        </div>
                        <p className="text-slate-200 text-[11px] leading-snug">
                          {day.destination}
                        </p>
                      </div>
                    )}

                    {day.activities && (
                      <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs sm:col-span-2">
                        <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                          <Compass className="w-3.5 h-3.5" />
                          <span>Activities & Highlights</span>
                        </div>
                        <p className="text-slate-200 text-[11px] leading-snug">
                          {day.activities}
                        </p>
                      </div>
                    )}

                    {day.transport && (
                      <div className="p-2.5 rounded-lg bg-sky-950/20 border border-sky-800/30 text-xs">
                        <div className="flex items-center gap-1.5 text-sky-400 font-semibold mb-1">
                          <Car className="w-3.5 h-3.5" />
                          <span>Transportation</span>
                        </div>
                        <p className="text-slate-200 text-[11px] leading-snug">
                          {day.transport}
                        </p>
                      </div>
                    )}

                    {day.accommodation && (
                      <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-800/30 text-xs sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                          <Hotel className="w-3.5 h-3.5" />
                          <span>Stay / Hotel</span>
                        </div>
                        <p className="text-slate-200 text-[11px] leading-snug">
                          {day.accommodation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Complete Day Text if no sub-badges or for full details */}
                  {(!day.destination && !day.activities) && (
                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line pt-1">
                      {day.rawText.replace(/[*_`]/g, "")}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

