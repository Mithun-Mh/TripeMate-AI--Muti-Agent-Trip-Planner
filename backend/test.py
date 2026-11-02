import sys
from pathlib import Path
import uuid
import time

# Ensure backend directory is in sys.path
backend_dir = str(Path(__file__).resolve().parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from tools.tavily_tool import tavily_search
from tools.flight_tool import search_flights
from backend import run_travel_agent
from utils.terminal_formatter import print_travel_plan

if __name__ == "__main__":
    user_input = input("Enter travel request: ")

    start_time = time.time()
    thread_id = f"test_{uuid.uuid4().hex[:6]}"
    print(f"\n🚀 [TripMate] Starting Multi-Agent Planner (Session: {thread_id})...\n")

    response = run_travel_agent(
        user_input=user_input,
        thread_id=thread_id
    )

    elapsed = time.time() - start_time
    print(f"\n[TripMate] Planning completed in {elapsed:.1f}s.\n")
    print_travel_plan(response)