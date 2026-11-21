import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  AnalyticsEvent,
  AnalyticsEventType,
  InteractionStage,
  BranchId,
  MetricSummary,
} from "@/types/analytics";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";

const DATA_DIR = path.join(process.cwd(), ".data");
const EVENTS_FILE = path.join(DATA_DIR, "analytics_events.json");
const TABLE_NAME = "analytics_events";

// Ensure local persistence directory exists (dev/fallback only)
function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // In serverless read-only environments fallback gracefully
    }
  }
}

// Memory fallback store for environments without persistent local filesystem or Supabase
let memoryEvents: AnalyticsEvent[] = [];

// Local deduplication cache (used only when Supabase is not configured)
const dedupCache = new Map<string, number>();
const DEDUP_WINDOW_MS = 15000;

interface SupabaseEventRow {
  id: string;
  type: AnalyticsEventType;
  stage: InteractionStage;
  timestamp: string;
  branch_id: BranchId | null;
  service_name: string | null;
  source: string;
  origin_url: string;
  session_id: string;
  dedup_key: string | null;
  metadata: Record<string, unknown> | null;
  is_test: boolean;
}

function rowToEvent(row: SupabaseEventRow): AnalyticsEvent {
  return {
    id: row.id,
    type: row.type,
    stage: row.stage,
    timestamp: row.timestamp,
    branchId: row.branch_id || undefined,
    serviceName: row.service_name || undefined,
    source: row.source,
    originUrl: row.origin_url,
    sessionId: row.session_id,
    dedupKey: row.dedup_key || undefined,
    metadata: row.metadata || undefined,
    isTest: Boolean(row.is_test),
  };
}

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

function readLocalEvents(): AnalyticsEvent[] {
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

function writeLocalEvents(events: AnalyticsEvent[]) {
  ensureStorage();
  memoryEvents = events;
  try {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), "utf-8");
  } catch {
    // In serverless without Supabase, memory fallback is used
  }
}

export interface StoredEventsQuery {
  startDate?: Date;
  endDate?: Date;
  includeTest?: boolean;
}

/**
 * Loads events asynchronously from Supabase (when configured) or local storage.
 * Excludes test events (`is_test = true`) by default to keep commercial metrics clean.
 */
export async function getStoredEvents(
  options: StoredEventsQuery = {}
): Promise<AnalyticsEvent[]> {
  const { startDate, endDate, includeTest = false } = options;
  const supabase = getSupabaseAdmin();

  if (supabase) {
    let query = supabase
      .from(TABLE_NAME)
      .select(
        "id, type, stage, timestamp, branch_id, service_name, source, origin_url, session_id, dedup_key, metadata, is_test"
      )
      .order("timestamp", { ascending: true })
      .limit(20000);

    if (!includeTest) {
      query = query.eq("is_test", false);
    }
    if (startDate) {
      query = query.gte("timestamp", startDate.toISOString());
    }
    if (endDate) {
      query = query.lte("timestamp", endDate.toISOString());
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Supabase read error: ${error.message}`);
    }
    return (data as SupabaseEventRow[] | null)?.map(rowToEvent) || [];
  }

  // Local fallback (development / pre-Supabase)
  const all = readLocalEvents();
  return all.filter((e) => {
    if (!includeTest && e.isTest) return false;
    const t = new Date(e.timestamp).getTime();
    if (startDate && t < startDate.getTime()) return false;
    if (endDate && t > endDate.getTime()) return false;
    return true;
  });
}

/**
 * Records an analytics event asynchronously with validation, deduplication, and safe sanitization.
 * Persists to Supabase `analytics_events` via Service Role when configured.
 */
export async function recordEvent(raw: {
  type: AnalyticsEventType;
  source: string;
  originUrl?: string;
  branchId?: BranchId;
  serviceName?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  isTest?: boolean;
}): Promise<{
  success: boolean;
  deduplicated?: boolean;
  storage: "supabase" | "local";
  event?: AnalyticsEvent;
}> {
  const now = Date.now();
  const sessionId = (raw.sessionId || "anon_" + crypto.randomBytes(8).toString("hex")).slice(0, 80);
  const branchId = raw.branchId;
  const source = (raw.source || "unknown").slice(0, 50);
  const originUrl = (raw.originUrl || "/").slice(0, 200);
  const serviceName = raw.serviceName ? String(raw.serviceName).slice(0, 60) : undefined;
  const isTest = Boolean(raw.isTest);

  const dedupKey = `${sessionId}_${raw.type}_${branchId || "all"}_${serviceName || ""}_${source}_${isTest ? "test" : "real"}`;
  const stage = mapTypeToStage(raw.type);

  const event: AnalyticsEvent = {
    id: "evt_" + crypto.randomBytes(12).toString("hex"),
    type: raw.type,
    stage,
    timestamp: new Date(now).toISOString(),
    branchId,
    serviceName,
    source,
    originUrl,
    sessionId,
    dedupKey,
    metadata: raw.metadata,
    isTest,
  };

  const supabase = getSupabaseAdmin();

  if (supabase) {
    // Persistent cross-instance deduplication window (15s)
    const windowStartIso = new Date(now - DEDUP_WINDOW_MS).toISOString();
    const { data: recent, error: dedupError } = await supabase
      .from(TABLE_NAME)
      .select("id")
      .eq("dedup_key", dedupKey)
      .gte("timestamp", windowStartIso)
      .limit(1);

    if (dedupError) {
      throw new Error(`Supabase dedup check error: ${dedupError.message}`);
    }

    if (recent && recent.length > 0) {
      return { success: true, deduplicated: true, storage: "supabase" };
    }

    const { error: insertError } = await supabase.from(TABLE_NAME).insert({
      id: event.id,
      type: event.type,
      stage: event.stage,
      timestamp: event.timestamp,
      branch_id: event.branchId ?? null,
      service_name: event.serviceName ?? null,
      source: event.source,
      origin_url: event.originUrl,
      session_id: event.sessionId,
      dedup_key: event.dedupKey,
      metadata: event.metadata ?? null,
      is_test: event.isTest,
    });

    if (insertError) {
      throw new Error(`Supabase insert error: ${insertError.message}`);
    }

    return { success: true, deduplicated: false, storage: "supabase", event };
  }

  // Local fallback deduplication & storage
  const lastTimestamp = dedupCache.get(dedupKey);
  if (lastTimestamp && now - lastTimestamp < DEDUP_WINDOW_MS) {
    return { success: true, deduplicated: true, storage: "local" };
  }
  dedupCache.set(dedupKey, now);

  if (dedupCache.size > 2000) {
    for (const [k, ts] of dedupCache.entries()) {
      if (now - ts > DEDUP_WINDOW_MS) dedupCache.delete(k);
    }
  }

  const existing = readLocalEvents();
  existing.push(event);

  if (existing.length > 20000) {
    existing.splice(0, existing.length - 20000);
  }

  writeLocalEvents(existing);
  return { success: true, deduplicated: false, storage: "local", event };
}

export function getAnalyticsStorageMode(): "supabase" | "local_ephemeral" {
  return isSupabaseConfigured() ? "supabase" : "local_ephemeral";
}

/**
 * Aggregates events for a given date window.
 * Always excludes `isTest: true` events as a safeguard against test contamination.
 */
export function aggregateMetrics(
  events: AnalyticsEvent[],
  startDate: Date,
  endDate: Date
): MetricSummary {
  const filtered = events.filter((e) => {
    if (e.isTest) return false;
    const t = new Date(e.timestamp).getTime();
    return t >= startDate.getTime() && t <= endDate.getTime();
  });

  const branchBreakdown: Record<
    BranchId,
    { views: number; whatsappClicks: number; bookingRequests: number; reviewClicks: number }
  > = {
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

  const visitToContact = totalVisits > 0 ? (totalContacts / totalVisits) * 100 : 0;
  const contactToBookingRequest =
    totalContacts > 0 ? (totalBookingRequests / totalContacts) * 100 : 0;

  return {
    totalVisits,
    totalInteractions,
    totalClicks,
    totalContacts,
    totalBookingRequests,
    // Do not invent confirmed bookings or completed services from raw clicks
    confirmedBookingsEstimate: 0,
    completedServicesEstimate: 0,
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
export function getFilterDates(
  preset: string,
  customStart?: string,
  customEnd?: string
): { start: Date; end: Date } {
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
