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
      color: "from-sky-500 to-blue-600",
      activeBorder: "border-sky-500 text-sky-400 bg-sky-950/40",
      iconBg: "bg-sky-500/10 text-sky-400",
    },
    {
      id: 2,
      name: "Hotel Agent",
      role: "Tavily Search",
      icon: Hotel,
      color: "from-purple-500 to-pink-600",
      activeBorder: "border-purple-500 text-purple-400 bg-purple-950/40",
      iconBg: "bg-purple-500/10 text-purple-400",
    },
    {
      id: 3,
      name: "Itinerary Agent",
      role: "Gemini 3.8",
      icon: CalendarDays,
      color: "from-amber-500 to-orange-600",
      activeBorder: "border-amber-500 text-amber-400 bg-amber-950/40",
      iconBg: "bg-amber-500/10 text-amber-400",
    },
    {
      id: 4,
      name: "Final Agent",
      role: "Budget & Tips",
      icon: Sparkles,
      color: "from-emerald-500 to-teal-600",
      activeBorder: "border-emerald-500 text-emerald-400 bg-emerald-950/40",
      iconBg: "bg-emerald-500/10 text-emerald-400",
    },
  ];

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>LangGraph Multi-Agent Architecture</span>
            {hasResult && (
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full font-medium">
                Workflow Completed
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500">
            Sequential state graph coordination across specialized tools & models
          </p>
        </div>

        {llmCalls !== undefined && llmCalls > 0 && (
          <div className="text-xs text-slate-400 bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-800 w-fit">
            <span className="text-slate-500">Agent Invocations: </span>
            <span className="font-semibold text-cyan-400">{llmCalls} steps</span>
          </div>
        )}
      </div>

      {/* Grid of Agents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          const isDone = hasResult && !isLoading;
          const isCurrent = isLoading && activeStage === agent.id;
          const isPast = (isLoading && activeStage > agent.id) || isDone;

          return (
            <div
              key={agent.id}
              className={`relative rounded-xl p-3.5 border transition-all duration-300 flex items-start gap-3 ${
                isCurrent
                  ? `${agent.activeBorder} shadow-lg shadow-cyan-950/50 scale-[1.02]`
                  : isPast
                  ? "border-emerald-500/30 bg-emerald-950/10 text-slate-200"
                  : "border-slate-800/80 bg-slate-950/30 text-slate-500"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isCurrent
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                    : isPast
                    ? "bg-emerald-500/20 text-emerald-400"
                    : agent.iconBg
                }`}
              >
                {isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isPast ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {agent.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    0{agent.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {agent.role}
                </p>

                {isCurrent && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="text-[10px] text-cyan-400 font-medium">Running...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

