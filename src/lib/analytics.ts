import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  AnalyticsEvent,
  AnalyticsEventType,
  InteractionStage,
  BranchId,
  MetricSummary,
  BranchConversionRates,
  DailyTrendPoint,
} from "@/types/analytics";
import { getNeonSql, isNeonConfigured } from "@/lib/neonDb";
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

// Memory fallback store for environments without persistent local filesystem or DB
let memoryEvents: AnalyticsEvent[] = [];

// Local deduplication cache (used only when neither Neon nor Supabase is configured)
const dedupCache = new Map<string, number>();
const DEDUP_WINDOW_MS = 15000;

interface DatabaseEventRow {
  id: string;
  type: AnalyticsEventType;
  stage: InteractionStage;
  timestamp: string | Date;
  branch_id: BranchId | null;
  service_name: string | null;
  source: string;
  origin_url: string;
  session_id: string;
  dedup_key: string | null;
  metadata: Record<string, unknown> | null;
  is_test: boolean;
}

function rowToEvent(row: DatabaseEventRow): AnalyticsEvent {
  return {
    id: row.id,
    type: row.type,
    stage: row.stage,
    timestamp:
      row.timestamp instanceof Date
        ? row.timestamp.toISOString()
        : String(row.timestamp),
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
    // In serverless without DB, memory fallback is used
  }
}

export interface StoredEventsQuery {
  startDate?: Date;
  endDate?: Date;
  includeTest?: boolean;
}

/**
 * Loads events asynchronously using priority:
 * 1. Neon PostgreSQL (DATABASE_URL)
 * 2. Supabase (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
 * 3. Local storage fallback
 * Excludes test events (`is_test = true`) by default to keep commercial metrics clean.
 */
export async function getStoredEvents(
  options: StoredEventsQuery = {}
): Promise<AnalyticsEvent[]> {
  const { startDate, endDate, includeTest = false } = options;

  // Priority 1: Neon PostgreSQL
  const neonSql = getNeonSql();
  if (neonSql) {
    const startIso = startDate ? startDate.toISOString() : null;
    const endIso = endDate ? endDate.toISOString() : null;
    const rows = (await neonSql`
      SELECT
        id, type, stage, timestamp, branch_id, service_name,
        source, origin_url, session_id, dedup_key, metadata, is_test
      FROM public.analytics_events
      WHERE (${includeTest}::boolean = true OR is_test = false)
        AND (${startIso}::timestamptz IS NULL OR timestamp >= ${startIso}::timestamptz)
        AND (${endIso}::timestamptz IS NULL OR timestamp <= ${endIso}::timestamptz)
      ORDER BY timestamp ASC
      LIMIT 20000
    `) as DatabaseEventRow[];

    return rows.map(rowToEvent);
  }

  // Priority 2: Supabase (Preview intact)
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
    return (data as DatabaseEventRow[] | null)?.map(rowToEvent) || [];
  }

  // Priority 3: Local fallback (development / no DB configured)
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
 * Priority: Neon (DATABASE_URL) -> Supabase (SUPABASE_*) -> local storage.
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
  storage: "neon" | "supabase" | "local";
  event?: AnalyticsEvent;
}> {
  const now = Date.now();
  const sessionId = (
    raw.sessionId || "anon_" + crypto.randomBytes(8).toString("hex")
  ).slice(0, 80);
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

  // Priority 1: Neon PostgreSQL
  const neonSql = getNeonSql();
  if (neonSql) {
    const windowStartIso = new Date(now - DEDUP_WINDOW_MS).toISOString();
    const recent = (await neonSql`
      SELECT id
      FROM public.analytics_events
      WHERE dedup_key = ${dedupKey}
        AND timestamp >= ${windowStartIso}::timestamptz
      LIMIT 1
    `) as Array<{ id: string }>;

    if (recent.length > 0) {
      return { success: true, deduplicated: true, storage: "neon" };
    }

    const metadataJson = event.metadata ? JSON.stringify(event.metadata) : null;
    await neonSql`
      INSERT INTO public.analytics_events (
        id, type, stage, timestamp, branch_id, service_name,
        source, origin_url, session_id, dedup_key, metadata, is_test
      ) VALUES (
        ${event.id},
        ${event.type},
        ${event.stage},
        ${event.timestamp}::timestamptz,
        ${event.branchId ?? null},
        ${event.serviceName ?? null},
        ${event.source},
        ${event.originUrl},
        ${event.sessionId},
        ${event.dedupKey ?? ""},
        ${metadataJson}::jsonb,
        ${event.isTest ?? false}
      )
    `;

    return { success: true, deduplicated: false, storage: "neon", event };
  }

  // Priority 2: Supabase (Preview intact)
  const supabase = getSupabaseAdmin();
  if (supabase) {
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

  // Priority 3: Local fallback deduplication & storage
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

export function getAnalyticsStorageMode(): "neon" | "supabase" | "local_ephemeral" {
  if (isNeonConfigured()) return "neon";
  if (isSupabaseConfigured()) return "supabase";
  return "local_ephemeral";
}

const MEXICO_TZ = "America/Mexico_City";

function toMexicoDateKey(input: string | Date): string {
  const dateObj = input instanceof Date ? input : new Date(input);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MEXICO_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
}

function formatMexicoShortLabel(dateKey: string): string {
  const parts = dateKey.split("-");
  if (parts.length !== 3) return dateKey;
  const d = new Date(`${dateKey}T12:00:00Z`);
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
  }).format(d);
}

function safeRate(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return parseFloat(((numerator / denominator) * 100).toFixed(1));
}

/**
 * Aggregates events for a given date window.
 * Strictly read-only. Always excludes `isTest: true` events as a safeguard against test contamination.
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
  const pageMap = new Map<
    string,
    {
      events: number;
      sessions: Set<string>;
      whatsappClicks: number;
      bookingRequests: number;
      reviewClicks: number;
    }
  >();
  const sourceMap = new Map<string, { events: number; sessions: Set<string> }>();
  const dailyMap = new Map<
    string,
    {
      sessions: Set<string>;
      whatsappClicks: number;
      bookingRequests: number;
      reviewClicks: number;
      totalEvents: number;
    }
  >();

  let totalVisits = 0;
  let totalInteractions = 0;
  let totalClicks = 0;
  let totalContacts = 0;
  let totalBookingRequests = 0;
  let totalWhatsappClicks = 0;
  let totalReviewClicks = 0;

  const uniqueSessions = new Set<string>();

  for (const ev of filtered) {
    uniqueSessions.add(ev.sessionId);

    if (ev.stage === "interaccion") totalInteractions++;
    if (ev.stage === "clic") totalClicks++;
    if (ev.stage === "contacto") totalContacts++;
    if (ev.stage === "solicitud_cita") totalBookingRequests++;

    if (ev.type === "whatsapp_click") totalWhatsappClicks++;
    if (ev.type === "review_click") totalReviewClicks++;

    if (ev.branchId && branchBreakdown[ev.branchId]) {
      if (ev.type === "branch_view") branchBreakdown[ev.branchId].views++;
      if (ev.type === "whatsapp_click") branchBreakdown[ev.branchId].whatsappClicks++;
      if (ev.type === "booking_request") branchBreakdown[ev.branchId].bookingRequests++;
      if (ev.type === "review_click") branchBreakdown[ev.branchId].reviewClicks++;
    }

    if (ev.serviceName) {
      serviceViewCounts[ev.serviceName] = (serviceViewCounts[ev.serviceName] || 0) + 1;
    }

    // Page performance (origin_url)
    const origin = (ev.originUrl || "/").trim() || "/";
    let pageEntry = pageMap.get(origin);
    if (!pageEntry) {
      pageEntry = {
        events: 0,
        sessions: new Set<string>(),
        whatsappClicks: 0,
        bookingRequests: 0,
        reviewClicks: 0,
      };
      pageMap.set(origin, pageEntry);
    }
    pageEntry.events++;
    pageEntry.sessions.add(ev.sessionId);
    if (ev.type === "whatsapp_click") pageEntry.whatsappClicks++;
    if (ev.type === "booking_request") pageEntry.bookingRequests++;
    if (ev.type === "review_click") pageEntry.reviewClicks++;

    // Source performance (source)
    const src = (ev.source || "unknown").trim() || "unknown";
    let srcEntry = sourceMap.get(src);
    if (!srcEntry) {
      srcEntry = { events: 0, sessions: new Set<string>() };
      sourceMap.set(src, srcEntry);
    }
    srcEntry.events++;
    srcEntry.sessions.add(ev.sessionId);

    // Daily trend in America/Mexico_City
    const dayKey = toMexicoDateKey(ev.timestamp);
    let dayEntry = dailyMap.get(dayKey);
    if (!dayEntry) {
      dayEntry = {
        sessions: new Set<string>(),
        whatsappClicks: 0,
        bookingRequests: 0,
        reviewClicks: 0,
        totalEvents: 0,
      };
      dailyMap.set(dayKey, dayEntry);
    }
    dayEntry.sessions.add(ev.sessionId);
    dayEntry.totalEvents++;
    if (ev.type === "whatsapp_click") dayEntry.whatsappClicks++;
    if (ev.type === "booking_request") dayEntry.bookingRequests++;
    if (ev.type === "review_click") dayEntry.reviewClicks++;
  }

  totalVisits = uniqueSessions.size;

  const totalBranchViews =
    branchBreakdown["aviacion-civil"].views +
    branchBreakdown["ex-glorieta"].views +
    branchBreakdown.jacarandas.views;

  const branchIds: BranchId[] = ["aviacion-civil", "ex-glorieta", "jacarandas"];
  const branchRates = {} as Record<BranchId, BranchConversionRates>;
  for (const bid of branchIds) {
    const b = branchBreakdown[bid];
    branchRates[bid] = {
      viewToWhatsapp: safeRate(b.whatsappClicks, b.views),
      viewToBooking: safeRate(b.bookingRequests, b.views),
      shareOfViews: safeRate(b.views, totalBranchViews),
    };
  }

  const pagePerformance = Array.from(pageMap.entries())
    .map(([originUrl, v]) => ({
      originUrl,
      events: v.events,
      uniqueSessions: v.sessions.size,
      whatsappClicks: v.whatsappClicks,
      bookingRequests: v.bookingRequests,
      reviewClicks: v.reviewClicks,
    }))
    .sort((a, b) => b.events - a.events)
    .slice(0, 12);

  const sourcePerformance = Array.from(sourceMap.entries())
    .map(([source, v]) => ({
      source,
      events: v.events,
      uniqueSessions: v.sessions.size,
    }))
    .sort((a, b) => b.events - a.events)
    .slice(0, 12);

  // Build continuous daily trend in America/Mexico_City (up to 62 days; otherwise sorted active days)
  const startKey = toMexicoDateKey(startDate);
  const endKey = toMexicoDateKey(endDate);
  const startUtc = new Date(`${startKey}T12:00:00Z`);
  const endUtc = new Date(`${endKey}T12:00:00Z`);
  const daySpan = Math.round((endUtc.getTime() - startUtc.getTime()) / 86400000) + 1;

  const dailyTrend: DailyTrendPoint[] = [];
  if (daySpan > 0 && daySpan <= 62) {
    for (let i = 0; i < daySpan; i++) {
      const cur = new Date(startUtc.getTime() + i * 86400000);
      const key = cur.toISOString().slice(0, 10);
      const entry = dailyMap.get(key);
      dailyTrend.push({
        date: key,
        label: formatMexicoShortLabel(key),
        visits: entry ? entry.sessions.size : 0,
        whatsappClicks: entry ? entry.whatsappClicks : 0,
        bookingRequests: entry ? entry.bookingRequests : 0,
        reviewClicks: entry ? entry.reviewClicks : 0,
        totalEvents: entry ? entry.totalEvents : 0,
      });
    }
  } else {
    Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, entry]) => {
        dailyTrend.push({
          date: key,
          label: formatMexicoShortLabel(key),
          visits: entry.sessions.size,
          whatsappClicks: entry.whatsappClicks,
          bookingRequests: entry.bookingRequests,
          reviewClicks: entry.reviewClicks,
          totalEvents: entry.totalEvents,
        });
      });
  }

  const topServices = Object.entries(serviceViewCounts)
    .map(([name, views]) => ({ name, views }))
    .sort((a, b) => b.views - a.views);

  const visitToContact = safeRate(totalContacts, totalVisits);
  const contactToBookingRequest = safeRate(totalBookingRequests, totalContacts);

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
    branchRates,
    funnel: {
      visits: totalVisits,
      whatsappClicks: totalWhatsappClicks,
      bookingRequests: totalBookingRequests,
      reviewClicks: totalReviewClicks,
      visitToWhatsappRate: safeRate(totalWhatsappClicks, totalVisits),
      whatsappToBookingRate: safeRate(totalBookingRequests, totalWhatsappClicks),
      visitToBookingRate: safeRate(totalBookingRequests, totalVisits),
      visitToReviewRate: safeRate(totalReviewClicks, totalVisits),
    },
    pagePerformance,
    sourcePerformance,
    dailyTrend,
    topServices,
    conversionRates: {
      visitToContact,
      contactToBookingRequest,
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
