from pathlib import Path
import sys
from typing import Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure backend root is on sys.path
backend_dir = str(Path(__file__).resolve().parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from backend import run_travel_agent

app = FastAPI(
    title="TripMate AI API",
    description="Multi-Agent Trip Planner Backend powered by LangGraph, Gemini & Tavily",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TravelRequest(BaseModel):
    query: str = Field(..., description="Natural language travel request", min_length=3)
    thread_id: Optional[str] = Field(None, description="Optional conversation / session thread ID")


class TravelResponse(BaseModel):
    thread_id: str
    answer: str
    flight_results: str = ""
    hotel_results: str = ""
    itinerary: str = ""
    llm_calls: int = 0


@app.get("/")
def root():
    return {
        "message": "TripMate AI Multi-Agent API is running",
        "docs": "/docs",
        "health": "/api/health",
        "plan_endpoint": "/api/plan"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "TripMate AI Multi-Agent Backend",
        "agents": [
            "Flight Agent (SerpApi/Mock)",
            "Hotel Agent (Tavily)",
            "Itinerary Agent (Gemini)",
            "Final Response Agent (Gemini)"
        ]
    }


@app.post("/api/plan", response_model=TravelResponse)
def create_travel_plan(payload: TravelRequest):
    try:
        result = run_travel_agent(
            user_input=payload.query,
            thread_id=payload.thread_id
        )
        return TravelResponse(
            thread_id=result.get("thread_id", ""),
            answer=result.get("answer", ""),
            flight_results=result.get("flight_results", ""),
            hotel_results=result.get("hotel_results", ""),
            itinerary=result.get("itinerary", ""),
            llm_calls=result.get("llm_calls", 0),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Travel planner agent error: {str(exc)}"
        )


# Backward-compatible alias
@app.post("/plan", response_model=TravelResponse)
def create_travel_plan_alias(payload: TravelRequest):
    # pyrefly: ignore[bad-argument-type]
    return create_travel_plan(payload)
