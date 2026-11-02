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
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout for multi-agent LLM reasoning

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
        // Fallback with backend error explanation
        return NextResponse.json(
          {
            error: `FastAPI Backend Error (${backendRes.status}): ${errorText}`,
            fallbackAvailable: true,
          },
          { status: 502 }
        );
      }
    } catch (fetchErr: unknown) {
      const errMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      console.warn("Backend unavailable, returning demo fallback guidance:", errMsg);

      return NextResponse.json(
        {
          error: `Backend unreachable at ${BACKEND_URL}. Ensure FastAPI is running with 'uvicorn app:app --reload'.`,
          fallbackAvailable: true,
          fallbackData: {
            ...SAMPLE_TRAVEL_RESPONSE,
            answer: `> [!NOTE]\n> Showing interactive preview: The live FastAPI backend is currently offline at \`${BACKEND_URL}\`.\n\n` + SAMPLE_TRAVEL_RESPONSE.answer,
          },
        },
        { status: 503 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

