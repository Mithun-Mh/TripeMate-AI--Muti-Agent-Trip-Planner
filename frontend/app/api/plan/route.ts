import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_TRAVEL_RESPONSE } from "@/lib/samplePlan";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, thread_id, useDemo } = body;

    if (useDemo || !query) {
      return NextResponse.json(SAMPLE_TRAVEL_RESPONSE);
    }

    // Try communicating with FastAPI backend
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

      const backendRes = await fetch(`${BACKEND_URL}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          thread_id: thread_id || undefined,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json({
          ...data,
          isDemo: false,
        });
      } else {
        const errorText = await backendRes.text();
        console.warn("FastAPI backend error:", errorText);
        return NextResponse.json(
          {
            error: `FastAPI Backend Error (${backendRes.status}): ${errorText}`,
          },
          { status: backendRes.status || 502 }
        );
      }
    } catch (fetchErr: unknown) {
      const errMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      const isTimeout = fetchErr instanceof Error && fetchErr.name === "AbortError";
      console.warn("Backend communication issue:", errMsg);

      return NextResponse.json(
        {
          error: isTimeout
            ? "Request timed out after 60s while multi-agent pipeline was running. Please ensure FastAPI backend is responsive."
            : `Cannot connect to FastAPI backend at ${BACKEND_URL}. Please ensure your backend is started with: 'uvicorn app:app --reload --port 8000'`,
        },
        { status: isTimeout ? 504 : 503 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

