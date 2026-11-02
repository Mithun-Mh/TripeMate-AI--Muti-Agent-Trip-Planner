import jsPDF from "jspdf";
import { ParsedTravelPlan, TravelResponse } from "./types";

export function generateTravelPlanPDF(
  parsedPlan: ParsedTravelPlan,
  response?: TravelResponse | null,
  userQuery?: string
): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const maxY = 280;

  let y = margin;

  // Color Palette - Aligned with TripeMate AI Brand Reference
  // Fresh Green: #159447 | Orange: #F28C00 | Pale Green: #DDEEDD | Black: #171717 | White: #FFFFFF
  const brandBlack = [23, 23, 23]; // #171717
  const freshGreen = [21, 148, 71]; // #159447
  const brightOrange = [242, 140, 0]; // #F28C00
  const paleGreen = [221, 238, 221]; // #DDEEDD
  const bgCard = [250, 252, 250]; // clean soft tint
  const borderGreen = [210, 232, 210]; // subtle light green border
  const textDark = [23, 23, 23]; // #171717
  const textMuted = [90, 105, 95]; // soft slate/green-grey

  // Helper: check page break
  function checkPageBreak(neededSpace: number) {
    if (y + neededSpace > maxY) {
      doc.addPage();
      y = 16;
      drawPageHeaderMini();
    }
  }

  // Mini header for subsequent pages
  function drawPageHeaderMini() {
    doc.setFillColor(brandBlack[0], brandBlack[1], brandBlack[2]);
    doc.rect(margin, y, contentWidth, 8, "F");

    doc.setFillColor(freshGreen[0], freshGreen[1], freshGreen[2]);
    doc.rect(margin, y, 2.5, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("TRIPMATE AI  |  Comprehensive Travel Guide Dossier", margin + 5, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(paleGreen[0], paleGreen[1], paleGreen[2]);
    const dest = parsedPlan.summary.destination || "Destination Guide";
    doc.text(dest.toUpperCase(), pageWidth - margin - 4, y + 5.5, { align: "right" });

    y += 13;
  }

  // Helper: draw section header
  function drawSectionHeader(numberText: string, title: string) {
    checkPageBreak(18);
    doc.setFillColor(freshGreen[0], freshGreen[1], freshGreen[2]);
    doc.roundedRect(margin, y, 6, 6, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(numberText, margin + 3, y + 4.2, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(brandBlack[0], brandBlack[1], brandBlack[2]);
    doc.text(title.toUpperCase(), margin + 9, y + 4.8);

    doc.setDrawColor(borderGreen[0], borderGreen[1], borderGreen[2]);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 8, margin + contentWidth, y + 8);

    y += 12;
  }

  // Helper: wrap & print text
  function printWrappedText(
    text: string,
    fontSize = 8.5,
    fontStyle = "normal",
    color = textDark,
    lineGap = 4.2,
    indent = 0
  ) {
    if (!text) return;
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);

    const lines = doc.splitTextToSize(text, contentWidth - indent);
    for (const line of lines) {
      checkPageBreak(lineGap + 2);
      doc.text(line, margin + indent, y);
      y += lineGap;
    }
  }

  // ==========================================
  // PAGE 1: HERO HEADER
  // ==========================================
  const headerHeight = 32;
  doc.setFillColor(brandBlack[0], brandBlack[1], brandBlack[2]);
  doc.roundedRect(margin, y, contentWidth, headerHeight, 2, 2, "F");

  // Fresh green brand accent bar
  doc.setFillColor(freshGreen[0], freshGreen[1], freshGreen[2]);
  doc.roundedRect(margin, y, 4, headerHeight, 1, 1, "F");

  // TripMate AI Logo text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("TRIPMATE", margin + 8, y + 11);

  doc.setTextColor(brightOrange[0], brightOrange[1], brightOrange[2]);
  doc.text("AI", margin + 46, y + 11);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(paleGreen[0], paleGreen[1], paleGreen[2]);
  doc.text("Autonomous Multi-Agent Travel Planner • Official Itinerary Dossier", margin + 8, y + 17);

  // Metadata block (right aligned)
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  doc.setFontSize(7.5);
  doc.setTextColor(180, 200, 180);
  doc.text(`Generated: ${today}`, pageWidth - margin - 6, y + 9, { align: "right" });

  const threadId = response?.thread_id || "session_tm_ai";
  doc.text(`Thread Ref: ${threadId.slice(0, 18)}`, pageWidth - margin - 6, y + 14, {
    align: "right",
  });

  doc.setTextColor(freshGreen[0], freshGreen[1], freshGreen[2]);
  doc.text("Pipeline: 4 Agents Active (SerpApi • Tavily • Gemini)", pageWidth - margin - 6, y + 19, {
    align: "right",
  });

  y += headerHeight + 6;

  // ==========================================
  // 1. EXECUTIVE TRIP SUMMARY CARD
  // ==========================================
  drawSectionHeader("1", "Trip Summary & Overview");

  const sum = parsedPlan.summary;
  const cardHeight = 34;

  doc.setFillColor(bgCard[0], bgCard[1], bgCard[2]);
  doc.setDrawColor(borderGreen[0], borderGreen[1], borderGreen[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, "FD");

  const colWidth = contentWidth / 3;
  const colY1 = y + 6;
  const colY2 = y + 20;

  const summaryItems = [
    { label: "DESTINATION", val: sum.destination || "Not Specified", col: 0, row: 1 },
    { label: "ORIGIN", val: sum.origin || "Flexible / Local Hub", col: 1, row: 1 },
    { label: "DURATION", val: sum.duration || "Multi-Day Journey", col: 2, row: 1 },
    { label: "TRAVELERS", val: sum.travelers || "2 Adults", col: 0, row: 2 },
    { label: "ESTIMATED BUDGET", val: sum.budget || "Flexible / Standard", col: 1, row: 2 },
    { label: "TRAVEL STYLE", val: sum.style || "Cultural Exploration", col: 2, row: 2 },
  ];

  for (const item of summaryItems) {
    const itemX = margin + 4 + item.col * colWidth;
    const itemY = item.row === 1 ? colY1 : colY2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(item.label, itemX, itemY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(brandBlack[0], brandBlack[1], brandBlack[2]);

    const truncated = doc.splitTextToSize(item.val, colWidth - 8)[0] || item.val;
    doc.text(truncated, itemX, itemY + 5);
  }

  y += cardHeight + 7;

  // ==========================================
  // 2. FLIGHT INFORMATION
  // ==========================================
  if (parsedPlan.flightInfo) {
    drawSectionHeader("2", "Flight Information & Logistics");

    // Flight card wrapper
    const flightTextClean = parsedPlan.flightInfo.replace(/```[a-z]*\n?/gi, "").trim();
    const flightLines = flightTextClean.split(/\r?\n/).filter((l) => l.trim().length > 0);

    doc.setFillColor(bgCard[0], bgCard[1], bgCard[2]);
    doc.setDrawColor(borderGreen[0], borderGreen[1], borderGreen[2]);
    doc.setLineWidth(0.3);

    for (const line of flightLines.slice(0, 16)) {
      checkPageBreak(5);
      if (line.startsWith("Airline:") || line.startsWith("Flight:") || line.startsWith("Departure:") || line.startsWith("Arrival:")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(freshGreen[0], freshGreen[1], freshGreen[2]);
        doc.text(line, margin + 3, y);
        y += 4.5;
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text(line.replace(/^[•\-\*]\s*/, "• "), margin + 5, y);
        y += 4;
      }
    }
    y += 4;
  }

  // ==========================================
  // 3. HOTEL SUGGESTIONS
  // ==========================================
  if (parsedPlan.hotelSuggestions) {
    drawSectionHeader("3", "Curated Accommodations");

    const hotelTextClean = parsedPlan.hotelSuggestions.replace(/```[a-z]*\n?/gi, "").trim();
    const hotelLines = hotelTextClean.split(/\r?\n/).filter((l) => l.trim().length > 0);

    for (const line of hotelLines.slice(0, 14)) {
      checkPageBreak(5);
      if (/^\d+\.\s*/.test(line) || line.includes("**")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(brandBlack[0], brandBlack[1], brandBlack[2]);
        const cleaned = line.replace(/\*\*/g, "");
        doc.text(cleaned, margin + 3, y);
        y += 4.5;
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
        const wrapped = doc.splitTextToSize(line.replace(/^[•\-\*]\s*/, "  - "), contentWidth - 6);
        for (const w of wrapped) {
          checkPageBreak(4);
          doc.text(w, margin + 4, y);
          y += 3.8;
        }
      }
    }
    y += 4;
  }

  // ==========================================
  // 4. DAY-BY-DAY ITINERARY
  // ==========================================
  if (parsedPlan.days && parsedPlan.days.length > 0) {
    drawSectionHeader("4", "Comprehensive Day-by-Day Itinerary");

    for (const day of parsedPlan.days) {
      checkPageBreak(25);

      // Day Title Pill (Fresh Green with white text)
      doc.setFillColor(freshGreen[0], freshGreen[1], freshGreen[2]);
      doc.roundedRect(margin, y, 16, 5, 1, 1, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(`DAY ${day.dayNumber}`, margin + 8, y + 3.6, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(brandBlack[0], brandBlack[1], brandBlack[2]);
      const titleClean = day.title || `Day ${day.dayNumber} Exploration`;
      doc.text(titleClean, margin + 19, y + 3.8);

      y += 7;

      // Card body
      const dayLines: Array<{ label: string; text?: string }> = [
        { label: "Activities & Sights", text: day.activities },
        { label: "Transportation", text: day.transport },
        { label: "Accommodation", text: day.accommodation },
      ];

      let hasStructuredFields = false;
      for (const field of dayLines) {
        if (field.text && field.text.trim()) {
          hasStructuredFields = true;
          checkPageBreak(8);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(freshGreen[0], freshGreen[1], freshGreen[2]);
          doc.text(`• ${field.label}:`, margin + 4, y);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(textDark[0], textDark[1], textDark[2]);

          const wrap = doc.splitTextToSize(field.text.trim(), contentWidth - 36);
          doc.text(wrap[0] || "", margin + 34, y);
          y += 4;
          for (let i = 1; i < wrap.length; i++) {
            checkPageBreak(4);
            doc.text(wrap[i], margin + 34, y);
            y += 3.8;
          }
        }
      }

      // If unstructured raw text
      if (!hasStructuredFields && day.rawText) {
        const rawLines = day.rawText
          .replace(/^#+\s*/gm, "")
          .split(/\r?\n/)
          .filter((l) => l.trim().length > 0)
          .slice(0, 6);

        for (const rl of rawLines) {
          checkPageBreak(4.5);
          printWrappedText(`• ${rl.replace(/^[•\-\*]\s*/, "")}`, 7.5, "normal", textDark, 3.8, 4);
        }
      }

      y += 3;
    }
    y += 3;
  }

  // ==========================================
  // 5. ESTIMATED BUDGET BREAKDOWN
  // ==========================================
  if (parsedPlan.budget && parsedPlan.budget.rows && parsedPlan.budget.rows.length > 0) {
    drawSectionHeader("5", "Estimated Budget Breakdown");

    const headers = parsedPlan.budget.headers.length > 0
      ? parsedPlan.budget.headers
      : ["Expense Category", "Estimated Cost", "Allocation Details"];

    // Table Header (Fresh Green)
    checkPageBreak(12);
    doc.setFillColor(freshGreen[0], freshGreen[1], freshGreen[2]);
    doc.rect(margin, y, contentWidth, 6.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);

    const c1W = 55;
    const c2W = 45;
    const c3W = contentWidth - c1W - c2W;

    doc.text(headers[0] || "Category", margin + 3, y + 4.5);
    doc.text(headers[1] || "Cost / Allocation", margin + c1W + 3, y + 4.5);
    doc.text(headers[2] || "Notes", margin + c1W + c2W + 3, y + 4.5);

    y += 6.5;

    // Table Rows
    parsedPlan.budget.rows.forEach((row, idx) => {
      checkPageBreak(7);
      if (idx % 2 === 0) {
        doc.setFillColor(bgCard[0], bgCard[1], bgCard[2]);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      doc.rect(margin, y, contentWidth, 6, "F");

      doc.setDrawColor(borderGreen[0], borderGreen[1], borderGreen[2]);
      doc.setLineWidth(0.2);
      doc.line(margin, y + 6, margin + contentWidth, y + 6);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(brandBlack[0], brandBlack[1], brandBlack[2]);
      doc.text(row[0] || "", margin + 3, y + 4.2);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(brightOrange[0], brightOrange[1], brightOrange[2]);
      doc.text(row[1] || "", margin + c1W + 3, y + 4.2);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      const noteCut = doc.splitTextToSize(row[2] || "", c3W - 6)[0] || row[2] || "";
      doc.text(noteCut, margin + c1W + c2W + 3, y + 4.2);

      y += 6;
    });

    if (parsedPlan.budget.postNotes) {
      y += 2;
      printWrappedText(parsedPlan.budget.postNotes, 7, "italic", textMuted, 3.5, 2);
    }

    y += 4;
  }

  // ==========================================
  // 6. FINAL RECOMMENDATIONS & ADVISORY
  // ==========================================
  if (parsedPlan.recommendations && parsedPlan.recommendations.length > 0) {
    drawSectionHeader("6", "Final Recommendations & Advisory");

    for (const tip of parsedPlan.recommendations.slice(0, 8)) {
      checkPageBreak(5);
      const cleanTip = tip.replace(/^\d+\.\s*/, "").replace(/\*\*/g, "").trim();
      printWrappedText(`✔ ${cleanTip}`, 7.5, "normal", textDark, 3.8, 3);
    }
    y += 4;
  }

  // ==========================================
  // FOOTER STAMP ON ALL PAGES
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Bottom line
    doc.setDrawColor(borderGreen[0], borderGreen[1], borderGreen[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, 287, margin + contentWidth, 287);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(
      "TripMate AI • Intelligent Multi-Agent Travel Planner • Powered by LangGraph, Gemini & Tavily",
      margin,
      291
    );

    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, 291, { align: "right" });
  }

  // Save the PDF
  const safeDest = (parsedPlan.summary.destination || "Trip").replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`TripMate_AI_${safeDest}_Itinerary_Guide.pdf`);
}

