"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { TripInputForm } from "@/components/TripInputForm";
import { AgentFlowVisualizer } from "@/components/AgentFlowVisualizer";
import { TripSummaryCard } from "@/components/TripSummaryCard";
import { FlightsSection } from "@/components/FlightsSection";
import { HotelsSection } from "@/components/HotelsSection";
import { DayByDaySection } from "@/components/DayByDaySection";
import { BudgetSection } from "@/components/BudgetSection";
import { RecommendationsSection } from "@/components/RecommendationsSection";
import { AgentInspector } from "@/components/AgentInspector";
import { TravelResponse, ParsedTravelPlan } from "@/lib/types";
import { parseTravelPlan } from "@/lib/parser";
import { SAMPLE_TRAVEL_RESPONSE } from "@/lib/samplePlan";
import { generateTravelPlanPDF } from "@/lib/pdfGenerator";
import {
  Compass,
  Plane,
  Hotel,
  CalendarDays,
  Wallet,
  Lightbulb,
  Layers,
  Sparkles,
  AlertTriangle,
  FileDown,
} from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeStage, setActiveStage] = useState(1);
  const [response, setResponse] = useState<TravelResponse | null>(null);
  const [parsedPlan, setParsedPlan] = useState<ParsedTravelPlan | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "flights" | "hotels" | "days" | "budget" | "tips"
  >("all");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  // Trigger PDF Generation
  const handleDownloadPDF = () => {
    if (!parsedPlan) return;
    setIsDownloadingPDF(true);
    try {
      generateTravelPlanPDF(parsedPlan, response);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setTimeout(() => setIsDownloadingPDF(false), 800);
    }
  };

  // Handle plan generation
  const handleGeneratePlan = async (queryText: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setActiveStage(1);

    // Simulate progressive agent pipeline indicator
    const timer1 = setTimeout(() => setActiveStage(2), 2000);
    const timer2 = setTimeout(() => setActiveStage(3), 5000);
    const timer3 = setTimeout(() => setActiveStage(4), 9000);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate travel plan from backend.");
      } else {
        const parsed = parseTravelPlan(data.answer);
        setResponse(data);
        setParsedPlan(parsed);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsLoading(false);
      setActiveStage(4);
    }
  };

  // Load instant sample demo
  const handleLoadDemo = () => {
    setErrorMsg(null);
    setResponse(SAMPLE_TRAVEL_RESPONSE);
    const parsed = parseTravelPlan(SAMPLE_TRAVEL_RESPONSE.answer);
    setParsedPlan(parsed);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header
        onLoadDemo={handleLoadDemo}
        isLoading={isLoading}
        onDownloadPDF={handleDownloadPDF}
        hasPlan={Boolean(parsedPlan)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-4 sm:pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Multi-Agent Travel Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Intelligent Travel Planning,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
              Multiplied.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Experience next-generation travel booking where 4 specialized AI agents
            coordinate flights, verified hotels, day-by-day routes, and itemized
            budgets.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-4xl mx-auto">
          <TripInputForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
        </div>

        {/* Multi-Agent Architecture Progress */}
        <div className="max-w-5xl mx-auto">
          <AgentFlowVisualizer
            isLoading={isLoading}
            activeStage={activeStage}
            hasResult={Boolean(response)}
            llmCalls={response?.llm_calls}
          />
        </div>

        {/* Error / Offline Notice */}
        {errorMsg && (
          <div className="max-w-5xl mx-auto p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-300 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Backend Notice:</span>
              <span className="text-amber-200/90">{errorMsg}</span>
              <span className="block mt-1 text-[11px] text-amber-400/80">
                To run live agent invocations, start the FastAPI server:{" "}
                <code className="bg-slate-900 px-1.5 py-0.5 rounded font-mono text-cyan-300">
                  cd backend && uvicorn app:app --reload
                </code>
              </span>
              <div className="mt-2.5">
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 border border-amber-700/60 rounded-md text-xs font-medium transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preview Demo Plan (Sample Data)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Area */}
        {parsedPlan && (
          <div className="max-w-5xl mx-auto space-y-6 pt-4 animate-in fade-in duration-500">
            {/* View Filter Tabs & PDF Action Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    activeTab === "all"
                      ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Complete Itinerary</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("flights")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    activeTab === "flights"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Flights</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("hotels")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    activeTab === "hotels"
                      ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <Hotel className="w-3.5 h-3.5" />
                  <span>Hotels</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("days")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    activeTab === "days"
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Daily Plan ({parsedPlan.days.length} Days)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("budget")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    activeTab === "budget"
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Estimated Budget</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("tips")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    activeTab === "tips"
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Tips & Advice</span>
                </button>
              </div>

              {/* Quick PDF Action */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isDownloadingPDF}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all active:scale-95 shrink-0 border border-cyan-400/30 cursor-pointer"
                title="Download complete TripMate AI itinerary guide as PDF"
              >
                <FileDown className="w-4 h-4" />
                <span>{isDownloadingPDF ? "Generating PDF..." : "Download PDF Guide"}</span>
              </button>
            </div>

            {/* Display Content Based on Tab */}
            {activeTab === "all" && (
              <div className="space-y-6">
                <TripSummaryCard summary={parsedPlan.summary} />
                <FlightsSection content={parsedPlan.flightInfo} />
                <HotelsSection content={parsedPlan.hotelSuggestions} />
                <DayByDaySection days={parsedPlan.days} />
                <BudgetSection
                  budget={parsedPlan.budget}
                  rawText={parsedPlan.budget.preNotes}
                />
                <RecommendationsSection
                  recommendations={parsedPlan.recommendations}
                />
              </div>
            )}

            {activeTab === "flights" && (
              <div className="space-y-6">
                <FlightsSection content={parsedPlan.flightInfo} />
                <TripSummaryCard summary={parsedPlan.summary} />
              </div>
            )}

            {activeTab === "hotels" && (
              <div className="space-y-6">
                <HotelsSection content={parsedPlan.hotelSuggestions} />
              </div>
            )}

            {activeTab === "days" && (
              <div className="space-y-6">
                <DayByDaySection days={parsedPlan.days} />
              </div>
            )}

            {activeTab === "budget" && (
              <div className="space-y-6">
                <BudgetSection
                  budget={parsedPlan.budget}
                  rawText={parsedPlan.budget.preNotes}
                />
              </div>
            )}

            {activeTab === "tips" && (
              <div className="space-y-6">
                <RecommendationsSection
                  recommendations={parsedPlan.recommendations}
                />
              </div>
            )}

            {/* Multi-Agent Raw State Inspector */}
            {response && <AgentInspector response={response} />}
          </div>
        )}
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-400">TripMate AI</span>
            <span>• Multi-Agent Travel Assistant</span>
          </div>
          <div className="text-slate-500">
            Powered by LangGraph, LangChain, Google Gemini & Tavily
          </div>
        </div>
      </footer>
    </div>
  );
}
