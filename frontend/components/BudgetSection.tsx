"use client";

import React from "react";
import { BudgetBreakdown } from "@/lib/types";
import { Wallet, TrendingDown, CheckCircle2 } from "lucide-react";

interface BudgetSectionProps {
  budget: BudgetBreakdown;
  rawText?: string;
}

export function BudgetSection({ budget, rawText }: BudgetSectionProps) {
  const hasTable = budget.headers.length > 0 && budget.rows.length > 0;

  return (
    <div className="bg-white border-2 border-[#159447]/30 rounded-3xl p-6 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#DDEEDD] text-[#159447] flex items-center justify-center font-extrabold text-xs">
            05
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#171717] flex items-center gap-2">
              <span>Estimated Budget & Cost Breakdown</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDEEDD] text-[#159447] border border-[#159447]/20">
                Finance Agent
              </span>
            </h2>
            <p className="text-xs text-[#525252]">
              Itemized expenses, transport, stays, and budget optimization
            </p>
          </div>
        </div>

        {budget.totalCost && (
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#525252] block tracking-wider">
              Total Budget
            </span>
            <span className="text-base sm:text-xl font-extrabold text-[#F28C00]">
              {budget.totalCost.replace(/[*_`]/g, "")}
            </span>
          </div>
        )}
      </div>

      {budget.preNotes && (
        <p className="text-xs text-[#525252] mb-3 font-medium">{budget.preNotes.replace(/[*_`]/g, "")}</p>
      )}

      {/* Structured Table */}
      {hasTable ? (
        <div className="overflow-x-auto rounded-2xl border border-[#DDEEDD] bg-white shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#159447] text-white">
                {budget.headers.map((h, idx) => (
                  <th
                    key={idx}
                    className={`px-5 py-3.5 font-bold tracking-tight ${
                      idx === 0 ? "rounded-tl-2xl" : idx === budget.headers.length - 1 ? "rounded-tr-2xl" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDEEDD]">
              {budget.rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={`hover:bg-[#DDEEDD]/20 transition-colors ${
                    rIdx % 2 === 0 ? "bg-[#FAFCFA]" : "bg-white"
                  }`}
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-5 py-3.5 ${
                        cIdx === 0
                          ? "font-extrabold text-[#171717]"
                          : cIdx === 1
                          ? "font-bold text-[#159447]"
                          : "text-[#525252]"
                      }`}
                    >
                      {cell.replace(/[*_`]/g, "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : rawText ? (
        <div className="p-4 rounded-2xl bg-[#FAFCFA] border border-[#DDEEDD] text-xs sm:text-sm text-[#171717] leading-relaxed whitespace-pre-line font-medium">
          {rawText}
        </div>
      ) : null}

      {budget.postNotes && (
        <p className="mt-3 text-[11px] text-[#525252] italic font-medium">
          * {budget.postNotes.replace(/[*_`]/g, "")}
        </p>
      )}
    </div>
  );
}
