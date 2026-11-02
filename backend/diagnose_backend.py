import os
import sys
import time
from pathlib import Path
from dotenv import load_dotenv

# Set UTF-8 stdout if needed
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)
load_dotenv()

print("=" * 60, flush=True)
print("TRIPMATE BACKEND DIAGNOSTIC TEST", flush=True)
print("=" * 60, flush=True)

# 1. Test PostgreSQL
print("\n[1/4] Testing PostgreSQL (Render)...", flush=True)
db_url = os.getenv("DATABASE_URL")
if not db_url:
    print("[FAIL] DATABASE_URL is missing!", flush=True)
else:
    try:
        import psycopg
        from psycopg.rows import dict_row
        t0 = time.time()
        conn = psycopg.connect(db_url, connect_timeout=5, row_factory=dict_row)
        with conn.cursor() as cur:
            cur.execute("SELECT 1;")
            val = cur.fetchone()
        conn.close()
        print(f"[OK] PostgreSQL connected in {time.time() - t0:.2f}s (result: {val})", flush=True)
    except Exception as e:
        print(f"[FAIL] PostgreSQL connection failed: {e}", flush=True)

# 2. Test Aviationstack
print("\n[2/4] Testing Aviationstack Flight API...", flush=True)
flight_key = os.getenv("AVIATIONSTACK_API_KEY")
if not flight_key:
    print("[FAIL] AVIATIONSTACK_API_KEY is missing!", flush=True)
else:
    try:
        import requests
        t0 = time.time()
        for protocol in ["http", "https"]:
            url = f"{protocol}://api.aviationstack.com/v1/flights"
            try:
                r = requests.get(url, params={"access_key": flight_key, "limit": 1}, timeout=5)
                print(f"  {protocol.upper()}: Status {r.status_code} in {time.time() - t0:.2f}s", flush=True)
            except Exception as e:
                print(f"  {protocol.upper()}: Failed - {e}", flush=True)
    except Exception as e:
        print(f"[FAIL] Aviationstack test error: {e}", flush=True)

# 3. Test Tavily
print("\n[3/4] Testing Tavily Search API...", flush=True)
tavily_key = os.getenv("TAVILY_API_KEY")
if not tavily_key:
    print("[FAIL] TAVILY_API_KEY is missing!", flush=True)
else:
    try:
        from tavily import TavilyClient
        t0 = time.time()
        client = TavilyClient(api_key=tavily_key)
        res = client.search("Hotels in Sri Lanka", max_results=1)
        print(f"[OK] Tavily returned {len(res.get('results', []))} results in {time.time() - t0:.2f}s", flush=True)
    except Exception as e:
        print(f"[FAIL] Tavily failed: {e}", flush=True)

# 4. Test Gemini LLM
print("\n[4/4] Testing Gemini LLM...", flush=True)
gemini_key = os.getenv("GOOGLE_API_KEY")
if not gemini_key:
    print("[FAIL] GOOGLE_API_KEY is missing!", flush=True)
else:
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        t0 = time.time()
        model_name = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
        llm = ChatGoogleGenerativeAI(model=model_name, api_key=gemini_key)
        res = llm.invoke("Reply with exactly: 'Gemini is online'")
        print(f"[OK] Gemini ({model_name}) responded in {time.time() - t0:.2f}s: {res.content.strip()[:60]}", flush=True)
    except Exception as e:
        print(f"[FAIL] Gemini failed: {e}", flush=True)

print("\n" + "=" * 60, flush=True)
