import { NextRequest, NextResponse } from "next/server";
import { recordEvent } from "@/lib/analytics";
import { AnalyticsEventType, BranchId } from "@/types/analytics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !body.type || !body.source) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validTypes: AnalyticsEventType[] = [
      "branch_view",
      "service_view",
      "whatsapp_click",
      "booking_request",
      "chat_started",
      "chat_lead",
      "review_click",
    ];

    if (!validTypes.includes(body.type)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    const result = recordEvent({
      type: body.type,
      source: body.source,
      originUrl: body.originUrl,
      branchId: body.branchId as BranchId | undefined,
      serviceName: body.serviceName,
      sessionId: body.sessionId,
      metadata: body.metadata,
    });

    return NextResponse.json({ ok: true, deduplicated: result.deduplicated });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal collection error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
