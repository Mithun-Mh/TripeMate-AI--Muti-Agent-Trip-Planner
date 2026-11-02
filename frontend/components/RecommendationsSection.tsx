"use client";

import React from "react";
import { Lightbulb, CheckCircle2, ShieldCheck } from "lucide-react";

interface RecommendationsSectionProps {
  recommendations: string[];
  rawText?: string;
}

export function RecommendationsSection({
  recommendations,
  rawText,
}: RecommendationsSectionProps) {
  if ((!recommendations || recommendations.length === 0) && !rawText) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
            06
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Final Recommendations & Travel Tips</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/60">
                Travel Advisor
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Crucial advice for visas, local payments, reservations, and customs
            </p>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hidden sm:block">
          <Lightbulb className="w-5 h-5" />
        </div>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((tip, idx) => {
            const boldMatch = tip.match(/^\*\*(.*?)\*\*:(.*)$/);
            const title = boldMatch ? boldMatch[1] : null;
            const desc = boldMatch ? boldMatch[2] : tip;

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/30 transition-all flex items-start gap-3"
              >
                <div className="p-1 rounded-md bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {title && (
                    <span className="font-semibold text-amber-300 block mb-0.5">
                      {title}
                    </span>
                  )}
                  <span className="text-slate-300">
                    {desc.replace(/[*_`]/g, "")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : rawText ? (
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-line">
          {rawText.replace(/[*_`]/g, "")}
        </div>
      ) : null}
    </div>
  );
}

