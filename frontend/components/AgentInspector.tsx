"use client";

import React, { useState } from "react";
import { TravelResponse } from "@/lib/types";
import { Code2, Copy, Check, ChevronDown, ChevronUp, Terminal } from "lucide-react";

interface AgentInspectorProps {
  response: TravelResponse;
}

export function AgentInspector({ response }: AgentInspectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"final" | "flights" | "hotels" | "itinerary">("final");

  const copyToClipboard = () => {
    let content = response.answer;
    if (activeTab === "flights") content = response.flight_results || "";
    if (activeTab === "hotels") content = response.hotel_results || "";
    if (activeTab === "itinerary") content = response.itinerary || "";

    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-200 block">
              Multi-Agent Graph State & Raw Output
            </span>
            <span className="text-[11px] text-slate-400">
              Session: {response.thread_id} • {response.llm_calls || 0} Agent Invocations
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{isOpen ? "Hide Raw Data" : "Inspect Agent State"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("final")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "final"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                Final Response (Agent 4)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("flights")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "flights"
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                Flight Results (Agent 1)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hotels")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "hotels"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                Hotel Results (Agent 2)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("itinerary")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "itinerary"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                Itinerary Draft (Agent 3)
              </button>
            </div>

            <button
              type="button"
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/60 hover:border-slate-600 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>

          {/* Raw Text Output */}
          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-mono leading-relaxed overflow-x-auto max-h-96 whitespace-pre-wrap">
              {activeTab === "final" && response.answer}
              {activeTab === "flights" && (response.flight_results || "No flight results in state.")}
              {activeTab === "hotels" && (response.hotel_results || "No hotel results in state.")}
              {activeTab === "itinerary" && (response.itinerary || "No itinerary draft in state.")}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

