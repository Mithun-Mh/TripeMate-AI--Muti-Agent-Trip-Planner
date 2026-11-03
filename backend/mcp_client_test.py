import asyncio
import sys
from pathlib import Path

# Ensure backend directory is in sys.path
backend_dir = str(Path(__file__).resolve().parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from mcp_client import (
    client,
    get_all_tools,
    get_tavily_search_tool,
    tavily_mcp_search,
)

if __name__ == "__main__":
    query = "What is the latest news of France?"
    asyncio.run(tavily_mcp_search(query))
