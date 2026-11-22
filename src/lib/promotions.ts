import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  Promotion,
  PromotionCreateInput,
  PromotionUpdateInput,
  PromotionStatus,
  PromotionCtaType,
  PromotionFrequencyMode,
  PromotionTargetBranch,
} from "@/types/promotions";
import { getNeonSql, isNeonConfigured } from "@/lib/neonDb";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";

const DATA_DIR = path.join(process.cwd(), ".data");
const PROMOTIONS_FILE = path.join(DATA_DIR, "promotions.json");
const TABLE_NAME = "promotions";

const VALID_BRANCHES: PromotionTargetBranch[] = [
  "all",
  "aviacion-civil",
  "ex-glorieta",
  "jacarandas",
];
const VALID_STATUSES: PromotionStatus[] = ["active", "paused"];
const VALID_CTA_TYPES: PromotionCtaType[] = ["whatsapp", "link"];
const VALID_FREQ_MODES: PromotionFrequencyMode[] = [
  "once_per_session",
  "once_per_day",
  "every_n_days",
];

const PATH_TO_BRANCH: Record<string, PromotionTargetBranch> = {
  "/barberia-huejutla-aviacion-civil": "aviacion-civil",
  "/barberia-huejutla-ex-glorieta": "ex-glorieta",
  "/barber-studio-jacarandas-huejutla": "jacarandas",
};

interface PromotionRow {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  cta_label: string;
  cta_url: string;
  cta_type: PromotionCtaType;
  target_branches: PromotionTargetBranch[] | null;
  target_paths: string[] | null;
  status: PromotionStatus;
  starts_at: string | Date | null;
  ends_at: string | Date | null;
  frequency_mode: PromotionFrequencyMode;
  frequency_days: number;
  delay_seconds: number;
  priority: number;
  created_at: string | Date;
  updated_at: string | Date;
}

function toIso(val: string | Date | null | undefined): string | undefined {
  if (!val) return undefined;
  return val instanceof Date ? val.toISOString() : String(val);
}

function rowToPromotion(row: PromotionRow): Promotion {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    imageUrl: row.image_url || undefined,
    ctaLabel: row.cta_label,
    ctaUrl: row.cta_url,
    ctaType: row.cta_type,
    targetBranches: Array.isArray(row.target_branches) && row.target_branches.length > 0
      ? row.target_branches
      : ["all"],
    targetPaths: Array.isArray(row.target_paths) ? row.target_paths : [],
    status: row.status,
    startsAt: toIso(row.starts_at),
    endsAt: toIso(row.ends_at),
    frequencyMode: row.frequency_mode,
    frequencyDays: Number(row.frequency_days) || 1,
    delaySeconds: Number(row.delay_seconds) || 0,
    priority: Number(row.priority) || 0,
    createdAt: toIso(row.created_at) || new Date().toISOString(),
    updatedAt: toIso(row.updated_at) || new Date().toISOString(),
  };
}

let memoryPromotions: Promotion[] = [];

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // read-only serverless fallback
    }
  }
}

function readLocalPromotions(): Promotion[] {
  ensureStorage();
  if (fs.existsSync(PROMOTIONS_FILE)) {
    try {
      const raw = fs.readFileSync(PROMOTIONS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fallback to memory
    }
  }
  return memoryPromotions;
}

function writeLocalPromotions(items: Promotion[]) {
  ensureStorage();
  memoryPromotions = items;
  try {
    fs.writeFileSync(PROMOTIONS_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch {
    // memory fallback
  }
}

export function getPromotionsStorageMode(): "neon" | "supabase" | "local_ephemeral" {
  if (isNeonConfigured()) return "neon";
  if (isSupabaseConfigured()) return "supabase";
  return "local_ephemeral";
}

/**
 * Strict URL validator: allows only https:// URLs or safe internal relative paths (/...).
 * Rejects javascript:, data:, vbscript:, http:, protocol-relative //..., and control chars.
 */
export function isSafeUrl(url: string, options: { allowRelative?: boolean; whatsappOnly?: boolean } = {}): boolean {
  const { allowRelative = true, whatsappOnly = false } = options;
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed.length > 1000 || /[\u0000-\u001F\u007F]/.test(trimmed)) {
    return false;
  }

  if (trimmed.startsWith("/")) {
    if (!allowRelative || whatsappOnly) return false;
    // Reject protocol-relative //evil.com and path traversal
    if (trimmed.startsWith("//") || trimmed.includes("..")) return false;
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return false;
    if (whatsappOnly) {
      const host = parsed.hostname.toLowerCase();
      return host === "wa.me" || host === "api.whatsapp.com" || host === "chat.whatsapp.com";
    }
    return true;
  } catch {
    return false;
  }
}

export function normalizePathname(rawPath: string): string {
  const trimmed = (rawPath || "/").trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("..")) {
    return "/";
  }
  const clean = trimmed.split("?")[0].split("#")[0];
  if (clean.length > 1 && clean.endsWith("/")) {
    return clean.slice(0, -1);
  }
  return clean || "/";
}

export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors?: string[];
}

export function validatePromotionCreate(raw: unknown): ValidationResult<PromotionCreateInput> {
  if (!raw || typeof raw !== "object") {
    return { valid: false, errors: ["Payload JSON inválido"] };
  }
  const body = raw as Record<string, unknown>;
  const errors: string[] = [];

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (title.length < 2 || title.length > 120) {
    errors.push("El título es obligatorio (2 a 120 caracteres).");
  }

  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (description.length > 600) {
    errors.push("La descripción no puede exceder 600 caracteres.");
  }

  const ctaLabel = typeof body.ctaLabel === "string" ? body.ctaLabel.trim() : "";
  if (ctaLabel.length < 2 || ctaLabel.length > 60) {
    errors.push("El texto del botón (ctaLabel) es obligatorio (2 a 60 caracteres).");
  }

  const ctaType: PromotionCtaType =
    typeof body.ctaType === "string" && VALID_CTA_TYPES.includes(body.ctaType as PromotionCtaType)
      ? (body.ctaType as PromotionCtaType)
      : "whatsapp";
  if (body.ctaType !== undefined && !VALID_CTA_TYPES.includes(body.ctaType as PromotionCtaType)) {
    errors.push("ctaType debe ser 'whatsapp' o 'link'.");
  }

  const ctaUrl = typeof body.ctaUrl === "string" ? body.ctaUrl.trim() : "";
  if (!isSafeUrl(ctaUrl, { allowRelative: ctaType === "link", whatsappOnly: ctaType === "whatsapp" })) {
    errors.push(
      ctaType === "whatsapp"
        ? "ctaUrl debe ser un enlace HTTPS válido de WhatsApp (wa.me, api.whatsapp.com o chat.whatsapp.com)."
        : "ctaUrl debe ser una URL HTTPS segura o una ruta interna (/...)."
    );
  }

  let imageUrl: string | undefined = undefined;
  if (body.imageUrl !== undefined && body.imageUrl !== null && String(body.imageUrl).trim() !== "") {
    const img = String(body.imageUrl).trim();
    if (!isSafeUrl(img, { allowRelative: true })) {
      errors.push("imageUrl debe ser una URL HTTPS segura o una ruta interna (/...).");
    } else {
      imageUrl = img;
    }
  }

  let targetBranches: PromotionTargetBranch[] = ["all"];
  if (body.targetBranches !== undefined) {
    if (!Array.isArray(body.targetBranches) || body.targetBranches.length === 0) {
      errors.push("targetBranches debe ser un arreglo con al menos una sucursal o 'all'.");
    } else {
      const invalid = body.targetBranches.filter(
        (b) => typeof b !== "string" || !VALID_BRANCHES.includes(b as PromotionTargetBranch)
      );
      if (invalid.length > 0) {
        errors.push("targetBranches contiene valores no permitidos.");
      } else {
        targetBranches = Array.from(new Set(body.targetBranches as PromotionTargetBranch[]));
      }
    }
  }

  let targetPaths: string[] = [];
  if (body.targetPaths !== undefined) {
    if (!Array.isArray(body.targetPaths)) {
      errors.push("targetPaths debe ser un arreglo de rutas.");
    } else {
      const normalized: string[] = [];
      for (const p of body.targetPaths) {
        if (typeof p !== "string" || !p.trim().startsWith("/") || p.trim().startsWith("//") || p.includes("..")) {
          errors.push("Todas las rutas en targetPaths deben ser rutas relativas válidas (/...).");
          break;
        }
        normalized.push(normalizePathname(p));
      }
      targetPaths = Array.from(new Set(normalized));
    }
  }

  const status: PromotionStatus =
    body.status === undefined
      ? "paused"
      : VALID_STATUSES.includes(body.status as PromotionStatus)
        ? (body.status as PromotionStatus)
        : (errors.push("status debe ser 'active' o 'paused'."), "paused");

  let startsAt: string | undefined = undefined;
  if (body.startsAt !== undefined && body.startsAt !== null && String(body.startsAt).trim() !== "") {
    const d = new Date(String(body.startsAt));
    if (isNaN(d.getTime())) {
      errors.push("startsAt no es una fecha ISO válida.");
    } else {
      startsAt = d.toISOString();
    }
  }

  let endsAt: string | undefined = undefined;
  if (body.endsAt !== undefined && body.endsAt !== null && String(body.endsAt).trim() !== "") {
    const d = new Date(String(body.endsAt));
    if (isNaN(d.getTime())) {
      errors.push("endsAt no es una fecha ISO válida.");
    } else {
      endsAt = d.toISOString();
    }
  }

  if (startsAt && endsAt && new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
    errors.push("endsAt debe ser posterior a startsAt.");
  }

  const frequencyMode: PromotionFrequencyMode =
    body.frequencyMode === undefined
      ? "once_per_day"
      : VALID_FREQ_MODES.includes(body.frequencyMode as PromotionFrequencyMode)
        ? (body.frequencyMode as PromotionFrequencyMode)
        : (errors.push("frequencyMode no válido."), "once_per_day");

  const frequencyDays = body.frequencyDays === undefined ? 1 : Number(body.frequencyDays);
  if (!Number.isInteger(frequencyDays) || frequencyDays < 1 || frequencyDays > 90) {
    errors.push("frequencyDays debe ser un entero entre 1 y 90.");
  }

  const delaySeconds = body.delaySeconds === undefined ? 3 : Number(body.delaySeconds);
  if (!Number.isInteger(delaySeconds) || delaySeconds < 0 || delaySeconds > 60) {
    errors.push("delaySeconds debe ser un entero entre 0 y 60.");
  }

  const priority = body.priority === undefined ? 10 : Number(body.priority);
  if (!Number.isInteger(priority) || priority < 0 || priority > 1000) {
    errors.push("priority debe ser un entero entre 0 y 1000.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      title,
      description,
      imageUrl,
      ctaLabel,
      ctaUrl,
      ctaType,
      targetBranches,
      targetPaths,
      status,
      startsAt,
      endsAt,
      frequencyMode,
      frequencyDays,
      delaySeconds,
      priority,
    },
  };
}

function sortPromotions(items: Promotion[]): Promotion[] {
  return [...items].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function listPromotions(): Promise<Promotion[]> {
  const neonSql = getNeonSql();
  if (neonSql) {
    const rows = (await neonSql`
      SELECT
        id, title, description, image_url, cta_label, cta_url, cta_type,
        target_branches, target_paths, status, starts_at, ends_at,
        frequency_mode, frequency_days, delay_seconds, priority,
        created_at, updated_at
      FROM public.promotions
      ORDER BY priority DESC, created_at DESC
      LIMIT 200
    `) as PromotionRow[];
    return rows.map(rowToPromotion);
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(
        "id, title, description, image_url, cta_label, cta_url, cta_type, target_branches, target_paths, status, starts_at, ends_at, frequency_mode, frequency_days, delay_seconds, priority, created_at, updated_at"
      )
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw new Error(`Supabase promotions read error: ${error.message}`);
    return (data as PromotionRow[] | null)?.map(rowToPromotion) || [];
  }

  return sortPromotions(readLocalPromotions());
}

export async function getPromotionById(id: string): Promise<Promotion | null> {
  const all = await listPromotions();
  return all.find((p) => p.id === id) || null;
}

export async function getActivePromotionForPath(rawPath: string): Promise<Promotion | null> {
  const pathname = normalizePathname(rawPath);
  if (pathname.startsWith("/propietario") || pathname.startsWith("/api")) {
    return null;
  }

  const all = await listPromotions();
  const nowMs = Date.now();
  const branchForPath = PATH_TO_BRANCH[pathname];

  const matching = all.filter((promo) => {
    if (promo.status !== "active") return false;
    if (promo.startsAt && new Date(promo.startsAt).getTime() > nowMs) return false;
    if (promo.endsAt && new Date(promo.endsAt).getTime() < nowMs) return false;

    const hasExplicitPaths = promo.targetPaths.length > 0;
    if (hasExplicitPaths) {
      if (promo.targetPaths.includes(pathname)) return true;
    }

    if (promo.targetBranches.includes("all")) {
      return !hasExplicitPaths;
    }

    if (branchForPath && promo.targetBranches.includes(branchForPath)) {
      return true;
    }

    return false;
  });

  return matching.length > 0 ? matching[0] : null;
}

export async function createPromotion(input: PromotionCreateInput): Promise<Promotion> {
  const nowIso = new Date().toISOString();
  const promo: Promotion = {
    id: "promo_" + crypto.randomBytes(10).toString("hex"),
    title: input.title,
    description: input.description || "",
    imageUrl: input.imageUrl || undefined,
    ctaLabel: input.ctaLabel,
    ctaUrl: input.ctaUrl,
    ctaType: input.ctaType || "whatsapp",
    targetBranches: input.targetBranches && input.targetBranches.length > 0 ? input.targetBranches : ["all"],
    targetPaths: input.targetPaths || [],
    status: input.status || "paused",
    startsAt: input.startsAt || undefined,
    endsAt: input.endsAt || undefined,
    frequencyMode: input.frequencyMode || "once_per_day",
    frequencyDays: input.frequencyDays ?? 1,
    delaySeconds: input.delaySeconds ?? 3,
    priority: input.priority ?? 10,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const neonSql = getNeonSql();
  if (neonSql) {
    await neonSql`
      INSERT INTO public.promotions (
        id, title, description, image_url, cta_label, cta_url, cta_type,
        target_branches, target_paths, status, starts_at, ends_at,
        frequency_mode, frequency_days, delay_seconds, priority,
        created_at, updated_at
      ) VALUES (
        ${promo.id},
        ${promo.title},
        ${promo.description},
        ${promo.imageUrl ?? null},
        ${promo.ctaLabel},
        ${promo.ctaUrl},
        ${promo.ctaType},
        ${promo.targetBranches}::text[],
        ${promo.targetPaths}::text[],
        ${promo.status},
        ${promo.startsAt ?? null}::timestamptz,
        ${promo.endsAt ?? null}::timestamptz,
        ${promo.frequencyMode},
        ${promo.frequencyDays},
        ${promo.delaySeconds},
        ${promo.priority},
        ${promo.createdAt}::timestamptz,
        ${promo.updatedAt}::timestamptz
      )
    `;
    return promo;
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from(TABLE_NAME).insert({
      id: promo.id,
      title: promo.title,
      description: promo.description,
      image_url: promo.imageUrl ?? null,
      cta_label: promo.ctaLabel,
      cta_url: promo.ctaUrl,
      cta_type: promo.ctaType,
      target_branches: promo.targetBranches,
      target_paths: promo.targetPaths,
      status: promo.status,
      starts_at: promo.startsAt ?? null,
      ends_at: promo.endsAt ?? null,
      frequency_mode: promo.frequencyMode,
      frequency_days: promo.frequencyDays,
      delay_seconds: promo.delaySeconds,
      priority: promo.priority,
      created_at: promo.createdAt,
      updated_at: promo.updatedAt,
    });
    if (error) throw new Error(`Supabase promotion insert error: ${error.message}`);
    return promo;
  }

  const existing = readLocalPromotions();
  existing.push(promo);
  writeLocalPromotions(existing);
  return promo;
}

export async function updatePromotion(
  id: string,
  patch: PromotionUpdateInput
): Promise<{ promotion?: Promotion; errors?: string[]; notFound?: boolean }> {
  const existing = await getPromotionById(id);
  if (!existing) {
    return { notFound: true };
  }

  const mergedCandidate = {
    title: patch.title !== undefined ? patch.title : existing.title,
    description: patch.description !== undefined ? patch.description : existing.description,
    imageUrl: patch.imageUrl !== undefined ? patch.imageUrl : existing.imageUrl,
    ctaLabel: patch.ctaLabel !== undefined ? patch.ctaLabel : existing.ctaLabel,
    ctaUrl: patch.ctaUrl !== undefined ? patch.ctaUrl : existing.ctaUrl,
    ctaType: patch.ctaType !== undefined ? patch.ctaType : existing.ctaType,
    targetBranches: patch.targetBranches !== undefined ? patch.targetBranches : existing.targetBranches,
    targetPaths: patch.targetPaths !== undefined ? patch.targetPaths : existing.targetPaths,
    status: patch.status !== undefined ? patch.status : existing.status,
    startsAt: patch.startsAt !== undefined ? patch.startsAt : existing.startsAt,
    endsAt: patch.endsAt !== undefined ? patch.endsAt : existing.endsAt,
    frequencyMode: patch.frequencyMode !== undefined ? patch.frequencyMode : existing.frequencyMode,
    frequencyDays: patch.frequencyDays !== undefined ? patch.frequencyDays : existing.frequencyDays,
    delaySeconds: patch.delaySeconds !== undefined ? patch.delaySeconds : existing.delaySeconds,
    priority: patch.priority !== undefined ? patch.priority : existing.priority,
  };

  const validated = validatePromotionCreate(mergedCandidate);
  if (!validated.valid || !validated.data) {
    return { errors: validated.errors };
  }

  const updated: Promotion = {
    id: existing.id,
    title: validated.data.title,
    description: validated.data.description || "",
    imageUrl: validated.data.imageUrl || undefined,
    ctaLabel: validated.data.ctaLabel,
    ctaUrl: validated.data.ctaUrl,
    ctaType: validated.data.ctaType || "whatsapp",
    targetBranches: validated.data.targetBranches || ["all"],
    targetPaths: validated.data.targetPaths || [],
    status: validated.data.status || "paused",
    startsAt: validated.data.startsAt || undefined,
    endsAt: validated.data.endsAt || undefined,
    frequencyMode: validated.data.frequencyMode || "once_per_day",
    frequencyDays: validated.data.frequencyDays ?? 1,
    delaySeconds: validated.data.delaySeconds ?? 3,
    priority: validated.data.priority ?? 10,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  const neonSql = getNeonSql();
  if (neonSql) {
    await neonSql`
      UPDATE public.promotions
      SET
        title = ${updated.title},
        description = ${updated.description},
        image_url = ${updated.imageUrl ?? null},
        cta_label = ${updated.ctaLabel},
        cta_url = ${updated.ctaUrl},
        cta_type = ${updated.ctaType},
        target_branches = ${updated.targetBranches}::text[],
        target_paths = ${updated.targetPaths}::text[],
        status = ${updated.status},
        starts_at = ${updated.startsAt ?? null}::timestamptz,
        ends_at = ${updated.endsAt ?? null}::timestamptz,
        frequency_mode = ${updated.frequencyMode},
        frequency_days = ${updated.frequencyDays},
        delay_seconds = ${updated.delaySeconds},
        priority = ${updated.priority},
        updated_at = ${updated.updatedAt}::timestamptz
      WHERE id = ${id}
    `;
    return { promotion: updated };
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({
        title: updated.title,
        description: updated.description,
        image_url: updated.imageUrl ?? null,
        cta_label: updated.ctaLabel,
        cta_url: updated.ctaUrl,
        cta_type: updated.ctaType,
        target_branches: updated.targetBranches,
        target_paths: updated.targetPaths,
        status: updated.status,
        starts_at: updated.startsAt ?? null,
        ends_at: updated.endsAt ?? null,
        frequency_mode: updated.frequencyMode,
        frequency_days: updated.frequencyDays,
        delay_seconds: updated.delaySeconds,
        priority: updated.priority,
        updated_at: updated.updatedAt,
      })
      .eq("id", id);

    if (error) throw new Error(`Supabase promotion update error: ${error.message}`);
    return { promotion: updated };
  }

  const all = readLocalPromotions();
  const idx = all.findIndex((p) => p.id === id);
  if (idx >= 0) {
    all[idx] = updated;
    writeLocalPromotions(all);
  }
  return { promotion: updated };
}

export async function deletePromotion(id: string): Promise<boolean> {
  const existing = await getPromotionById(id);
  if (!existing) return false;

  const neonSql = getNeonSql();
  if (neonSql) {
    await neonSql`DELETE FROM public.promotions WHERE id = ${id}`;
    return true;
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);
    if (error) throw new Error(`Supabase promotion delete error: ${error.message}`);
    return true;
  }

  const all = readLocalPromotions().filter((p) => p.id !== id);
  writeLocalPromotions(all);
  return true;
}
