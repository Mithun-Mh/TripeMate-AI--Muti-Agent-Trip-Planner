"use client";

import React from "react";
import { BudgetBreakdown } from "@/lib/types";
import { Wallet, TrendingDown, CheckCircle2, AlertCircle } from "lucide-react";

interface BudgetSectionProps {
  budget: BudgetBreakdown;
  rawText?: string;
}

export function BudgetSection({ budget, rawText }: BudgetSectionProps) {
  const hasTable = budget.headers.length > 0 && budget.rows.length > 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
            05
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Estimated Budget & Cost Breakdown</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                Finance Agent
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Itemized expenses, transport, stays, and budget optimization
            </p>
          </div>
        </div>

        {budget.totalCost && (
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Estimate
            </span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400">
              {budget.totalCost.replace(/[*_`]/g, "")}
            </span>
          </div>
        )}
      </div>

      {budget.preNotes && (
        <p className="text-xs text-slate-300 mb-3">{budget.preNotes.replace(/[*_`]/g, "")}</p>
      )}

      {/* Structured Table */}
      {hasTable ? (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {budget.headers.map((h, idx) => (
                  <th
                    key={idx}
                    className={`px-4 py-3 font-semibold text-slate-300 ${
                      idx === 1 ? "text-right" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {budget.rows.map((row, rIdx) => {
                const isTotal = row.some((c) => c.toLowerCase().includes("total"));

                return (
                  <tr
                    key={rIdx}
                    className={`transition-colors ${
                      isTotal
                        ? "bg-emerald-950/30 font-bold text-emerald-300 border-t-2 border-emerald-500/40"
                        : "hover:bg-slate-900/40 text-slate-300"
                    }`}
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`px-4 py-3 ${
                          cIdx === 1 ? "text-right font-medium" : ""
                        } ${isTotal ? "text-emerald-300 font-bold" : ""}`}
                      >
                        {cell.replace(/[*_`]/g, "")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : rawText ? (
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-line">
          {rawText.replace(/[*_`]/g, "")}
        </div>
      ) : null}

      {/* Budget Optimization Post Notes */}
      {budget.postNotes && (
        <div className="mt-3.5 flex items-start gap-2 p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-300">
          <TrendingDown className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-emerald-400 mr-1.5">Cost Savings Advice:</span>
            <span>{budget.postNotes.replace(/[*_`]/g, "")}</span>
          </div>
        </div>
      )}
    </div>
  );
}

