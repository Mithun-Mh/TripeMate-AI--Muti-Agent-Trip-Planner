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
    <div className="bg-white border-2 border-[#159447]/30 rounded-3xl p-6 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#DDEEDD] text-[#159447] flex items-center justify-center font-extrabold text-xs">
            04
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#171717] flex items-center gap-2">
              <span>Day-by-Day Itinerary</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDEEDD] text-[#159447] border border-[#159447]/20">
                Itinerary Agent
              </span>
            </h2>
            <p className="text-xs text-[#525252]">
              Detailed daily schedule with attractions, transit, and stays
            </p>
          </div>
        </div>

        <div className="text-xs text-[#525252] bg-[#FAFCFA] px-3.5 py-1.5 rounded-full border border-[#DDEEDD] self-start sm:self-auto font-medium">
          <span>Total: </span>
          <span className="font-extrabold text-[#159447]">{days.length} Days Planned</span>
        </div>
      </div>

      {/* Days Stack */}
      <div className="space-y-3.5">
        {days.map((day) => {
          const isExpanded = expandedDay === day.dayNumber || expandedDay === null;

          return (
            <div
              key={day.dayNumber}
              className="border border-[#DDEEDD] hover:border-[#159447] rounded-2xl bg-[#FAFCFA] overflow-hidden transition-all duration-200"
            >
              {/* Day Header Accordion Toggle */}
              <button
                type="button"
                onClick={() => toggleDay(day.dayNumber)}
                className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-[#DDEEDD]/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="px-3 py-1 rounded-xl bg-[#159447] text-white font-extrabold text-xs tracking-tight shrink-0 shadow-sm shadow-[#159447]/20">
                    DAY {day.dayNumber}
                  </div>
                  <span className="font-extrabold text-sm sm:text-base text-[#171717] truncate">
                    {day.title || `Day ${day.dayNumber} Itinerary`}
                  </span>
                </div>

                <div className="p-1.5 rounded-lg bg-white border border-[#DDEEDD] text-[#525252] shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#159447]" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Day Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 space-y-3 border-t border-[#DDEEDD]/60 bg-white">
                  {day.destination && (
                    <div className="flex items-center gap-2 text-xs font-bold text-[#159447]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{day.destination}</span>
                    </div>
                  )}

                  {/* Structured Details if available */}
                  {day.activities && (
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <div className="p-1 rounded-md bg-[#DDEEDD] text-[#159447] shrink-0 mt-0.5">
                        <Compass className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[#171717] leading-relaxed">
                        <span className="font-bold text-[#159447] mr-1.5">
                          Activities & Sightseeing:
                        </span>
                        {day.activities}
                      </div>
                    </div>
                  )}

                  {day.transport && (
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <div className="p-1 rounded-md bg-orange-100 text-[#F28C00] shrink-0 mt-0.5">
                        <Car className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[#171717] leading-relaxed">
                        <span className="font-bold text-[#F28C00] mr-1.5">
                          Transportation:
                        </span>
                        {day.transport}
                      </div>
                    </div>
                  )}

                  {day.accommodation && (
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <div className="p-1 rounded-md bg-[#DDEEDD] text-[#159447] shrink-0 mt-0.5">
                        <Hotel className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[#171717] leading-relaxed">
                        <span className="font-bold text-[#159447] mr-1.5">
                          Accommodation:
                        </span>
                        {day.accommodation}
                      </div>
                    </div>
                  )}

                  {/* Fallback to raw day text if no structured fields */}
                  {!day.activities && !day.transport && !day.accommodation && (
                    <div className="text-xs sm:text-sm text-[#171717] leading-relaxed whitespace-pre-line pl-1 font-medium">
                      {day.rawText}
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
