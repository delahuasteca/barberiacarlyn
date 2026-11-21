import { NextRequest, NextResponse } from "next/server";
import { isOwnerAuthenticated } from "@/lib/auth";
import {
  getStoredEvents,
  aggregateMetrics,
  getFilterDates,
  getAnalyticsStorageMode,
} from "@/lib/analytics";
import { getIntegrationsHealth, getChatWebSummary } from "@/lib/integrations";

export async function GET(request: NextRequest) {
  if (!isOwnerAuthenticated(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const preset = searchParams.get("preset") || "30d";
    const customStart = searchParams.get("start") || undefined;
    const customEnd = searchParams.get("end") || undefined;

    const { start, end } = getFilterDates(preset, customStart, customEnd);

    // Period comparison (previous equivalent window)
    const durationMs = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - durationMs);

    const [allEvents, integrations, chatWebSummary] = await Promise.all([
      getStoredEvents({ startDate: prevStart, endDate: end, includeTest: false }),
      getIntegrationsHealth(),
      getChatWebSummary(),
    ]);

    const currentMetrics = aggregateMetrics(allEvents, start, end);
    const previousMetrics = aggregateMetrics(allEvents, prevStart, prevEnd);

    return NextResponse.json({
      filter: {
        preset,
        start: start.toISOString(),
        end: end.toISOString(),
        previousStart: prevStart.toISOString(),
        previousEnd: prevEnd.toISOString(),
      },
      metrics: currentMetrics,
      comparison: previousMetrics,
      integrations,
      chatWeb: chatWebSummary,
      totalEventsStored: allEvents.length,
      storageMode: getAnalyticsStorageMode(),
    });
  } catch {
    return NextResponse.json(
      { error: "Error al consultar métricas" },
      { status: 500 }
    );
  }
}
