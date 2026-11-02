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
      color: "text-cyan-400 bg-cyan-950/40 border-cyan-800/40",
      iconColor: "text-cyan-400",
    },
    {
      label: "Departure Origin",
      value: summary.origin,
      icon: PlaneTakeoff,
      color: "text-sky-400 bg-sky-950/40 border-sky-800/40",
      iconColor: "text-sky-400",
    },
    {
      label: "Trip Duration",
      value: summary.duration,
      icon: Clock,
      color: "text-indigo-400 bg-indigo-950/40 border-indigo-800/40",
      iconColor: "text-indigo-400",
    },
    {
      label: "Travelers",
      value: summary.travelers,
      icon: Users,
      color: "text-purple-400 bg-purple-950/40 border-purple-800/40",
      iconColor: "text-purple-400",
    },
    {
      label: "Target Budget",
      value: summary.budget,
      icon: Wallet,
      color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
      iconColor: "text-emerald-400",
    },
    {
      label: "Travel Focus",
      value: summary.style,
      icon: Compass,
      color: "text-amber-400 bg-amber-950/40 border-amber-800/40",
      iconColor: "text-amber-400",
    },
  ].filter((c) => Boolean(c.value));

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">
          01
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            Trip Summary & Overview
          </h2>
          <p className="text-xs text-slate-400">
            Synthesized travel parameters from your planner request
          </p>
        </div>
      </div>

      {/* Grid of Key Info Cards */}
      {cards.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.02] ${card.color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {card.label}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
                </div>
                <div className="text-xs font-semibold text-slate-100 line-clamp-2">
                  {card.value}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Narrative overview if present */}
      {summary.otherText && (
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
          {summary.otherText}
        </div>
      )}
    </div>
  );
}

