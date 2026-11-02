"""TripMate AI Terminal Formatter
==============================
Provides structured, styled terminal formatting for AI-generated
travel plans using the Rich library.

Features:
- Windows PowerShell UTF-8 safety (handles emojis and box chars cleanly)
- Section extraction for:
    1. Trip Summary (Cards / Columns)
    2. Flight Information (Styled Panel)
    3. Hotel Suggestions (Styled Panel)
    4. Day-by-Day Itinerary (Distinguishable daily cards with activities, transport, accommodation)
    5. Estimated Budget (Rich Table with highlighted totals)
    6. Final Recommendations (Styled Panel)
- Graceful fallbacks for missing or unstructured sections
- Pure formatting layer: does not alter travel data or LangGraph logic
"""

from __future__ import annotations

import re
import sys
from typing import Any

from rich import box
from rich.columns import Columns
from rich.console import Console, Group, RenderableType
from rich.markdown import Markdown
from rich.panel import Panel
from rich.table import Table
from rich.text import Text


def get_console() -> Console:
    """Initialize and configure a Rich Console safe for Windows terminals."""
    if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
            # pyrefly: ignore[missing-attribute]
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
    return Console()


# Global console instance
_default_console = get_console()


# ============================================================================
# Section Parsing Logic
# ============================================================================

SECTION_PATTERNS = [
    (
        "trip_summary",
        re.compile(
            r"^(?:#{1,6}\s*)?(?:\*{1,2}\s*)?(?:1[\.\)]\s*)?trip\s+(?:summary|overview)",
            re.IGNORECASE,
        ),
    ),
    (
        "flight_info",
        re.compile(
            r"^(?:#{1,6}\s*)?(?:\*{1,2}\s*)?(?:(?:2[\.\)]\s*)?flight\s+(?:information|details|options|booking)|(?:2[\.\)]\s*)?flights?)",
            re.IGNORECASE,
        ),
    ),
    (
        "hotel_suggestions",
        re.compile(
            r"^(?:#{1,6}\s*)?(?:\*{1,2}\s*)?(?:(?:3[\.\)]\s*)?hotel\s+(?:suggestions|options|recommendations)|(?:3[\.\)]\s*)?accommodations?|(?:3[\.\)]\s*)?hotels?)",
            re.IGNORECASE,
        ),
    ),
    (
        "day_by_day",
        re.compile(
            r"^(?:#{1,6}\s*)?(?:\*{1,2}\s*)?(?:(?:4[\.\)]\s*)?day[- ]by[- ]day\s+itinerary|(?:4[\.\)]\s*)?daily\s+itinerary|(?:4[\.\)]\s*)?itinerary)",
            re.IGNORECASE,
        ),
    ),
    (
        "budget",
        re.compile(
            r"^(?:#{1,6}\s*)?(?:\*{1,2}\s*)?(?:(?:5[\.\)]\s*)?estimated\s+budget|(?:5[\.\)]\s*)?budget\s+breakdown|(?:5[\.\)]\s*)?cost\s+breakdown|(?:5[\.\)]\s*)?budget)",
            re.IGNORECASE,
        ),
    ),
    (
        "recommendations",
        re.compile(
            r"^(?:#{1,6}\s*)?(?:\*{1,2}\s*)?(?:(?:6[\.\)]\s*)?final\s+recommendations|(?:6[\.\)]\s*)?travel\s+tips|(?:6[\.\)]\s*)?recommendations)",
            re.IGNORECASE,
        ),
    ),
]


def _identify_header(line: str) -> str | None:
    """Identify if a line is a recognized top-level section header."""
    s = line.strip()
    if not s or s.startswith("|") or s.startswith(("-", "+")) or s.startswith("* ") or s.startswith("•"):
        return None
    for sec_key, pattern in SECTION_PATTERNS:
        if pattern.search(s):
            return sec_key
    return None


def parse_itinerary_sections(text: str) -> dict[str, str]:
    """Parse raw itinerary markdown into structured sections."""
    lines = text.splitlines()
    matches: list[tuple[int, str, str]] = []

    for idx, line in enumerate(lines):
        sec = _identify_header(line)
        if sec:
            matches.append((idx, sec, line))

    if not matches:
        return {"raw_content": text}

    sections: dict[str, str] = {}

    # Extract preamble before first header if present
    if matches[0][0] > 0:
        preamble = "\n".join(lines[: matches[0][0]]).strip()
        if preamble:
            sections["preamble"] = preamble

    for i, (idx, sec_key, _) in enumerate(matches):
        next_idx = matches[i + 1][0] if i + 1 < len(matches) else len(lines)
        content = "\n".join(lines[idx + 1 : next_idx]).strip()
        sections[sec_key] = content

    return sections


# ============================================================================
# Section Renderers
# ============================================================================

def render_banner(thread_id: str | None = None) -> Panel:
    """Render the main TripMate header banner."""
    header_text = Text()
    header_text.append("🌍 TRIPMATE AI ", style="bold bright_cyan")
    header_text.append("• MULTI-AGENT TRAVEL PLANNER\n", style="bold white")
    header_text.append("Personalized Intelligent Itinerary & Booking Intelligence", style="italic bright_black")
    if thread_id:
        header_text.append(f"\n[Session ID: {thread_id}]", style="dim cyan")

    return Panel(
        header_text,
        box=box.ROUNDED,
        border_style="bright_blue",
        padding=(1, 2),
    )


def render_trip_summary(summary_text: str) -> Panel:
    """Render the Trip Summary section with structured key cards and text."""
    lines = summary_text.splitlines()
    kv_pattern = re.compile(r"^\s*[-*•]\s*(?:\*\*(.*?)\*\*|(.*?)):\s*(.*)$")
    kv_pairs: list[tuple[str, str]] = []
    other_lines: list[str] = []

    for line in lines:
        m = kv_pattern.match(line)
        if m:
            key = (m.group(1) or m.group(2)).strip()
            val = m.group(3).strip()
            kv_pairs.append((key, val))
        else:
            other_lines.append(line)

    elements: list[RenderableType] = []

    if kv_pairs:
        cards: list[Panel] = []
        for key, val in kv_pairs:
            # Clean markdown bold/italics in values for card titles
            clean_val = re.sub(r"[*_`]", "", val)
            cards.append(
                Panel(
                    f"[bold white]{clean_val}[/bold white]",
                    title=f"[bold cyan]{key}[/bold cyan]",
                    border_style="blue",
                    box=box.ROUNDED,
                    padding=(0, 1),
                    expand=False,
                )
            )
        elements.append(Columns(cards, equal=False, expand=False))

    other_text = "\n".join(other_lines).strip()
    if other_text:
        elements.append(Markdown(other_text))

    if not elements:
        elements.append(Markdown(summary_text))

    content: RenderableType = Group(*elements) if len(elements) > 1 else elements[0]

    return Panel(
        content,
        title="[bold bright_blue]📋  1. Trip Summary[/bold bright_blue]",
        border_style="bright_blue",
        box=box.ROUNDED,
        padding=(1, 1),
    )


def render_flight_info(flight_text: str) -> Panel:
    """Render the Flight Information section."""
    return Panel(
        Markdown(flight_text),
        title="[bold dodger_blue1]✈️   2. Flight Information[/bold dodger_blue1]",
        border_style="dodger_blue1",
        box=box.ROUNDED,
        padding=(1, 1),
    )


def render_hotel_suggestions(hotel_text: str) -> Panel:
    """Render the Hotel Suggestions section."""
    return Panel(
        Markdown(hotel_text),
        title="[bold magenta]🏨  3. Hotel Suggestions & Accommodations[/bold magenta]",
        border_style="magenta",
        box=box.ROUNDED,
        padding=(1, 1),
    )


def render_day_by_day(itinerary_text: str) -> list[Panel]:
    """Render each itinerary day clearly distinguishable with its day number and details."""
    day_pattern = re.compile(
        r"(?m)^\s*(?:#{1,6}\s*|\*{1,2}\s*|\*\s+\*{1,2})?(Day\s+\d+[^:\n\*\#]*[:\-–—]?.*?)(?:\*{1,2})?\s*$",
        re.IGNORECASE,
    )

    matches = list(day_pattern.finditer(itinerary_text))
    panels: list[Panel] = []

    if not matches:
        # Fallback to single panel if days cannot be individually split
        return [
            Panel(
                Markdown(itinerary_text),
                title="[bold cyan]📅  4. Day-by-Day Itinerary[/bold cyan]",
                border_style="cyan",
                box=box.ROUNDED,
                padding=(1, 1),
            )
        ]

    # Handle preamble before Day 1 if any
    first_start = matches[0].start()
    if first_start > 0:
        preamble = itinerary_text[:first_start].strip()
        if preamble:
            panels.append(
                Panel(
                    Markdown(preamble),
                    title="[bold cyan]📅  4. Day-by-Day Itinerary Overview[/bold cyan]",
                    border_style="cyan",
                    box=box.ROUNDED,
                    padding=(1, 1),
                )
            )

    # Render each day as a distinct card
    for i, m in enumerate(matches):
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(itinerary_text)
        raw_title = m.group(1).strip()
        clean_title = re.sub(r"^[#* \t\-\•]+", "", raw_title).rstrip(" *#:")
        day_body = itinerary_text[start:end].strip()

        # Add section number label to the first day card if not already there
        header_prefix = "📅  "
        if i == 0 and not panels:
            header_prefix = "📅  4. Day-by-Day Itinerary — "

        panels.append(
            Panel(
                Markdown(day_body),
                title=f"[bold bright_cyan]{header_prefix}{clean_title}[/bold bright_cyan]",
                border_style="cyan",
                box=box.ROUNDED,
                padding=(0, 1),
            )
        )

    return panels


def _parse_markdown_table(text: str) -> tuple[tuple[list[str], list[list[str]]] | None, str, str]:
    """Extract a markdown table and surrounding text."""
    lines = text.strip().splitlines()
    table_lines: list[str] = []
    pre_lines: list[str] = []
    post_lines: list[str] = []
    found_table = False

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("|") and stripped.endswith("|"):
            found_table = True
            table_lines.append(stripped)
        else:
            if not found_table:
                pre_lines.append(line)
            else:
                post_lines.append(line)

    if len(table_lines) < 2:
        return None, "\n".join(pre_lines).strip(), "\n".join(post_lines).strip()

    raw_headers = [c.strip() for c in table_lines[0].strip("|").split("|")]
    sep_idx = 1
    if len(table_lines) > 1 and all(c in "-: |" for c in table_lines[1]):
        sep_idx = 2

    rows: list[list[str]] = []
    for t_line in table_lines[sep_idx:]:
        cols = [c.strip() for c in t_line.strip("|").split("|")]
        rows.append(cols)

    return (raw_headers, rows), "\n".join(pre_lines).strip(), "\n".join(post_lines).strip()


def _parse_bullet_budget(text: str) -> tuple[list[tuple[str, str]] | None, str, str]:
    """Extract bullet-point budget breakdowns and surrounding text."""
    lines = text.strip().splitlines()
    bullet_pattern = re.compile(r"^\s*[-*•]\s*(?:\*\*(.*?)\*\*|(.*?)):\s*(.*)$")
    bullets: list[tuple[str, str]] = []
    pre_lines: list[str] = []
    post_lines: list[str] = []
    found_bullets = False

    for line in lines:
        m = bullet_pattern.match(line)
        if m:
            found_bullets = True
            cat = (m.group(1) or m.group(2)).strip()
            details = m.group(3).strip()
            bullets.append((cat, details))
        else:
            if not found_bullets:
                pre_lines.append(line)
            else:
                post_lines.append(line)

    if len(bullets) < 2:
        return None, text, ""

    return bullets, "\n".join(pre_lines).strip(), "\n".join(post_lines).strip()


def render_budget(budget_text: str) -> Panel:
    """Render the Estimated Budget section using a Rich Table."""
    elements: list[RenderableType] = []

    # Attempt 1: Parse Markdown Table
    table_data, pre, post = _parse_markdown_table(budget_text)
    if table_data:
        headers, rows = table_data
        table = Table(
            box=box.ROUNDED,
            header_style="bold green",
            border_style="green",
            title="[bold green]💰  Cost Breakdown[/bold green]",
            expand=True,
        )

        for h in headers:
            # Right-align numeric columns
            is_numeric = any(w in h.lower() for w in ["cost", "price", "amount", "budget", "lkr", "usd", "eur"])
            table.add_column(h, justify="right" if is_numeric else "left")

        for r in rows:
            while len(r) < len(headers):
                r.append("")
            is_total = any("total" in cell.lower() for cell in r)
            if is_total:
                table.add_section()
                table.add_row(*[f"[bold green]{c}[/bold green]" for c in r[: len(headers)]])
            else:
                table.add_row(*r[: len(headers)])

        if pre:
            elements.append(Markdown(pre))
        elements.append(table)
        if post:
            elements.append(Markdown(post))

        return Panel(
            Group(*elements),
            title="[bold green]💰  5. Estimated Budget[/bold green]",
            border_style="green",
            box=box.ROUNDED,
            padding=(1, 1),
        )

    # Attempt 2: Parse Bullet Budget
    bullets, pre_b, post_b = _parse_bullet_budget(budget_text)
    if bullets:
        table = Table(
            box=box.ROUNDED,
            header_style="bold green",
            border_style="green",
            title="[bold green]💰  Cost Breakdown[/bold green]",
            expand=True,
        )
        table.add_column("Category / Item", style="bold cyan")
        table.add_column("Cost & Details")

        for cat, details in bullets:
            is_total = "total" in cat.lower() or "total" in details.lower()
            if is_total:
                table.add_section()
                table.add_row(f"[bold green]{cat}[/bold green]", f"[bold green]{details}[/bold green]")
            else:
                table.add_row(cat, details)

        if pre_b:
            elements.append(Markdown(pre_b))
        elements.append(table)
        if post_b:
            elements.append(Markdown(post_b))

        return Panel(
            Group(*elements),
            title="[bold green]💰  5. Estimated Budget[/bold green]",
            border_style="green",
            box=box.ROUNDED,
            padding=(1, 1),
        )

    # Fallback: Plain Markdown in Panel
    return Panel(
        Markdown(budget_text),
        title="[bold green]💰  5. Estimated Budget[/bold green]",
        border_style="green",
        box=box.ROUNDED,
        padding=(1, 1),
    )


def render_recommendations(rec_text: str) -> Panel:
    """Render the Final Recommendations section."""
    return Panel(
        Markdown(rec_text),
        title="[bold bright_yellow]💡  6. Final Recommendations & Travel Tips[/bold bright_yellow]",
        border_style="bright_yellow",
        box=box.ROUNDED,
        padding=(1, 1),
    )


def render_footer(llm_calls: int | None = None, thread_id: str | None = None) -> Panel:
    """Render a subtle trip planner completion footer."""
    footer_text = Text()
    footer_text.append("✨  Your customized TripMate itinerary is ready!  ✨\n", style="bold bright_green")
    details: list[str] = []
    if thread_id:
        details.append(f"Session: {thread_id}")
    if llm_calls:
        details.append(f"AI Agents Consulted: {llm_calls}")
    details.append("TripMate Multi-Agent Engine")
    footer_text.append(" • ".join(details), style="dim white")

    return Panel(
        footer_text,
        box=box.ROUNDED,
        border_style="dim green",
        padding=(0, 2),
    )


# ============================================================================
# Main Formatter Entry Points
# ============================================================================

def format_travel_plan(data: str | dict[str, Any]) -> list[RenderableType]:
    """Convert travel planner response (dict or str) into a list of Rich renderables.

    Args:
        data: Either a dictionary containing 'answer' (from run_travel_agent)
              or a raw string of the itinerary.

    Returns:
        List of Rich renderables ready for console printing.
    """
    thread_id: str | None = None
    llm_calls: int | None = None
    text_content = ""

    if isinstance(data, dict):
        thread_id = data.get("thread_id")
        llm_calls = data.get("llm_calls")
        text_content = str(data.get("answer") or "").strip()
        if not text_content:
            # Fallback to reconstructing from state parts if answer was empty
            parts: list[str] = []
            if data.get("flight_results"):
                parts.append(f"### 2. Flight Information\n{data['flight_results']}")
            if data.get("hotel_results"):
                parts.append(f"### 3. Hotel Suggestions\n{data['hotel_results']}")
            if data.get("itinerary"):
                parts.append(f"### 4. Day-by-Day Itinerary\n{data['itinerary']}")
            text_content = "\n\n".join(parts)
    elif isinstance(data, str):
        text_content = data.strip()
    else:
        text_content = str(data).strip()

    if not text_content:
        return [
            Panel(
                "[yellow]No travel plan content was found to format.[/yellow]",
                title="TripMate Warning",
                border_style="yellow",
            )
        ]

    renderables: list[RenderableType] = []

    # 1. Header Banner
    renderables.append(render_banner(thread_id=thread_id))

    # Parse sections
    sections = parse_itinerary_sections(text_content)

    # If raw content without standard sections
    if "raw_content" in sections:
        renderables.append(
            Panel(
                Markdown(sections["raw_content"]),
                title="[bold cyan]🌍  Travel Plan[/bold cyan]",
                border_style="cyan",
                box=box.ROUNDED,
                padding=(1, 1),
            )
        )
        renderables.append(render_footer(llm_calls=llm_calls, thread_id=thread_id))
        return renderables

    # Preamble (if any before section 1)
    if "preamble" in sections and sections["preamble"]:
        renderables.append(Markdown(sections["preamble"]))

    # 1. Trip Summary
    if "trip_summary" in sections and sections["trip_summary"]:
        renderables.append(render_trip_summary(sections["trip_summary"]))

    # 2. Flight Information
    if "flight_info" in sections and sections["flight_info"]:
        renderables.append(render_flight_info(sections["flight_info"]))

    # 3. Hotel Suggestions
    if "hotel_suggestions" in sections and sections["hotel_suggestions"]:
        renderables.append(render_hotel_suggestions(sections["hotel_suggestions"]))

    # 4. Day-by-Day Itinerary
    if "day_by_day" in sections and sections["day_by_day"]:
        day_panels = render_day_by_day(sections["day_by_day"])
        renderables.extend(day_panels)

    # 5. Estimated Budget
    if "budget" in sections and sections["budget"]:
        renderables.append(render_budget(sections["budget"]))

    # 6. Final Recommendations
    if "recommendations" in sections and sections["recommendations"]:
        renderables.append(render_recommendations(sections["recommendations"]))

    # Completion Footer
    renderables.append(render_footer(llm_calls=llm_calls, thread_id=thread_id))

    return renderables


def print_travel_plan(data: str | dict[str, Any], console: Console | None = None) -> None:
    """Print the formatted travel plan to the terminal using Rich.

    Args:
        data: Either a response dict from run_travel_agent or the raw answer string.
        console: Optional Rich Console. If omitted, uses the safe default console.
    """
    con = console or _default_console
    renderables = format_travel_plan(data)
    for item in renderables:
        con.print(item)
        con.print()  # subtle vertical spacing between sections
