/**
 * Client-side tracker utility for Barbería Carlyn.
 * Fires events to /api/analytics/collect with deduplication, session persistence and zero impact on UI.
 */
import { AnalyticsEventType, BranchId } from "@/types/analytics";

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sid = sessionStorage.getItem("_carlyn_sid");
  if (!sid) {
    sid = "s_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    try {
      sessionStorage.setItem("_carlyn_sid", sid);
    } catch {
      // ignore
    }
  }
  return sid;
}

export function trackEvent(
  type: AnalyticsEventType,
  options: {
    source: string;
    branchId?: BranchId;
    serviceName?: string;
    metadata?: Record<string, unknown>;
  }
) {
  if (typeof window === "undefined") return;

  const payload = {
    type,
    source: options.source,
    branchId: options.branchId,
    serviceName: options.serviceName,
    originUrl: window.location.pathname,
    sessionId: getSessionId(),
    metadata: options.metadata,
  };

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/collect", JSON.stringify(payload));
    } else {
      fetch("/api/analytics/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Fail silently without blocking UI
  }
}
