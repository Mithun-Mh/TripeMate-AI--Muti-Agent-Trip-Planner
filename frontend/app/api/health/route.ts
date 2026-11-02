import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${BACKEND_URL}/api/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        connected: true,
        backendUrl: BACKEND_URL,
        details: data,
      });
    } else {
      return NextResponse.json({
        connected: false,
        backendUrl: BACKEND_URL,
        error: `FastAPI responded with HTTP ${res.status}`,
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      connected: false,
      backendUrl: BACKEND_URL,
      error: message,
    });
  }
}

