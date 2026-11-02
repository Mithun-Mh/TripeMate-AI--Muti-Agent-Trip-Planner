import os 
from pathlib import Path
import certifi
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)
load_dotenv()

os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()

from typing import Any, cast
from typing_extensions import TypedDict, Annotated
import operator
import uuid

# pyrefly: ignore[missing-import]
import psycopg
# pyrefly: ignore[missing-import]
from psycopg.rows import dict_row

# pyrefly: ignore[missing-import]
from langgraph.graph import StateGraph, START, END
# pyrefly: ignore[missing-import]
from langgraph.checkpoint.postgres import PostgresSaver
# pyrefly: ignore[missing-import]
from langchain_core.messages import (
    AnyMessage,
    HumanMessage,
    AIMessage,
    SystemMessage,
)

# pyrefly: ignore[missing-import]
from langchain_google_genai import ChatGoogleGenerativeAI

try:
    from tools.tavily_tool import tavily_search
    from tools.flight_tool import search_flights
except ImportError:
    from backend.tools.tavily_tool import tavily_search
    from backend.tools.flight_tool import search_flights

try:
    from synthesizer import synthesize_itinerary_content, synthesize_complete_travel_plan
except ImportError:
    from backend.synthesizer import synthesize_itinerary_content, synthesize_complete_travel_plan


def get_database_url():
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        raise ValueError(
            "DATABASE_URL is missing. Please add your Render PostgreSQL External Database URL to .env"
        )

    if "sslmode=" not in database_url:
        separator = "&" if "?" in database_url else "?"
        database_url = f"{database_url}{separator}sslmode=require"

    return database_url


GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# =========================
# LLM
# =========================

if GOOGLE_API_KEY:
    llm = ChatGoogleGenerativeAI(
        model=os.getenv("GEMINI_MODEL", "gemini-3.8-flash"),
        api_key=GOOGLE_API_KEY,
        max_retries=1,
        timeout=25,
    )

else:
    raise ValueError("Missing API key. Please add GOOGLE_API_KEY or GROQ_API_KEY to your .env file.")


# =========================
# State
# =========================

class TravelState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]
    user_query: str
    flight_results: str
    hotel_results: str
    itinerary: str
    llm_calls: int


# =========================
# Flight Agent
# =========================

def flight_agent(state: TravelState):
    print("✈️  [1/4] Flight Agent: Searching live flight data...")
    query = state["user_query"]
    flight_data = search_flights(query)

    return {
        "flight_results": flight_data,
        "messages": [
            AIMessage(content="Flight results fetched.")
        ],
        "llm_calls": state.get("llm_calls", 0) + 1
    }



# =========================
# Hotel Agent
# =========================

def hotel_agent(state: TravelState):
    print("🏨  [2/4] Hotel Agent: Searching accommodation via Tavily...")
    query = f"Best hotels for {state['user_query']}"
    hotel_results = tavily_search(query)

    return {
        "hotel_results": hotel_results,
        "messages": [
            AIMessage(content="Hotel information fetched.")
        ],
        "llm_calls": state.get("llm_calls", 0) + 1
    }




# =========================
# Itinerary Agent
# =========================

def itinerary_agent(state: TravelState):
    print("📅  [3/4] Itinerary Agent: Crafting day-by-day itinerary...")
    prompt = f"""
Create a complete travel itinerary.

User Query:
{state['user_query']}

Flight Results:
{state['flight_results']}

Hotel Results:
{state['hotel_results']}

Make the itinerary practical, budget-aware, and easy to follow.
"""

    itinerary_text = ""
    try:
        response = llm.invoke([
            SystemMessage(content="You are an expert travel planner."),
            HumanMessage(content=prompt)
        ])
        itinerary_text = str(response.content)
    except Exception as exc:
        print(f"⚠️  [3/4] Itinerary Agent LLM Notice: {exc}")
        print("⚡ Synthesizing customized day-by-day itinerary directly from live multi-agent intelligence...")
        itinerary_text = synthesize_itinerary_content(
            user_query=state['user_query'],
            flight_data=state.get('flight_results', ''),
            hotel_data=state.get('hotel_results', '')
        )

    return {
        "itinerary": itinerary_text,
        "messages": [AIMessage(content=itinerary_text)],
        "llm_calls": state.get("llm_calls", 0) + 1
    }



# =========================
# Final Response Agent
# =========================

def final_agent(state: TravelState):
    print("✨  [4/4] Final Agent: Formatting complete travel plan...")
    final_prompt = f"""
Generate the final travel response for the user.

User Request:
{state['user_query']}

Flights:
{state['flight_results']}

Hotels:
{state['hotel_results']}

Itinerary:
{state['itinerary']}

Format the final answer beautifully using these sections:

1. Trip Summary
2. Flight Information
3. Hotel Suggestions
4. Day-by-Day Itinerary
5. Estimated Budget
6. Final Recommendations

Important:
- Be clear and practical.
- Mention that live flight API may not provide ticket prices if pricing is unavailable.
- Keep the response useful for real travel planning.
"""

    final_text = ""
    try:
        response = llm.invoke([
            SystemMessage(content="You are a professional AI travel booking assistant."),
            HumanMessage(content=final_prompt)
        ])
        final_text = str(response.content)
    except Exception as exc:
        print(f"⚠️  [4/4] Final Agent LLM Notice: {exc}")
        print("⚡ Synthesizing complete travel package matching query and live agent results...")
        final_text = synthesize_complete_travel_plan(
            user_query=state['user_query'],
            flight_data=state.get('flight_results', ''),
            hotel_data=state.get('hotel_results', ''),
            itinerary_data=state.get('itinerary', '')
        )

    return {
        "messages": [AIMessage(content=final_text)],
        "llm_calls": state.get("llm_calls", 0) + 1
    }


# =========================
# Build Graph
# =========================

# pyrefly: ignore[bad-specialization]
graph = StateGraph(TravelState)

graph.add_node("flight_agent", flight_agent)
graph.add_node("hotel_agent", hotel_agent)
graph.add_node("itinerary_agent", itinerary_agent)
graph.add_node("final_agent", final_agent)

graph.add_edge(START, "flight_agent")
graph.add_edge("flight_agent", "hotel_agent")
graph.add_edge("hotel_agent", "itinerary_agent")
graph.add_edge("itinerary_agent", "final_agent")
graph.add_edge("final_agent", END)


# =========================
# Checkpointer Setup
# =========================

checkpointer = None
try:
    DATABASE_URL = get_database_url()
    _conn = cast(
        psycopg.Connection[dict[str, Any]],
        psycopg.connect(
            DATABASE_URL,
            autocommit=True,
            row_factory=dict_row,
            connect_timeout=5
        )
    )
    checkpointer = PostgresSaver(_conn)
    checkpointer.setup()
    print("✅ PostgreSQL checkpointer initialized.")
except Exception as exc:
    print(f"⚠️  PostgreSQL checkpointer unavailable ({exc}). Using in-memory checkpointer fallback.")
    from langgraph.checkpoint.memory import MemorySaver
    checkpointer = MemorySaver()

travel_graph = graph.compile(checkpointer=checkpointer)



# =========================
# Function for FastAPI
# =========================

def run_travel_agent(user_input: str, thread_id: str | None = None):
    if not thread_id:
        thread_id = f"user_{uuid.uuid4().hex}"

    config = {
        "configurable": {
            "thread_id": thread_id
        }
    }

    result = travel_graph.invoke(
        {
            "messages": [
                HumanMessage(content=user_input)
            ],
            "user_query": user_input,
            "flight_results": "",
            "hotel_results": "",
            "itinerary": "",
            "llm_calls": 0
        },
        config=config
    )

    final_answer = result["messages"][-1].content

    return {
        "thread_id": thread_id,
        "answer": final_answer,
        "flight_results": result.get("flight_results", ""),
        "hotel_results": result.get("hotel_results", ""),
        "itinerary": result.get("itinerary", ""),
        "llm_calls": result.get("llm_calls", 0),
    }