"use client";

import React, { useState, useEffect } from "react";
import { Compass, Sparkles, Server, CheckCircle2, AlertCircle, FileDown } from "lucide-react";

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
    <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                TripMate <span className="text-cyan-400 font-extrabold">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                Multi-Agent
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              LangGraph • Gemini 3.8 • Live Flights & Hotels
            </p>
          </div>
        </div>

        {/* Action badges & Status */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Real-time FastAPI Status Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              className={`flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all ${
                backendStatus === "online"
                  ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                  : backendStatus === "offline"
                  ? "bg-amber-950/40 border-amber-800/60 text-amber-300 hover:border-amber-700"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {backendStatus === "online" && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                {backendStatus === "offline" && (
                  <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    backendStatus === "online"
                      ? "bg-emerald-500"
                      : backendStatus === "offline"
                      ? "bg-amber-500"
                      : "bg-slate-500"
                  }`}
                ></span>
              </span>
              <span className="font-medium text-[11px] whitespace-nowrap">
                {backendStatus === "online"
                  ? "FastAPI Connected"
                  : backendStatus === "offline"
                  ? "FastAPI Offline"
                  : "Checking API..."}
              </span>
            </button>

            {/* Status Tooltip popup */}
            {showTooltip && (
              <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 text-xs text-slate-300 animate-in fade-in duration-200">
                <div className="font-semibold text-slate-100 flex items-center gap-1.5 mb-1">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  <span>FastAPI Endpoint: /api/plan</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {backendStatus === "online"
                    ? "Next.js is successfully communicating with the FastAPI backend at http://127.0.0.1:8000."
                    : "FastAPI is not currently responding. Start it with:"}
                </p>
                {backendStatus === "offline" && (
                  <code className="block mt-2 p-1.5 rounded bg-slate-950 font-mono text-[10px] text-cyan-300 border border-slate-800 select-all">
                    cd backend && uvicorn app:app --reload
                  </code>
                )}
              </div>
            )}
          </div>

          {hasPlan && onDownloadPDF && (
            <button
              onClick={onDownloadPDF}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Download comprehensive TripMate AI PDF Dossier"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          )}

          <button
            onClick={onLoadDemo}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-all shadow-sm hover:border-cyan-500/40 active:scale-95 disabled:opacity-50"
            title="Load instant pre-computed demo itinerary"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Load Sample Plan</span>
            <span className="sm:hidden">Sample</span>
          </button>
        </div>
      </div>
    </header>
  );
}
