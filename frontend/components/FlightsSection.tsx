"use client";

import React from "react";
import { Plane, AlertCircle, Sparkles, ArrowRight } from "lucide-react";

interface FlightsSectionProps {
  content: string;
}

export function FlightsSection({ content }: FlightsSectionProps) {
  if (!content) return null;

  // Split lines to detect flight options
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs">
            02
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Flight Information</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800/60">
                Live Flight Agent
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Airlines, routes, schedules and pricing guidance
            </p>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 hidden sm:block">
          <Plane className="w-5 h-5 rotate-45" />
        </div>
      </div>

      {/* Flight Cards Container */}
      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
          {lines.map((line, idx) => {
            const isBullet = line.trim().startsWith("-") || line.trim().startsWith("*");
            const isNote = line.toLowerCase().includes("note:") || line.toLowerCase().includes("*note");

            if (isNote) {
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-3 rounded-lg bg-amber-950/20 border border-amber-800/30 text-amber-300 text-xs mt-3"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>{line.replace(/[*_`]/g, "")}</span>
                </div>
              );
            }

            if (isBullet) {
              const clean = line.replace(/^[-*•]\s*/, "");
              const boldMatch = clean.match(/^\*\*(.*?)\*\*:(.*)$/);

              return (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-sky-500/30 transition-all"
                >
                  <div className="p-1 rounded-md bg-sky-500/10 text-sky-400 shrink-0 mt-0.5">
                    <Plane className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    {boldMatch ? (
                      <>
                        <span className="font-semibold text-sky-300">
                          {boldMatch[1]}:
                        </span>
                        <span className="text-slate-300 ml-1.5">
                          {boldMatch[2].replace(/[*_`]/g, "")}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-300">
                        {clean.replace(/[*_`]/g, "")}
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <p key={idx} className="text-slate-300">
                {line.replace(/[*_`]/g, "")}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

