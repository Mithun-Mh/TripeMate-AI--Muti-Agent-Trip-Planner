"use client";

import React from "react";
import { TripSummaryData } from "@/lib/types";
import { MapPin, PlaneTakeoff, Clock, Users, Wallet, Compass } from "lucide-react";

interface TripSummaryCardProps {
  summary: TripSummaryData;
}

export function TripSummaryCard({ summary }: TripSummaryCardProps) {
  const cards = [
    {
      label: "Destination",
      value: summary.destination,
      icon: MapPin,
      iconColor: "text-[#159447]",
    },
    {
      label: "Departure Origin",
      value: summary.origin,
      icon: PlaneTakeoff,
      iconColor: "text-[#F28C00]",
    },
    {
      label: "Trip Duration",
      value: summary.duration,
      icon: Clock,
      iconColor: "text-[#159447]",
    },
    {
      label: "Travelers",
      value: summary.travelers,
      icon: Users,
      iconColor: "text-[#F28C00]",
    },
    {
      label: "Target Budget",
      value: summary.budget,
      icon: Wallet,
      iconColor: "text-[#159447]",
    },
    {
      label: "Travel Focus",
      value: summary.style,
      icon: Compass,
      iconColor: "text-[#F28C00]",
    },
  ].filter((c) => Boolean(c.value));

  return (
    <div className="bg-white border-2 border-[#159447]/30 rounded-3xl p-6 sm:p-7 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#DDEEDD] text-[#159447] flex items-center justify-center font-extrabold text-xs">
          01
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-[#171717] tracking-tight">
            Trip Summary & Overview
          </h2>
          <p className="text-xs text-[#525252]">
            Key itinerary parameters extracted by TripMate AI
          </p>
        </div>
      </div>

      {/* Grid of Key Info Cards (Styled like the reference screenshot's floating pill badge) */}
      {cards.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAFCFA] border border-[#DDEEDD] hover:border-[#159447] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#159447]">
                    {card.label}
                  </span>
                  <div className="p-1 rounded-md bg-white border border-[#DDEEDD]">
                    <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-[#171717] line-clamp-2">
                  {card.value}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Narrative overview if present */}
      {summary.otherText && (
        <div className="mt-4 p-4 rounded-2xl bg-[#FBFDFB] border border-[#DDEEDD] text-xs text-[#525252] leading-relaxed whitespace-pre-line">
          {summary.otherText}
        </div>
      )}
    </div>
  );
}
