"use client";

import React from "react";
import { Plane, AlertCircle, Clock, Luggage, Tag, CheckCircle2, ArrowRight } from "lucide-react";

interface FlightsSectionProps {
  content: string;
}

interface ParsedFlightOption {
  title: string;
  carrier: string;
  duration?: string;
  fare?: string;
  inclusions?: string;
}

export function FlightsSection({ content }: FlightsSectionProps) {
  if (!content) return null;

  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

  let primaryRoute: string | null = null;
  const options: ParsedFlightOption[] = [];
  const notes: string[] = [];
  const fallbackLines: string[] = [];
  let currentOption: ParsedFlightOption | null = null;

  for (const line of lines) {
    const clean = line.trim().replace(/^[-*•]\s*/, "");

    if (clean.toLowerCase().includes("primary flight route:") || clean.toLowerCase().startsWith("route:")) {
      primaryRoute = clean.replace(/^.*?(?:primary flight route|route):\s*/i, "").replace(/[*_`]/g, "").trim();
      continue;
    }

    const optMatch = clean.match(/^\*\*(.*?Option \d+[^:]*?):?\*\*:?\s*(.*)$/i);
    if (optMatch) {
      if (currentOption) options.push(currentOption);
      currentOption = {
        title: optMatch[1].replace(/[:*]/g, "").trim(),
        carrier: optMatch[2].replace(/[*_]/g, "").trim() || "Recommended Carrier",
      };
      continue;
    }

    if (currentOption) {
      const durMatch = clean.match(/^\*?\*?(?:flight duration|duration)\*?\*?:\s*(.*)$/i);
      const fareMatch = clean.match(/^\*?\*?(?:estimated fare|fare|price|cost)\*?\*?:\s*(.*)$/i);
      const incMatch = clean.match(/^\*?\*?(?:inclusions|baggage|included)\*?\*?:\s*(.*)$/i);

      if (durMatch) {
        currentOption.duration = durMatch[1].replace(/[*_]/g, "").trim();
        continue;
      }
      if (fareMatch) {
        currentOption.fare = fareMatch[1].replace(/[*_]/g, "").trim();
        continue;
      }
      if (incMatch) {
        currentOption.inclusions = incMatch[1].replace(/[*_]/g, "").trim();
        continue;
      }
    }

    if (
      clean.toLowerCase().includes("advisory") ||
      clean.toLowerCase().includes("note:") ||
      clean.toLowerCase().startsWith("*note") ||
      clean.startsWith("Secure") ||
      clean.startsWith("Check live")
    ) {
      notes.push(clean.replace(/[*_`]/g, ""));
      continue;
    }

    fallbackLines.push(line);
  }

  if (currentOption) {
    options.push(currentOption);
  }

  const hasStructuredOptions = options.length > 0;

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

      <div className="space-y-4">
        {/* Route Header Banner */}
        {primaryRoute && (
          <div className="p-4 rounded-2xl bg-[#DDEEDD]/40 border border-[#159447]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold text-[#171717]">
              <Plane className="w-4 h-4 text-[#159447] shrink-0" />
              <span>{primaryRoute}</span>
            </div>
            <div className="text-[11px] font-semibold text-[#159447] bg-white px-3 py-1 rounded-full border border-[#159447]/20 shadow-2xs self-start sm:self-auto">
              Monitored Corridor
            </div>
          </div>
        )}

        {/* Structured Options Grid */}
        {hasStructuredOptions ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {options.map((opt, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-[#FAFCFA] hover:bg-white border border-[#DDEEDD] hover:border-[#159447] transition-all flex flex-col justify-between shadow-xs hover:shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDEEDD] text-[#159447] border border-[#159447]/20">
                      {opt.title}
                    </span>
                    <span className="text-[11px] font-extrabold text-[#F28C00] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      Verified Route
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-[#171717] mt-1 mb-3">
                    {opt.carrier}
                  </h3>

                  <div className="space-y-2 text-xs text-[#525252]">
                    {opt.duration && (
                      <div className="flex items-center gap-2 text-[#171717]">
                        <Clock className="w-3.5 h-3.5 text-[#159447] shrink-0" />
                        <span className="font-medium">{opt.duration}</span>
                      </div>
                    )}

                    {opt.fare && (
                      <div className="flex items-center gap-2 text-[#159447] font-bold">
                        <Tag className="w-3.5 h-3.5 text-[#F28C00] shrink-0" />
                        <span>{opt.fare}</span>
                      </div>
                    )}

                    {opt.inclusions && (
                      <div className="flex items-start gap-2 text-[#525252]">
                        <Luggage className="w-3.5 h-3.5 text-[#525252] shrink-0 mt-0.5" />
                        <span className="leading-tight">{opt.inclusions}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#DDEEDD] flex items-center justify-between text-[11px]">
                  <span className="text-[#525252] font-medium">Standard Economy</span>
                  <span className="text-[#159447] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Direct / Partner Route</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Fallback for raw / unparsed lines */
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFCFA] border border-[#DDEEDD] text-xs sm:text-sm text-[#171717] leading-relaxed whitespace-pre-line space-y-2">
            {fallbackLines.map((line, idx) => {
              const isBullet = line.trim().startsWith("-") || line.trim().startsWith("*");
              if (isBullet) {
                return (
                  <div key={idx} className="flex items-start gap-2 pl-2">
                    <span className="text-[#159447] font-bold">•</span>
                    <span className="text-[#171717]">{line.replace(/^[-*]\s*/, "")}</span>
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
        )}

        {/* Flight Notes & Booking Advisory */}
        {notes.length > 0 && (
          <div className="p-3.5 rounded-xl bg-orange-50/80 border border-orange-200 text-orange-950 text-xs space-y-1.5 font-medium">
            <div className="flex items-center gap-1.5 font-bold text-[#F28C00]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Flight Booking Guidance:</span>
            </div>
            {notes.map((note, nIdx) => (
              <div key={nIdx} className="flex items-start gap-2 pl-1 text-[11px] sm:text-xs text-orange-900/90 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#159447] shrink-0 mt-0.5" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
