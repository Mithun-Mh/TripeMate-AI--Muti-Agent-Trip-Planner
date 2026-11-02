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
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#171717]">
      <Header
        onLoadDemo={handleLoadDemo}
        isLoading={isLoading}
        onDownloadPDF={handleDownloadPDF}
        hasPlan={Boolean(parsedPlan)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section Framed with Fresh Green like reference screenshot */}
        <div className="relative border-2 border-[#159447]/30 rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#FAFCFA] via-white to-[#F6FAF6] overflow-hidden shadow-xs">
          {/* Ambient pale-green soft shape */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#DDEEDD]/50 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-3xl mx-auto space-y-3.5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DDEEDD] border border-[#159447]/30 text-[#159447] text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F28C00]" />
              <span>Autonomous Multi-Agent Travel Engine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#171717] leading-tight">
              Intelligent Travel Planning,{" "}
              <span className="text-[#159447]">Multiplied.</span>
              <span className="w-3 h-3 rounded-full bg-[#F28C00] inline-block ml-1"></span>
            </h1>

            <p className="text-sm sm:text-base text-[#525252] leading-relaxed max-w-2xl mx-auto font-medium">
              Experience next-generation travel booking where 4 specialized AI agents
              coordinate flights, verified accommodations, day-by-day itineraries, and itemized
              budgets in real time.
            </p>
          </div>
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
          <div className="max-w-5xl mx-auto p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-[#F28C00] shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-sm block mb-1">Backend Notice:</span>
              <span className="text-amber-800 leading-relaxed block">{errorMsg}</span>
              <span className="block mt-2 text-[11px] text-amber-900/80 font-medium">
                To run live agent invocations, start the FastAPI server:{" "}
                <code className="bg-white px-2 py-0.5 rounded font-mono text-[#159447] border border-amber-200 font-bold">
                  cd backend && uvicorn app:app --reload
                </code>
              </span>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F28C00] hover:bg-[#d97d00] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Preview Demo Plan (Sample Data)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Area */}
        {parsedPlan && (
          <div className="max-w-5xl mx-auto space-y-6 pt-2 animate-in fade-in duration-500">
            {/* View Filter Tabs & PDF Action Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-3xl bg-white border border-[#DDEEDD] shadow-sm">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === "all"
                      ? "bg-[#159447] text-white shadow-md shadow-[#159447]/20"
                      : "text-[#525252] hover:text-[#171717] hover:bg-[#DDEEDD]/30"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Complete Itinerary</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("flights")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === "flights"
                      ? "bg-[#159447] text-white shadow-md shadow-[#159447]/20"
                      : "text-[#525252] hover:text-[#171717] hover:bg-[#DDEEDD]/30"
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Flights</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("hotels")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === "hotels"
                      ? "bg-[#159447] text-white shadow-md shadow-[#159447]/20"
                      : "text-[#525252] hover:text-[#171717] hover:bg-[#DDEEDD]/30"
                  }`}
                >
                  <Hotel className="w-3.5 h-3.5" />
                  <span>Hotels</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("days")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === "days"
                      ? "bg-[#159447] text-white shadow-md shadow-[#159447]/20"
                      : "text-[#525252] hover:text-[#171717] hover:bg-[#DDEEDD]/30"
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Daily Plan ({parsedPlan.days.length} Days)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("budget")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === "budget"
                      ? "bg-[#159447] text-white shadow-md shadow-[#159447]/20"
                      : "text-[#525252] hover:text-[#171717] hover:bg-[#DDEEDD]/30"
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Budget Breakdown</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("tips")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === "tips"
                      ? "bg-[#159447] text-white shadow-md shadow-[#159447]/20"
                      : "text-[#525252] hover:text-[#171717] hover:bg-[#DDEEDD]/30"
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Tips & Advice</span>
                </button>
              </div>

              {/* Quick PDF Action (Vibrant Orange Button) */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isDownloadingPDF}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#F28C00] hover:bg-[#d97d00] text-white text-xs font-extrabold shadow-md shadow-[#F28C00]/25 transition-all active:scale-95 shrink-0 cursor-pointer"
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

            {/* Attractive TripMate AI PDF Dossier Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FAFCFA] via-[#DDEEDD]/40 to-[#FAFCFA] border-2 border-[#159447]/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 text-center sm:text-left relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDEEDD] text-[#159447] border border-[#159447]/30 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#F28C00]" />
                  <span>TripMate AI Travel Dossier</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#171717] tracking-tight">
                  Download Complete Itinerary & Travel Guide (PDF)
                </h3>
                <p className="text-xs sm:text-sm text-[#525252] max-w-xl leading-relaxed font-medium">
                  Take your comprehensive itinerary offline. Includes executive trip summary, live flight options, curated accommodations, day-by-day itinerary timeline, and structured budget table.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isDownloadingPDF}
                className="px-7 py-3.5 rounded-2xl bg-[#F28C00] hover:bg-[#d97d00] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#F28C00]/25 transition-all flex items-center justify-center gap-2.5 shrink-0 active:scale-95 cursor-pointer relative z-10 w-full sm:w-auto"
              >
                <FileDown className="w-4 h-4" />
                <span>{isDownloadingPDF ? "Preparing PDF..." : "Download PDF Guide"}</span>
              </button>
            </div>

            {/* Multi-Agent Raw State Inspector */}
            {response && <AgentInspector response={response} />}
          </div>
        )}
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-[#DDEEDD] bg-white py-8 text-center text-xs text-[#525252] mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-[#171717]">
            <Compass className="w-4 h-4 text-[#159447]" />
            <span>TripMate <span className="text-[#159447]">AI</span></span>
            <span className="text-[#525252] font-normal">• Multi-Agent Travel Planner</span>
          </div>
          <div className="text-[#525252]">
            Powered by LangGraph, LangChain, Google Gemini & Tavily
          </div>
        </div>
      </footer>
    </div>
  );
}
