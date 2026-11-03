"use client";

import React, { useState, useEffect } from "react";
import { Compass, Sparkles, Server, CheckCircle2, AlertCircle, FileDown, ChevronDown } from "lucide-react";

interface HeaderProps {
  onLoadDemo: () => void;
  isLoading: boolean;
  onDownloadPDF?: () => void;
  hasPlan?: boolean;
}

export function Header({ onLoadDemo, isLoading, onDownloadPDF, hasPlan }: HeaderProps) {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        if (isMounted) {
          setBackendStatus(data.connected ? "online" : "offline");
        }
      } catch {
        if (isMounted) {
          setBackendStatus("offline");
        }
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="border-b border-[#DDEEDD] bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#159447] flex items-center justify-center shadow-md shadow-[#159447]/25 ring-2 ring-[#DDEEDD]">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#171717] flex items-center gap-1">
                TripMate <span className="text-[#159447]">AI</span>
                <span className="w-2 h-2 rounded-full bg-[#F28C00] inline-block mb-1"></span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDEEDD] text-[#159447] border border-[#159447]/20">
                Multi-Agent
              </span>
            </div>
           
          </div>
        </div>

        {/* Travel Navigation Pill Links (matching reference theme) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#525252]">
          <div className="flex items-center gap-1 text-[#171717] border-b-2 border-[#F28C00] pb-1 cursor-pointer">
            <span>Planner</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#F28C00]" />
          </div>
          <span className="hover:text-[#159447] transition-colors cursor-pointer">Destinations</span>
          <span className="hover:text-[#159447] transition-colors cursor-pointer">How Agents Work</span>
          <span className="hover:text-[#159447] transition-colors cursor-pointer">About Us</span>
        </nav>

        {/* Action badges & Status */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Real-time FastAPI Status Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              className={`flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-full border transition-all ${
                backendStatus === "online"
                  ? "bg-[#DDEEDD] border-[#159447]/40 text-[#159447]"
                  : backendStatus === "offline"
                  ? "bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-400"
                  : "bg-slate-50 border-slate-200 text-slate-500"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {backendStatus === "online" && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#159447] opacity-75"></span>
                )}
                {backendStatus === "offline" && (
                  <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    backendStatus === "online"
                      ? "bg-[#159447]"
                      : backendStatus === "offline"
                      ? "bg-amber-500"
                      : "bg-slate-400"
                  }`}
                ></span>
              </span>
              <span className="font-bold text-[11px] whitespace-nowrap">
                {backendStatus === "online"
                  ? "FastAPI Connected"
                  : backendStatus === "offline"
                  ? "FastAPI Offline"
                  : "Checking API..."}
              </span>
            </button>

            {/* Status Tooltip popup */}
            {showTooltip && (
              <div className="absolute right-0 top-full mt-2 w-72 p-3.5 bg-white border border-[#DDEEDD] rounded-2xl shadow-xl z-50 text-xs text-[#171717] animate-in fade-in duration-200">
                <div className="font-bold text-[#171717] flex items-center gap-1.5 mb-1">
                  <Server className="w-3.5 h-3.5 text-[#159447]" />
                  <span>FastAPI Endpoint: /api/plan</span>
                </div>
                <p className="text-[11px] text-[#525252] leading-relaxed">
                  {backendStatus === "online"
                    ? "Next.js is successfully communicating with the FastAPI backend at http://127.0.0.1:8000."
                    : "FastAPI is not currently responding. Start it with:"}
                </p>
                {backendStatus === "offline" && (
                  <code className="block mt-2 p-2 rounded-xl bg-[#FAFCFA] font-mono text-[10px] text-[#159447] border border-[#DDEEDD] select-all font-semibold">
                    cd backend && uvicorn app:app --reload
                  </code>
                )}
              </div>
            )}
          </div>

          {/* Export PDF Button */}
          {hasPlan && onDownloadPDF && (
            <button
              onClick={onDownloadPDF}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#F28C00] hover:bg-[#d97d00] text-white shadow-md shadow-[#F28C00]/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Download comprehensive TripMate AI PDF Dossier"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          )}

          {/* Load Sample Plan Button */}
          <button
            onClick={onLoadDemo}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#DDEEDD]/30 text-[#171717] border border-[#DDEEDD] hover:border-[#159447] transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Load instant pre-computed demo itinerary"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F28C00]" />
            <span className="hidden sm:inline">Sample Plan</span>
            <span className="sm:hidden">Sample</span>
          </button>
        </div>
      </div>
    </header>
  );
}
