import fs from "fs";
import path from "path";
import crypto from "crypto";
import { AnalyticsEvent, AnalyticsEventType, InteractionStage, BranchId, MetricSummary } from "@/types/analytics";

const DATA_DIR = path.join(process.cwd(), ".data");
const EVENTS_FILE = path.join(DATA_DIR, "analytics_events.json");

// Ensure local persistence directory exists
function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // In serverless read-only environments fallback gracefully
    }
  }
}

// Memory fallback store for environments without persistent local filesystem
let memoryEvents: AnalyticsEvent[] = [];

// Clean deduplication cache in-memory with TTL (e.g., prevent duplicate double clicks within 15 seconds)
const dedupCache = new Map<string, number>();
const DEDUP_WINDOW_MS = 15000;

/**
 * Maps event type to the strict interaction stage.
 * Explicitly separates: Visita != Interacción != Clic != Contacto != Solicitud != Venta
 */
export function mapTypeToStage(type: AnalyticsEventType): InteractionStage {
  switch (type) {
    case "branch_view":
    case "service_view":
      return "interaccion";
    case "review_click":
      return "clic";
    case "whatsapp_click":
    case "chat_started":
      return "contacto";
    case "booking_request":
    case "chat_lead":
      return "solicitud_cita";
    default:
      return "interaccion";
  }
}

/**
 * Loads events from file or memory.
 */
export function getStoredEvents(): AnalyticsEvent[] {
  ensureStorage();
  if (fs.existsSync(EVENTS_FILE)) {
    try {
      const raw = fs.readFileSync(EVENTS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // fall back to memory
    }
  }
  return memoryEvents;
}

/**
 * Saves events to storage or memory.
 */
function saveEvents(events: AnalyticsEvent[]) {
  ensureStorage();
  memoryEvents = events;
  try {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), "utf-8");
  } catch {
    // In serverless, memory fallback is used
  }
}

/**
 * Records an analytics event with validation, deduplication, and safe sanitization.
 */
export function recordEvent(raw: {
  type: AnalyticsEventType;
  source: string;
  originUrl?: string;
  branchId?: BranchId;
  serviceName?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}): { success: boolean; deduplicated?: boolean; event?: AnalyticsEvent } {
  const now = Date.now();
  const sessionId = raw.sessionId || "anon_" + crypto.randomBytes(8).toString("hex");
  const branchId = raw.branchId;
  const source = (raw.source || "unknown").slice(0, 50);
  const originUrl = (raw.originUrl || "/").slice(0, 200);

  // Compute deduplication key
  const dedupKey = `${sessionId}_${raw.type}_${branchId || "all"}_${raw.serviceName || ""}_${source}`;
  const lastTimestamp = dedupCache.get(dedupKey);

  if (lastTimestamp && now - lastTimestamp < DEDUP_WINDOW_MS) {
    return { success: true, deduplicated: true };
  }
  dedupCache.set(dedupKey, now);

  // Clean stale keys periodically
  if (dedupCache.size > 2000) {
    for (const [k, ts] of dedupCache.entries()) {
      if (now - ts > DEDUP_WINDOW_MS) dedupCache.delete(k);
    }
  }

  const stage = mapTypeToStage(raw.type);

  const event: AnalyticsEvent = {
    id: "evt_" + crypto.randomBytes(12).toString("hex"),
    type: raw.type,
    stage,
    timestamp: new Date(now).toISOString(),
    branchId,
    serviceName: raw.serviceName ? String(raw.serviceName).slice(0, 60) : undefined,
    source,
    originUrl,
    sessionId,
    dedupKey,
    metadata: raw.metadata,
  };

  const existing = getStoredEvents();
  existing.push(event);

  // Keep up to 20,000 events locally to avoid unbound file growth
  if (existing.length > 20000) {
    existing.splice(0, existing.length - 20000);
  }

  saveEvents(existing);
  return { success: true, event };
}

/**
 * Aggregates events for a given date window.
 */
export function aggregateMetrics(
  events: AnalyticsEvent[],
  startDate: Date,
  endDate: Date
): MetricSummary {
  const filtered = events.filter((e) => {
    const t = new Date(e.timestamp).getTime();
    return t >= startDate.getTime() && t <= endDate.getTime();
  });

  const branchBreakdown: Record<BranchId, { views: number; whatsappClicks: number; bookingRequests: number; reviewClicks: number }> = {
    "aviacion-civil": { views: 0, whatsappClicks: 0, bookingRequests: 0, reviewClicks: 0 },
    "ex-glorieta": { views: 0, whatsappClicks: 0, bookingRequests: 0, reviewClicks: 0 },
    jacarandas: { views: 0, whatsappClicks: 0, bookingRequests: 0, reviewClicks: 0 },
  };

  const serviceViewCounts: Record<string, number> = {};

  let totalVisits = 0;
  let totalInteractions = 0;
  let totalClicks = 0;
  let totalContacts = 0;
  let totalBookingRequests = 0;

  // Use unique sessions for visit count estimation
  const uniqueSessions = new Set<string>();

  for (const ev of filtered) {
    uniqueSessions.add(ev.sessionId);

    if (ev.stage === "interaccion") totalInteractions++;
    if (ev.stage === "clic") totalClicks++;
    if (ev.stage === "contacto") totalContacts++;
    if (ev.stage === "solicitud_cita") totalBookingRequests++;

    if (ev.branchId && branchBreakdown[ev.branchId]) {
      if (ev.type === "branch_view") branchBreakdown[ev.branchId].views++;
      if (ev.type === "whatsapp_click") branchBreakdown[ev.branchId].whatsappClicks++;
      if (ev.type === "booking_request") branchBreakdown[ev.branchId].bookingRequests++;
      if (ev.type === "review_click") branchBreakdown[ev.branchId].reviewClicks++;
    }

    if (ev.serviceName) {
      serviceViewCounts[ev.serviceName] = (serviceViewCounts[ev.serviceName] || 0) + 1;
    }
  }

  totalVisits = uniqueSessions.size;

  const topServices = Object.entries(serviceViewCounts)
    .map(([name, views]) => ({ name, views }))
    .sort((a, b) => b.views - a.views);

  // Conversion rates (safely bounded)
  const visitToContact = totalVisits > 0 ? (totalContacts / totalVisits) * 100 : 0;
  const contactToBookingRequest =
    totalContacts > 0 ? (totalBookingRequests / totalContacts) * 100 : 0;

  return {
    totalVisits,
    totalInteractions,
    totalClicks,
    totalContacts,
    totalBookingRequests,
    // Explicitly labeled as distinct estimates, never assumed automatically as executed revenue
    confirmedBookingsEstimate: Math.round(totalBookingRequests * 0.75),
    completedServicesEstimate: Math.round(totalBookingRequests * 0.65),
    branchBreakdown,
    topServices,
    conversionRates: {
      visitToContact: parseFloat(visitToContact.toFixed(1)),
      contactToBookingRequest: parseFloat(contactToBookingRequest.toFixed(1)),
    },
  };
}

/**
 * Returns preset start/end dates for standard filter options.
 */
export function getFilterDates(preset: string, customStart?: string, customEnd?: string): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0, 0);

  if (preset === "30d") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30, 0, 0, 0, 0);
  } else if (preset === "current_month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  } else if (preset === "previous_month") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    const lastDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { start, end: lastDayPrevMonth };
  } else if (preset === "custom" && customStart && customEnd) {
    const s = new Date(customStart + "T00:00:00");
    const e = new Date(customEnd + "T23:59:59");
    if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
      return { start: s, end: e };
    }
  }

  return { start, end };
}
