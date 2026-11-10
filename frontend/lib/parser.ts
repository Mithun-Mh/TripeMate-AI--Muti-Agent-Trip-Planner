import {
  ParsedTravelPlan,
  TripSummaryData,
  DayItinerary,
  BudgetBreakdown,
} from "./types";

const SECTION_PATTERNS = [
  {
    key: "trip_summary",
    regex: /(?:^|\b)(?:trip\s+(?:summary|overview|parameters)|executive\s+summary)\b/i,
  },
  {
    key: "flight_info",
    regex: /(?:^|\b)(?:flights?\s+(?:information|details|options|booking|schedule)|flights?)\b/i,
  },
  {
    key: "hotel_suggestions",
    regex: /(?:^|\b)(?:hotels?\s+(?:suggestions|options|recommendations|details)?|curated\s+accommodations?|accommodations?|where\s+to\s+stay)\b/i,
  },
  {
    key: "day_by_day",
    regex: /(?:^|\b)(?:day[- ]by[- ]day(?:\s+itinerary)?|daily\s+itinerary|travel\s+itinerary|comprehensive.*?itinerary|detailed\s+itinerary|itinerary)\b/i,
  },
  {
    key: "budget",
    regex: /(?:^|\b)(?:estimated\s+budget|budget\s+breakdown|cost\s+breakdown|expense\s+estimate|budget)\b/i,
  },
  {
    key: "recommendations",
    regex: /(?:^|\b)(?:final\s+recommendations|travel\s+tips|recommendations|advisories?|essential\s+tips)\b/i,
  },
];

function identifyHeader(line: string): string | null {
  const s = line.trim();
  // Never treat bullets, tables, quotes, or empty lines as section headers
  if (
    !s ||
    s.startsWith("|") ||
    s.startsWith("+") ||
    s.startsWith(">") ||
    s.startsWith("-") ||
    s.startsWith("* ") ||
    s.startsWith("•")
  ) {
    return null;
  }

  // Must not be a key-value bullet or sentence like "**Key:** Value" or "Key: Value"
  if (/^\*\*?[A-Za-z0-9_\s]+?\*\*?:\s+.+$/.test(s)) {
    return null;
  }

  // Check if markdown or numbered header
  const isMarkdownHeader = /^#{1,6}\s+/.test(s);
  const isNumberedHeader = /^\*{0,2}\d+[\.\)]\s+/.test(s);

  // Clean formatting symbols
  const clean = s
    .replace(/^#{1,6}\s*/, "")
    .replace(/^\d+[\.\)]\s*/, "")
    .replace(/^[*_]+|[*_:]+$/g, "")
    .trim();

  if (!clean || clean.length < 3 || clean.length > 70) return null;

  // If not explicitly markdown or numbered header, require clean string to be concise (under 45 chars)
  if (!isMarkdownHeader && !isNumberedHeader && clean.length > 45) {
    return null;
  }

  for (const pattern of SECTION_PATTERNS) {
    if (pattern.regex.test(clean)) {
      return pattern.key;
    }
  }
  return null;
}

export function parseRawSections(text: string): Record<string, string> {
  const lines = text.split(/\r?\n/);
  const matches: Array<{ idx: number; key: string; line: string }> = [];
  const seenKeys = new Set<string>();

  lines.forEach((line, idx) => {
    const key = identifyHeader(line);
    if (key && !seenKeys.has(key)) {
      seenKeys.add(key);
      matches.push({ idx, key, line });
    }
  });

  if (matches.length === 0) {
    return { raw_content: text };
  }

  const sections: Record<string, string> = {};

  if (matches[0].idx > 0) {
    const preamble = lines.slice(0, matches[0].idx).join("\n").trim();
    if (preamble) sections.preamble = preamble;
  }

  for (let i = 0; i < matches.length; i++) {
    const curr = matches[i];
    const nextIdx = i + 1 < matches.length ? matches[i + 1].idx : lines.length;
    const content = lines.slice(curr.idx + 1, nextIdx).join("\n").trim();
    sections[curr.key] = content;
  }

  return sections;
}

export function parseTripSummary(rawText: string): TripSummaryData {
  if (!rawText) return { raw: "" };

  const lines = rawText.split(/\r?\n/);
  const kvPattern = /^\s*[-*•]\s*(?:\*\*(.*?)\*\*|(.*?)):\s*(.*)$/;
  const result: TripSummaryData = { raw: rawText };
  const otherLines: string[] = [];

  for (const line of lines) {
    const m = line.match(kvPattern);
    if (m) {
      const key = (m[1] || m[2] || "").trim().toLowerCase();
      const val = (m[3] || "").trim().replace(/[*_`]/g, "");

      if (key.includes("destination") || key.includes("where")) {
        result.destination = val;
      } else if (key.includes("origin") || key.includes("departure") || key.includes("from")) {
        result.origin = val;
      } else if (key.includes("duration") || key.includes("days") || key.includes("length")) {
        result.duration = val;
      } else if (key.includes("traveler") || key.includes("people") || key.includes("adult")) {
        result.travelers = val;
      } else if (key.includes("budget") || key.includes("cost") || key.includes("price")) {
        result.budget = val;
      } else if (key.includes("style") || key.includes("focus") || key.includes("type")) {
        result.style = val;
      } else {
        otherLines.push(`${m[1] || m[2]}: ${val}`);
      }
    } else {
      otherLines.push(line);
    }
  }

  result.otherText = otherLines.join("\n").trim();
  return result;
}

export function parseDayByDay(itineraryText: string): DayItinerary[] {
  if (!itineraryText) return [];

  const dayRegex =
    /(?:^|\n)\s*(?:[-*•]\s*)?(?:#{1,6}\s*|\*{1,2}\s*)?(Day\s+\d+[^:\n\*\#]*[:\-–—]?.*?)(?:\*{1,2})?(?:\n|$)/gi;
  const matches: Array<{ start: number; end: number; title: string }> = [];

  let match: RegExpExecArray | null;
  while ((match = dayRegex.exec(itineraryText)) !== null) {
    const rawTitle = match[1]
      .trim()
      .replace(/^[#* \t\-\•]+/, "")
      .replace(/[ *#:]+$/, "")
      .replace(/\*\*/g, "")
      .trim();
    matches.push({
      start: match.index,
      end: dayRegex.lastIndex,
      title: rawTitle,
    });
  }

  if (matches.length === 0) {
    return [
      {
        dayNumber: 1,
        title: "Complete Schedule",
        rawText: itineraryText,
        content: itineraryText,
      },
    ];
  }

  const days: DayItinerary[] = [];

  for (let i = 0; i < matches.length; i++) {
    const curr = matches[i];
    const nextStart =
      i + 1 < matches.length ? matches[i + 1].start : itineraryText.length;
    const body = itineraryText.substring(curr.end, nextStart).trim();

    // Extract day number from title
    const numMatch = curr.title.match(/Day\s+(\d+)/i);
    const dayNumber = numMatch ? parseInt(numMatch[1], 10) : i + 1;

    // Extract key subfields if present (e.g. Destination, Activities, Morning, Afternoon, Evening, Transport, Accommodation)
    let destination: string | undefined;
    let activities: string | undefined;
    let transport: string | undefined;
    let accommodation: string | undefined;
    let morning: string | undefined;
    let afternoon: string | undefined;
    let evening: string | undefined;

    const subPattern =
      /(?:^|\n)\s*[-*•]?\s*\*{0,2}(Destination|Activities|Activity|Morning|Afternoon|Evening|Transportation|Transport|Accommodation|Stay|Hotel):?\*{0,2}:\s*([\s\S]*?)(?=(?:\n\s*[-*•]?\s*\*{0,2}(?:Destination|Activities|Activity|Morning|Afternoon|Evening|Transportation|Transport|Accommodation|Stay|Hotel):?\*{0,2}:)|$)/gi;
    let subMatch: RegExpExecArray | null;
    while ((subMatch = subPattern.exec(body)) !== null) {
      const field = subMatch[1].toLowerCase();
      const val = subMatch[2].trim().replace(/^[*_\s]+|[*_\s]+$/g, "");
      if (field.includes("destination")) destination = val;
      else if (field.includes("activit")) activities = val;
      else if (field.includes("morning")) morning = val;
      else if (field.includes("afternoon")) afternoon = val;
      else if (field.includes("evening")) evening = val;
      else if (field.includes("transport")) transport = val;
      else if (
        field.includes("accommodat") ||
        field.includes("stay") ||
        field.includes("hotel")
      )
        accommodation = val;
    }

    // Assemble activities from time-of-day slots if available
    const actParts: string[] = [];
    if (activities) actParts.push(activities);
    if (morning) actParts.push(`Morning: ${morning}`);
    if (afternoon) actParts.push(`Afternoon: ${afternoon}`);
    if (evening) actParts.push(`Evening: ${evening}`);
    if (actParts.length > 0) {
      activities = actParts.join(" • ");
    }

    days.push({
      dayNumber,
      title: curr.title,
      destination,
      activities,
      transport,
      accommodation,
      rawText: body,
      content: body,
    });
  }

  return days;
}

export function parseBudget(budgetText: string): BudgetBreakdown {
  const result: BudgetBreakdown = { headers: [], rows: [] };
  if (!budgetText) return result;

  const lines = budgetText.split(/\r?\n/);
  const tableLines: string[] = [];
  const preLines: string[] = [];
  const postLines: string[] = [];
  let foundTable = false;

  for (const line of lines) {
    const s = line.trim();
    if (s.startsWith("|") && s.endsWith("|")) {
      foundTable = true;
      tableLines.push(s);
    } else {
      if (!foundTable) {
        preLines.push(line);
      } else {
        postLines.push(line);
      }
    }
  }

  result.preNotes = preLines.join("\n").trim();
  result.postNotes = postLines.join("\n").trim();

  // If table exists with at least header and 1 row
  if (tableLines.length >= 2) {
    const rawHeaders = tableLines[0]
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim().replace(/[*_`]/g, ""));

    let sepIdx = 1;
    if (tableLines.length > 1 && /^[-: |]+$/.test(tableLines[1])) {
      sepIdx = 2;
    }

    const rows: string[][] = [];
    for (let i = sepIdx; i < tableLines.length; i++) {
      const cols = tableLines[i]
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((c) => c.trim());

      // Detect total
      if (cols.some((c) => c.toLowerCase().includes("total"))) {
        result.totalCost = cols[1] || cols[0];
      }
      rows.push(cols);
    }

    result.headers = rawHeaders;
    result.rows = rows;
    return result;
  }

  // Fallback: parse bullet points
  const bulletPattern = /^\s*[-*•]\s*(?:\*\*(.*?)\*\*|(.*?)):\s*(.*)$/;
  const bulletRows: string[][] = [];
  for (const line of lines) {
    const m = line.match(bulletPattern);
    if (m) {
      const cat = (m[1] || m[2] || "").trim();
      const val = (m[3] || "").trim();
      if (cat.toLowerCase().includes("total") || val.toLowerCase().includes("total")) {
        result.totalCost = val;
      }
      bulletRows.push([cat, val]);
    }
  }

  if (bulletRows.length >= 2) {
    result.headers = ["Category / Item", "Estimated Cost & Details"];
    result.rows = bulletRows;
  }

  return result;
}

export function parseRecommendations(recText: string): string[] {
  if (!recText) return [];
  const lines = recText.split(/\r?\n/);
  const items: string[] = [];

  for (const line of lines) {
    const s = line.trim();
    if (!s) continue;
    // Check bullet points or numbered points
    const bulletMatch = s.match(/^(?:[-*•]|\d+[\.\)])\s*(.*)$/);
    if (bulletMatch) {
      items.push(bulletMatch[1].trim());
    } else if (s.length > 20) {
      items.push(s);
    }
  }

  return items;
}

export function parseTravelPlan(answer: string): ParsedTravelPlan {
  const sections = parseRawSections(answer || "");

  const summary = parseTripSummary(sections.trip_summary || sections.preamble || "");
  const flightInfo = sections.flight_info || "";
  const hotelSuggestions = sections.hotel_suggestions || "";

  // If day_by_day section was found, use it; otherwise search whole text for Day 1..Day N
  let days = parseDayByDay(sections.day_by_day || "");
  if (days.length === 0 && (answer.includes("Day 1") || answer.includes("DAY 1"))) {
    days = parseDayByDay(answer);
  }

  const budget = parseBudget(sections.budget || "");
  const recommendations = parseRecommendations(sections.recommendations || "");

  return {
    summary,
    flightInfo,
    hotelSuggestions,
    days,
    budget,
    recommendations,
    rawAnswer: answer,
  };
}
