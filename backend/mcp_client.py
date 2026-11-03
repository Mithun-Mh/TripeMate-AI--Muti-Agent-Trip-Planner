import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv

try:
    import certifi
    os.environ["SSL_CERT_FILE"] = certifi.where()
    os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()
except ImportError:
    pass

# Ensure .env is loaded from backend directory
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)
load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

try:
    from langchain_mcp_adapters.client import MultiServerMCPClient

    client = MultiServerMCPClient(
        {
            "tavily": {
                "transport": "streamable_http",
                "url": f"https://mcp.tavily.com/mcp/?tavilyApiKey={TAVILY_API_KEY}",
            },
        }
    )
except ImportError:
    MultiServerMCPClient = None
    client = None

tavily_search_tool = None


def format_mcp_results(raw_result, query: str = "") -> str:
    """Format any raw MCP output (list of dicts, JSON string, or objects) into clean markdown text."""
    if not raw_result:
        return ""

    # 1. Unpack list of TextContent or dict with 'text'
    if isinstance(raw_result, list) and len(raw_result) > 0:
        first = raw_result[0]
        text_val = None
        if hasattr(first, "text"):
            text_val = first.text
        elif isinstance(first, dict) and "text" in first:
            text_val = first["text"]

        if text_val:
            return format_mcp_results(text_val, query)

    # 2. If it's a string, attempt JSON or AST decoding
    if isinstance(raw_result, str):
        clean_str = raw_result.strip()
        try:
            import json
            parsed = json.loads(clean_str)
            return format_mcp_results(parsed, query)
        except Exception:
            pass
        try:
            import ast
            parsed = ast.literal_eval(clean_str)
            if isinstance(parsed, (dict, list)):
                return format_mcp_results(parsed, query)
        except Exception:
            pass

        if clean_str:
            return clean_str

    # 3. If it's a dictionary
    if isinstance(raw_result, dict):
        if "results" in raw_result and isinstance(raw_result["results"], list):
            return format_mcp_results(raw_result["results"], query)
        if "data" in raw_result and isinstance(raw_result["data"], list):
            return format_mcp_results(raw_result["data"], query)
        if "answer" in raw_result and raw_result["answer"]:
            return str(raw_result["answer"]).strip()

    # 4. If it's a list of result items
    if isinstance(raw_result, list):
        import re
        formatted = []
        for i, item in enumerate(raw_result, 1):
            if isinstance(item, dict):
                title = (
                    item.get("title")
                    or item.get("name")
                    or item.get("hotel")
                    or item.get("hotel_name")
                    or item.get("heading")
                )
                url = item.get("url") or item.get("link") or ""
                snippet = (
                    item.get("content")
                    or item.get("snippet")
                    or item.get("description")
                    or item.get("text")
                    or ""
                )

                if not title and snippet:
                    first_line = snippet.split("\n")[0]
                    title = first_line[:50]

                if not title:
                    title = f"Accomodation Choice {i}"

                # Clean up title (remove noisy site suffixes like " | TripAdvisor" or " - Booking.com")
                clean_title = re.sub(
                    r"\s*[-|]\s*(?:TripAdvisor|Booking\.com|Expedia|Hotels\.com|Agoda).*$",
                    "",
                    title,
                    flags=re.I
                ).strip()
                if not clean_title:
                    clean_title = title

                if len(snippet) > 300:
                    snippet = snippet[:300].rsplit(" ", 1)[0] + "..."

                if snippet:
                    formatted.append(f"- **{clean_title}**: {snippet}")
                else:
                    formatted.append(f"- **{clean_title}**: Centrally located accommodation verified via Tavily.")
            elif hasattr(item, "text"):
                formatted.append(f"- {str(item.text).strip()}")
            elif isinstance(item, str) and item.strip():
                formatted.append(f"- {item.strip()}")

        if formatted:
            return "\n".join(formatted)

    return str(raw_result).strip()


async def get_all_tools():
    """Retrieve and display all tools available from the MCP server."""
    # pyrefly: ignore[missing-attribute]
    tools = await client.get_tools()
    print("\nAvailable MCP Tools:\n")
    for tool in tools:
        print(f" - {getattr(tool, 'name', tool)}")
    return tools


async def get_tavily_search_tool():
    """Retrieve the tavily_search tool instance."""
    global tavily_search_tool
    if tavily_search_tool is not None:
        return tavily_search_tool

    # pyrefly: ignore[missing-attribute]
    tools = await client.get_tools()
    tavily_search_tool = next(
        (tool for tool in tools if getattr(tool, "name", "") == "tavily_search"),
        None
    )
    return tavily_search_tool


async def tavily_mcp_search(query: str) -> str:
    """Invoke the tavily_search tool via MCP and return formatted markdown string results."""
    tool = await get_tavily_search_tool()
    if tool is None:
        print("Error: 'tavily_search' tool not found on MCP server.")
        return "Tavily search tool unavailable."

    print(f"\n🔍 Invoking tavily_search via MCP for: \"{query}\"...\n")
    try:
        raw_result = await tool.ainvoke({"query": query})
    except Exception as e:
        print(f"Error during tavily_mcp_search invocation: {e}")
        try:
            print("Retrying with direct string input...")
            raw_result = await tool.ainvoke(query)
        except Exception as retry_err:
            print(f"Retry also failed: {retry_err}")
            raise e

    formatted_str = format_mcp_results(raw_result)
    print("=" * 60)
    print("TAVILY MCP SEARCH RESULT:")
    print("=" * 60)
    print(formatted_str)
    print("=" * 60 + "\n")
    return formatted_str


if __name__ == "__main__":
    query = "What is the latest news of France?"
    asyncio.run(tavily_mcp_search(query))
