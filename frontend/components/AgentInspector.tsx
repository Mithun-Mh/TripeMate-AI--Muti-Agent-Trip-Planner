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
    <div className="bg-white border border-[#DDEEDD] rounded-2xl overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#DDEEDD]/20 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#DDEEDD] text-[#159447]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#171717] block">
              Multi-Agent Graph State & Raw Output
            </span>
            <span className="text-[11px] text-[#525252]">
              Session: {response.thread_id} • {response.llm_calls || 0} Agent Invocations
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#159447]">
          <span>{isOpen ? "Hide Raw Data" : "Inspect Agent State"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-[#DDEEDD] bg-[#FAFCFA] space-y-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DDEEDD] pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("final")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "final"
                    ? "bg-[#159447] text-white shadow-xs"
                    : "text-[#525252] hover:text-[#171717] hover:bg-[#DDEEDD]/40"
                }`}
              >
                Final Plan (Agent 4)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("flights")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "flights"
                    ? "bg-[#159447] text-white shadow-xs"
                    : "text-[#525252] hover:text-[#171717] hover:bg-[#DDEEDD]/40"
                }`}
              >
                Flight Tool (Agent 1)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hotels")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "hotels"
                    ? "bg-[#159447] text-white shadow-xs"
                    : "text-[#525252] hover:text-[#171717] hover:bg-[#DDEEDD]/40"
                }`}
              >
                Tavily Search (Agent 2)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("itinerary")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "itinerary"
                    ? "bg-[#159447] text-white shadow-xs"
                    : "text-[#525252] hover:text-[#171717] hover:bg-[#DDEEDD]/40"
                }`}
              >
                Gemini Itinerary (Agent 3)
              </button>
            </div>

            <button
              type="button"
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 text-xs text-[#171717] bg-white border border-[#DDEEDD] hover:border-[#159447] px-3 py-1 rounded-lg transition-colors cursor-pointer font-semibold shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#159447]" />
                  <span className="text-[#159447]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Raw Display Box */}
          <div className="rounded-xl bg-[#171717] p-4 font-mono text-xs text-emerald-300 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-800">
            {activeTab === "final" && (response.answer || "No final answer yet.")}
            {activeTab === "flights" &&
              (response.flight_results || "No raw flight results recorded.")}
            {activeTab === "hotels" &&
              (response.hotel_results || "No raw hotel results recorded.")}
            {activeTab === "itinerary" &&
              (response.itinerary || "No raw itinerary text recorded.")}
          </div>
        </div>
      )}
    </div>
  );
}
