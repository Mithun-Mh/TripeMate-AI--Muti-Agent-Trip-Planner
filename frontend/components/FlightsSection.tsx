"use client";

import React from "react";
import { Plane, AlertCircle } from "lucide-react";

interface FlightsSectionProps {
  content: string;
}

export function FlightsSection({ content }: FlightsSectionProps) {
  if (!content) return null;

  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

  return (
    <div className="bg-white border-2 border-[#159447]/30 rounded-3xl p-6 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#DDEEDD] text-[#159447] flex items-center justify-center font-extrabold text-xs">
            02
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#171717] flex items-center gap-2">
              <span>Flight Information</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDEEDD] text-[#159447] border border-[#159447]/20">
                Live Flight Agent
              </span>
            </h2>
            <p className="text-xs text-[#525252]">
              Airlines, routes, schedules and pricing guidance
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#DDEEDD] text-[#159447] hidden sm:block">
          <Plane className="w-5 h-5 rotate-45" />
        </div>
      </div>

      {/* Flight Cards Container */}
      <div className="space-y-3">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFCFA] border border-[#DDEEDD] text-xs sm:text-sm text-[#171717] leading-relaxed whitespace-pre-line space-y-2">
          {lines.map((line, idx) => {
            const isBullet = line.trim().startsWith("-") || line.trim().startsWith("*");
            const isNote = line.toLowerCase().includes("note:") || line.toLowerCase().includes("*note");

            if (isNote) {
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs mt-3 font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#F28C00]" />
                  <span>{line.replace(/[*_`]/g, "")}</span>
                </div>
              );
            }

            if (isBullet) {
              return (
                <div key={idx} className="flex items-start gap-2 pl-2">
                  <span className="text-[#159447] font-bold">•</span>
                  <span className="text-[#171717]">{line.replace(/^[-*]\s*/, "")}</span>
                </div>
              );
            }

            // Headings / Flight details
            if (line.includes("Airline:") || line.includes("Flight:")) {
              return (
                <div key={idx} className="font-extrabold text-[#171717] text-sm pt-2 border-t border-[#DDEEDD] first:border-0 first:pt-0">
                  {line}
                </div>
              );
            }

            return (
              <div key={idx} className="text-[#525252]">
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
