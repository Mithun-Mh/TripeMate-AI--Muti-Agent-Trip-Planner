"use client";

import React from "react";
import { Plane, Hotel, CalendarDays, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface AgentFlowVisualizerProps {
  isLoading: boolean;
  activeStage?: number; // 1 to 4
  hasResult: boolean;
  llmCalls?: number;
}

export function AgentFlowVisualizer({
  isLoading,
  activeStage = 1,
  hasResult,
  llmCalls,
}: AgentFlowVisualizerProps) {
  const agents = [
    {
      id: 1,
      name: "Flight Agent",
      role: "Live Flights",
      icon: Plane,
      color: "from-[#159447] to-emerald-600",
      activeBorder: "border-[#F28C00] text-[#171717] bg-orange-50",
      iconBg: "bg-[#DDEEDD] text-[#159447]",
    },
    {
      id: 2,
      name: "Hotel Agent",
      role: "Tavily Search",
      icon: Hotel,
      color: "from-[#159447] to-teal-600",
      activeBorder: "border-[#F28C00] text-[#171717] bg-orange-50",
      iconBg: "bg-[#DDEEDD] text-[#159447]",
    },
    {
      id: 3,
      name: "Itinerary Agent",
      role: "Gemini 3.8",
      icon: CalendarDays,
      color: "from-[#F28C00] to-amber-600",
      activeBorder: "border-[#F28C00] text-[#171717] bg-orange-50",
      iconBg: "bg-orange-100 text-[#F28C00]",
    },
    {
      id: 4,
      name: "Final Agent",
      role: "Budget & Tips",
      icon: Sparkles,
      color: "from-[#159447] to-[#F28C00]",
      activeBorder: "border-[#F28C00] text-[#171717] bg-orange-50",
      iconBg: "bg-[#DDEEDD] text-[#159447]",
    },
  ];

  return (
    <div className="w-full bg-white border border-[#DDEEDD] rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#171717] flex items-center gap-2">
            <span>LangGraph Multi-Agent Architecture</span>
            {hasResult && (
              <span className="text-[10px] text-[#159447] bg-[#DDEEDD] border border-[#159447]/30 px-2.5 py-0.5 rounded-full font-bold">
                Workflow Completed
              </span>
            )}
          </h3>
          <p className="text-xs text-[#525252]">
            Coordinated execution across specialized flight, hotel, itinerary & budget agents
          </p>
        </div>

        {llmCalls !== undefined && llmCalls > 0 && (
          <div className="text-xs text-[#525252] bg-[#FAFCFA] px-3 py-1 rounded-full border border-[#DDEEDD] w-fit font-medium">
            <span>Agent Steps: </span>
            <span className="font-extrabold text-[#159447]">{llmCalls} invocations</span>
          </div>
        )}
      </div>

      {/* Grid of Agents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isDone = hasResult && !isLoading;
          const isCurrent = isLoading && activeStage === agent.id;
          const isPast = (isLoading && activeStage > agent.id) || isDone;

          return (
            <div
              key={agent.id}
              className={`relative rounded-xl p-3.5 border transition-all duration-300 flex items-start gap-3 ${
                isCurrent
                  ? `border-2 border-[#F28C00] bg-orange-50/60 shadow-md ring-2 ring-[#F28C00]/20 scale-[1.02]`
                  : isPast
                  ? "border-[#159447]/30 bg-[#DDEEDD]/30 text-[#171717]"
                  : "border-slate-100 bg-[#FAFCFA] text-slate-400"
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  isCurrent
                    ? "bg-[#F28C00] text-white"
                    : isPast
                    ? "bg-[#159447] text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`font-bold text-xs truncate ${
                      isCurrent || isPast ? "text-[#171717]" : "text-slate-400"
                    }`}
                  >
                    {agent.name}
                  </span>

                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#159447] shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#F28C00] animate-spin shrink-0" />
                  ) : null}
                </div>

                <span className="text-[11px] text-[#525252] block truncate mt-0.5">
                  {agent.role}
                </span>

                <div className="mt-2 w-full bg-slate-200/60 rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isDone
                        ? "w-full bg-[#159447]"
                        : isCurrent
                        ? "w-2/3 bg-[#F28C00] animate-pulse"
                        : isPast
                        ? "w-full bg-[#159447]"
                        : "w-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
