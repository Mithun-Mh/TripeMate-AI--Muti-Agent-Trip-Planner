# TripMate AI — Next.js Frontend

A modern, minimalist, eye-catching travel planner UI designed to seamlessly match the TripMate multi-agent backend architecture (LangGraph, Gemini 3.8, Tavily, SerpApi).

## 🎨 Theme & Palette Alignment

The frontend design directly aligns with the backend's terminal formatter color system:

| Section | Color Theme | Agent / Source |
| :--- | :--- | :--- |
| **01. Trip Summary** | Cyan / Deep Blue | Parameters Synthesis |
| **02. Flight Information** | Dodger Blue / Sky | Flight Agent (Live & Airline Options) |
| **03. Hotel Suggestions** | Orchid / Violet | Hotel Agent (Tavily Search) |
| **04. Day-by-Day Itinerary** | Amber / Gold | Itinerary Agent (Gemini 3.8 Daily Schedule) |
| **05. Estimated Budget** | Emerald Green | Finance Agent (Itemized Breakdown & Savings) |
| **06. Recommendations** | Warm Amber / Yellow | Travel Advisor (Visa, Currency, Customs) |

---

## 🚀 Quick Start

### 1. Start the FastAPI Backend
In a terminal:
```bash
cd backend
uvicorn app:app --reload --port 8000
```
API docs available at: `http://127.0.0.1:8000/docs`

### 2. Start the Next.js Frontend
In another terminal:
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Features

- **Multi-Agent Pipeline Visualizer**: Real-time progress monitoring across the 4 LangGraph agents (Flight Agent → Hotel Agent → Itinerary Agent → Final Agent).
- **Interactive Preset Chips**: 1-click popular travel requests (Germany to Sri Lanka, Tokyo & Kyoto, Paris & Swiss Alps, Kenya Safari).
- **Instant Demo Mode**: Includes an embedded offline preview with 1-click loading without requiring live API keys.
- **Section Filtering Tabs**: Switch seamlessly between the complete plan, dedicated flight cards, hotel suggestions, daily timeline, budget table, and travel tips.
- **Agent Inspector**: Inspect raw agent state outputs (`flight_results`, `hotel_results`, `llm_calls`, `thread_id`) and copy full markdown with one click.
- **FastAPI Proxy**: Server-side Next.js route handler (`/api/plan`) with automatic fallback handling if the backend is temporarily offline.
