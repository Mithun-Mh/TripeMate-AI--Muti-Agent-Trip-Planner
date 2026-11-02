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
    <div className="bg-white border-2 border-[#159447]/30 rounded-3xl p-6 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#DDEEDD] text-[#159447] flex items-center justify-center font-extrabold text-xs">
            06
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#171717] flex items-center gap-2">
              <span>Final Recommendations & Travel Tips</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDEEDD] text-[#159447] border border-[#159447]/20">
                Travel Advisor
              </span>
            </h2>
            <p className="text-xs text-[#525252]">
              Crucial advice for visas, local payments, reservations, and customs
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#DDEEDD] text-[#159447] hidden sm:block">
          <Lightbulb className="w-5 h-5" />
        </div>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {recommendations.map((tip, idx) => {
            const boldMatch = tip.match(/^\*\*(.*?)\*\*:(.*)$/);
            const title = boldMatch ? boldMatch[1] : null;
            const desc = boldMatch ? boldMatch[2] : tip;

            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-[#FAFCFA] border border-[#DDEEDD] hover:border-[#159447] transition-all flex items-start gap-3.5 shadow-xs hover:shadow-md"
              >
                <div className="p-2 rounded-xl bg-[#DDEEDD] text-[#159447] shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs sm:text-sm text-[#171717] leading-relaxed">
                  {title && (
                    <span className="font-extrabold text-[#171717] block mb-1">
                      {title}
                    </span>
                  )}
                  <span className="text-[#525252] font-medium">{desc.replace(/\*\*/g, "")}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : rawText ? (
        <div className="p-4 rounded-2xl bg-[#FAFCFA] border border-[#DDEEDD] text-xs sm:text-sm text-[#171717] leading-relaxed whitespace-pre-line font-medium">
          {rawText}
        </div>
      ) : null}
    </div>
  );
}
