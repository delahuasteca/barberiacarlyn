"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Promotion,
  PromotionCtaType,
  PromotionFrequencyMode,
  PromotionStatus,
  PromotionTargetBranch,
} from "@/types/promotions";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  PauseCircle,
  PlayCircle,
  X,
  Calendar,
  Clock,
  Tag,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

interface PromotionsManagerProps {
  onUnauthorized: () => void;
}

const BRANCH_OPTIONS: { id: PromotionTargetBranch; label: string }[] = [
  { id: "all", label: "Todas las sucursales" },
  { id: "aviacion-civil", label: "Suc. Aviación Civil" },
  { id: "ex-glorieta", label: "Suc. Ex-Glorieta" },
  { id: "jacarandas", label: "Barber Studio Jacarandas" },
];

const PAGE_OPTIONS: { path: string; label: string }[] = [
  { path: "/", label: "Homepage (/)" },
  { path: "/barberia-huejutla-aviacion-civil", label: "Landing Aviación Civil" },
  { path: "/barberia-huejutla-ex-glorieta", label: "Landing Ex-Glorieta" },
  { path: "/barber-studio-jacarandas-huejutla", label: "Landing Jacarandas" },
];

interface FormState {
  title: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
  ctaType: PromotionCtaType;
  ctaUrl: string;
  targetBranches: PromotionTargetBranch[];
  targetPaths: string[];
  status: PromotionStatus;
  startsAt: string;
  endsAt: string;
  frequencyMode: PromotionFrequencyMode;
  frequencyDays: number;
  delaySeconds: number;
  priority: number;
}

const DEFAULT_FORM: FormState = {
  title: "",
  description: "",
  imageUrl: "",
  ctaLabel: "Aprovechar por WhatsApp",
  ctaType: "whatsapp",
  ctaUrl: "https://wa.me/527711234567?text=Hola%20quiero%20informacion%20de%20la%20promocion",
  targetBranches: ["all"],
  targetPaths: [],
  status: "paused",
  startsAt: "",
  endsAt: "",
  frequencyMode: "once_per_day",
  frequencyDays: 1,
  delaySeconds: 3,
  priority: 10,
};

function isoToDatetimeLocal(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function datetimeLocalToIso(val: string): string | null {
  if (!val || !val.trim()) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function PromotionsManager({ onUnauthorized }: PromotionsManagerProps) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [storageMode, setStorageMode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string>("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  const [previewPromo, setPreviewPromo] = useState<{
    title: string;
    description: string;
    imageUrl?: string;
    ctaLabel: string;
    ctaUrl: string;
    ctaType: PromotionCtaType;
    isDraft?: boolean;
  } | null>(null);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/promotions");
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json();
      if (res.ok && data.ok) {
        setPromotions(data.promotions || []);
        setStorageMode(data.storageMode || "");
      } else {
        setErrorMsg(data.error || "No se pudieron cargar las promociones.");
      }
    } catch {
      setErrorMsg("Error de conexión al cargar promociones.");
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    let active = true;
    async function loadInitial() {
      try {
        const res = await fetch("/api/promotions");
        if (!active) return;
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        const data = await res.json();
        if (!active) return;
        if (res.ok && data.ok) {
          setPromotions(data.promotions || []);
          setStorageMode(data.storageMode || "");
        } else {
          setErrorMsg(data.error || "No se pudieron cargar las promociones.");
        }
      } catch {
        if (active) setErrorMsg("Error de conexión al cargar promociones.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadInitial();
    return () => {
      active = false;
    };
  }, [onUnauthorized]);

  // Close preview modal with Escape key
  useEffect(() => {
    if (!previewPromo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewPromo(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewPromo]);

  function openCreateForm() {
    setEditingId(null);
    setForm(DEFAULT_FORM);
    setErrorMsg("");
    setErrorDetails([]);
    setSuccessMsg("");
    setShowForm(true);
  }

  function openEditForm(promo: Promotion) {
    setEditingId(promo.id);
    setForm({
      title: promo.title,
      description: promo.description || "",
      imageUrl: promo.imageUrl || "",
      ctaLabel: promo.ctaLabel,
      ctaType: promo.ctaType,
      ctaUrl: promo.ctaUrl,
      targetBranches: promo.targetBranches.length > 0 ? promo.targetBranches : ["all"],
      targetPaths: promo.targetPaths || [],
      status: promo.status,
      startsAt: isoToDatetimeLocal(promo.startsAt),
      endsAt: isoToDatetimeLocal(promo.endsAt),
      frequencyMode: promo.frequencyMode,
      frequencyDays: promo.frequencyDays,
      delaySeconds: promo.delaySeconds,
      priority: promo.priority,
    });
    setErrorMsg("");
    setErrorDetails([]);
    setSuccessMsg("");
    setShowForm(true);
  }

  function toggleBranch(branchId: PromotionTargetBranch) {
    setForm((prev) => {
      if (branchId === "all") {
        return { ...prev, targetBranches: ["all"] };
      }
      const withoutAll = prev.targetBranches.filter((b) => b !== "all");
      const exists = withoutAll.includes(branchId);
      const next = exists
        ? withoutAll.filter((b) => b !== branchId)
        : [...withoutAll, branchId];
      return {
        ...prev,
        targetBranches: next.length > 0 ? next : ["all"],
      };
    });
  }

  function togglePath(targetPath: string) {
    setForm((prev) => {
      const exists = prev.targetPaths.includes(targetPath);
      return {
        ...prev,
        targetPaths: exists
          ? prev.targetPaths.filter((p) => p !== targetPath)
          : [...prev.targetPaths, targetPath],
      };
    });
  }

  async function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset input so choosing the same file again triggers onChange
    e.target.value = "";
    if (!file) return;

    setErrorMsg("");
    setErrorDetails([]);
    setUploadNotice("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setErrorMsg("Formato no permitido. Selecciona únicamente una imagen JPG, PNG o WebP.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("La imagen supera el límite máximo de 2 MB.");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/promotions/upload", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        onUnauthorized();
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.ok || !data.url) {
        setErrorMsg(data.error || "No se pudo subir la imagen.");
        return;
      }

      setForm((prev) => ({ ...prev, imageUrl: data.url }));
      setUploadNotice(
        `Imagen subida correctamente (${data.provider === "vercel_blob" ? "Vercel Blob" : "Supabase Storage"}).`
      );
    } catch {
      setErrorMsg("Error de conexión al subir la imagen.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setErrorDetails([]);
    setSuccessMsg("");

    const payload = {
      ...(editingId ? { id: editingId } : {}),
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim() || null,
      ctaLabel: form.ctaLabel.trim(),
      ctaType: form.ctaType,
      ctaUrl: form.ctaUrl.trim(),
      targetBranches: form.targetBranches,
      targetPaths: form.targetPaths,
      status: form.status,
      startsAt: datetimeLocalToIso(form.startsAt),
      endsAt: datetimeLocalToIso(form.endsAt),
      frequencyMode: form.frequencyMode,
      frequencyDays: Number(form.frequencyDays),
      delaySeconds: Number(form.delaySeconds),
      priority: Number(form.priority),
    };

    try {
      const res = await fetch("/api/promotions", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        onUnauthorized();
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "No se pudo guardar la promoción.");
        setErrorDetails(Array.isArray(data.details) ? data.details : []);
        return;
      }

      setSuccessMsg(editingId ? "Promoción actualizada correctamente." : "Promoción creada correctamente.");
      setShowForm(false);
      setEditingId(null);
      await fetchPromotions();
    } catch {
      setErrorMsg("Error de red al guardar la promoción.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(promo: Promotion) {
    const nextStatus: PromotionStatus = promo.status === "active" ? "paused" : "active";
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/promotions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: promo.id, status: nextStatus }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setSuccessMsg(nextStatus === "active" ? "Promoción activada." : "Promoción pausada.");
        await fetchPromotions();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Error al cambiar el estado.");
      }
    } catch {
      setErrorMsg("Error de conexión al cambiar estado.");
    }
  }

  async function handleDelete(promo: Promotion) {
    if (!window.confirm(`¿Eliminar definitivamente la promoción "${promo.title}"?`)) {
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/promotions?id=${encodeURIComponent(promo.id)}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setSuccessMsg("Promoción eliminada.");
        await fetchPromotions();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "No se pudo eliminar la promoción.");
      }
    } catch {
      setErrorMsg("Error de conexión al eliminar.");
    }
  }

  return (
    <section className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-brown-medium/30 border border-gold/25">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.2em] font-semibold">
            <Tag className="w-4 h-4" />
            <span>Administrador de Promociones (Pop-ups)</span>
          </div>
          <p className="text-xs text-cream/60 mt-1">
            Configura promociones por sucursal o página, fechas de vigencia, frecuencia y previsualiza antes de activar.
            {storageMode && (
              <span className="ml-2 text-gold/80 font-mono text-[11px]">
                [{storageMode}]
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchPromotions}
            className="p-2 border border-gold/25 text-cream/70 hover:text-gold hover:border-gold/50 transition-colors"
            title="Recargar promociones"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-brown-dark text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Promoción</span>
          </button>
        </div>
      </div>

      {/* Feedback banners */}
      {errorMsg && (
        <div className="p-4 bg-red-950/50 border border-red-500/40 text-red-200 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          {errorDetails.length > 0 && (
            <ul className="list-disc list-inside text-red-200/80 pl-2">
              {errorDetails.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-950/40 border border-green-500/40 text-green-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-brown-medium/40 border border-gold/35 space-y-5 retro-glow"
        >
          <div className="flex items-center justify-between border-b border-gold/20 pb-3">
            <h3 className="font-serif text-lg font-bold text-cream">
              {editingId ? "Editar Promoción" : "Crear Nueva Promoción"}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-cream/60 hover:text-cream"
              aria-label="Cerrar formulario"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-cream/70 font-semibold mb-1.5">
                Título *
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={120}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej. Martes de Corte + Barba"
                className="w-full px-3 py-2 bg-brown-dark border border-gold/30 text-cream text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="block text-xs uppercase text-cream/70 font-semibold">
                  Imagen de la Promoción (JPG, PNG, WebP · máx. 2 MB)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/15 border border-gold/45 text-gold text-[11px] font-bold uppercase tracking-wider hover:bg-gold hover:text-brown-dark transition-colors disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {uploadingImage
                      ? "Subiendo..."
                      : form.imageUrl
                        ? "Reemplazar imagen"
                        : "Subir imagen"}
                  </span>
                </button>
              </div>

              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => {
                  setUploadNotice("");
                  setForm({ ...form, imageUrl: e.target.value });
                }}
                placeholder="/images/hero.jpg o https://... (se llena automáticamente al subir)"
                className="w-full px-3 py-2 bg-brown-dark border border-gold/30 text-cream text-sm focus:outline-none focus:border-gold"
              />

              {uploadNotice && (
                <p className="text-[11px] text-green-300">{uploadNotice}</p>
              )}

              {form.imageUrl && (
                <div className="flex items-center gap-3 p-2 bg-brown-dark/80 border border-gold/25">
                  <div className="w-20 h-12 bg-brown-medium overflow-hidden shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.imageUrl}
                      alt="Vista previa de imagen cargada"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 text-[11px] text-gold font-semibold">
                      <ImageIcon className="w-3 h-3 shrink-0" />
                      <span>Vista previa cargada</span>
                    </div>
                    <p className="text-[10px] text-cream/50 truncate font-mono">
                      {form.imageUrl}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadNotice("");
                      setForm({ ...form, imageUrl: "" });
                    }}
                    className="text-[11px] px-2 py-1 border border-red-500/30 text-red-300 hover:bg-red-950/60 shrink-0"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-cream/70 font-semibold mb-1.5">
              Descripción
            </label>
            <textarea
              rows={3}
              maxLength={600}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detalles de la promoción, horarios o condiciones."
              className="w-full px-3 py-2 bg-brown-dark border border-gold/30 text-cream text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase text-cream/70 font-semibold mb-1.5">
                Texto del Botón (CTA) *
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={60}
                value={form.ctaLabel}
                onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                className="w-full px-3 py-2 bg-brown-dark border border-gold/30 text-cream text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-cream/70 font-semibold mb-1.5">
                Tipo de Enlace
              </label>
              <select
                value={form.ctaType}
                onChange={(e) => setForm({ ...form, ctaType: e.target.value as PromotionCtaType })}
                className="w-full px-3 py-2 bg-brown-dark border border-gold/30 text-cream text-sm focus:outline-none focus:border-gold"
              >
                <option value="whatsapp">WhatsApp (wa.me / whatsapp.com)</option>
                <option value="link">Enlace destino (HTTPS o /ruta)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase text-cream/70 font-semibold mb-1.5">
                Enlace de Destino *
              </label>
              <input
                type="text"
                required
                value={form.ctaUrl}
                onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
                placeholder={form.ctaType === "whatsapp" ? "https://wa.me/52..." : "/barber-studio-jacarandas-huejutla"}
                className="w-full px-3 py-2 bg-brown-dark border border-gold/30 text-cream text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Sucursales y Páginas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gold/15">
            <div>
              <label className="block text-xs uppercase text-gold font-semibold mb-2">
                Sucursales Objetivo
              </label>
              <div className="flex flex-wrap gap-2">
                {BRANCH_OPTIONS.map((b) => {
                  const selected = form.targetBranches.includes(b.id);
                  return (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => toggleBranch(b.id)}
                      className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
                        selected
                          ? "bg-gold text-brown-dark border-gold"
                          : "border-gold/25 text-cream/70 hover:border-gold/60"
                      }`}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase text-gold font-semibold mb-2">
                Páginas Específicas (opcional)
              </label>
              <div className="flex flex-wrap gap-2">
                {PAGE_OPTIONS.map((p) => {
                  const selected = form.targetPaths.includes(p.path);
                  return (
                    <button
                      type="button"
                      key={p.path}
                      onClick={() => togglePath(p.path)}
                      className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
                        selected
                          ? "bg-gold/25 text-gold border-gold"
                          : "border-gold/20 text-cream/70 hover:border-gold/50"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Vigencia, Frecuencia, Prioridad y Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-gold/15">
            <div>
              <label className="block text-xs uppercase text-cream/70 font-semibold mb-1.5">
                Inicio de Vigencia
              </label>
              <input
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                className="w-full px-2.5 py-2 bg-brown-dark border border-gold/30 text-cream text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-cream/70 font-semibold mb-1.5">
                Fin de Vigencia
              </label>
              <input
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                className="w-full px-2.5 py-2 bg-brown-dark border border-gold/30 text-cream text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-cream/70 font-semibold mb-1.5">
                Frecuencia
              </label>
              <select
                value={form.frequencyMode}
                onChange={(e) => setForm({ ...form, frequencyMode: e.target.value as PromotionFrequencyMode })}
                className="w-full px-2.5 py-2 bg-brown-dark border border-gold/30 text-cream text-xs"
              >
                <option value="once_per_session">1 vez por sesión</option>
                <option value="once_per_day">1 vez al día</option>
                <option value="every_n_days">Cada N días</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase text-cream/70 font-semibold mb-1.5">
                Estado
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as PromotionStatus })}
                className="w-full px-2.5 py-2 bg-brown-dark border border-gold/30 text-cream text-xs"
              >
                <option value="paused">Pausada (borrador seguro)</option>
                <option value="active">Activa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase text-cream/70 font-semibold mb-1.5">
                Días entre apariciones (1–90)
              </label>
              <input
                type="number"
                min={1}
                max={90}
                value={form.frequencyDays}
                onChange={(e) => setForm({ ...form, frequencyDays: Number(e.target.value) })}
                disabled={form.frequencyMode !== "every_n_days"}
                className="w-full px-3 py-2 bg-brown-dark border border-gold/30 text-cream text-xs disabled:opacity-40"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-cream/70 font-semibold mb-1.5">
                Retraso de aparición (seg, 0–60)
              </label>
              <input
                type="number"
                min={0}
                max={60}
                value={form.delaySeconds}
                onChange={(e) => setForm({ ...form, delaySeconds: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-brown-dark border border-gold/30 text-cream text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-cream/70 font-semibold mb-1.5">
                Prioridad (0–1000)
              </label>
              <input
                type="number"
                min={0}
                max={1000}
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-brown-dark border border-gold/30 text-cream text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gold/20">
            <button
              type="button"
              onClick={() =>
                setPreviewPromo({
                  title: form.title || "Título de la promoción",
                  description: form.description || "Descripción de prueba para la vista previa.",
                  imageUrl: form.imageUrl || undefined,
                  ctaLabel: form.ctaLabel || "Ver promoción",
                  ctaUrl: form.ctaUrl || "#",
                  ctaType: form.ctaType,
                  isDraft: true,
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 border border-gold/50 text-gold text-xs font-bold uppercase tracking-wider hover:bg-gold/10 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Vista Previa</span>
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-cream/20 text-cream/70 text-xs font-semibold uppercase hover:text-cream"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-gold text-brown-dark text-xs font-bold uppercase tracking-wider hover:bg-gold-light disabled:opacity-50"
            >
              {saving ? "Guardando..." : editingId ? "Guardar Cambios" : "Crear Promoción"}
            </button>
          </div>
        </form>
      )}

      {/* Promotions List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-cream/60 border border-gold/15 bg-brown-medium/20">
          Cargando promociones...
        </div>
      ) : promotions.length === 0 ? (
        <div className="p-8 text-center border border-gold/20 bg-brown-medium/20 space-y-2">
          <p className="text-sm text-cream/80 font-serif">Aún no hay promociones configuradas.</p>
          <p className="text-xs text-cream/50">
            Crea tu primera promoción con &quot;Nueva Promoción&quot; y revísala con Vista Previa antes de activarla.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className={`p-5 border bg-brown-medium/30 flex flex-col justify-between gap-4 ${
                promo.status === "active" ? "border-gold/50 retro-glow" : "border-gold/20"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`inline-block text-[10px] px-2 py-0.5 uppercase font-bold tracking-wider mb-1.5 ${
                        promo.status === "active"
                          ? "bg-green-950 text-green-300 border border-green-600/40"
                          : "bg-yellow-950 text-yellow-300 border border-yellow-600/40"
                      }`}
                    >
                      {promo.status === "active" ? "Activa" : "Pausada"}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-cream">{promo.title}</h4>
                  </div>
                  <span className="text-[11px] font-mono text-gold/80 bg-brown-dark px-2 py-1 border border-gold/20 shrink-0">
                    Prioridad {promo.priority}
                  </span>
                </div>

                {promo.description && (
                  <p className="text-xs text-cream/70 leading-relaxed">{promo.description}</p>
                )}

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {promo.targetBranches.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 bg-gold/10 border border-gold/25 text-gold"
                    >
                      {b}
                    </span>
                  ))}
                  {promo.targetPaths.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 bg-brown-dark border border-cream/20 text-cream/70 font-mono"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-cream/60 pt-2 border-t border-gold/10">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    <span>
                      {promo.frequencyMode === "once_per_session"
                        ? "1x sesión"
                        : promo.frequencyMode === "once_per_day"
                          ? "1x día"
                          : `Cada ${promo.frequencyDays} días`}{" "}
                      · {promo.delaySeconds}s
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    <span>
                      {promo.startsAt || promo.endsAt
                        ? `${promo.startsAt ? new Date(promo.startsAt).toLocaleDateString("es-MX") : "Hoy"} → ${
                            promo.endsAt ? new Date(promo.endsAt).toLocaleDateString("es-MX") : "Sin fin"
                          }`
                        : "Vigencia continua"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gold/15">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(promo)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase border border-gold/35 text-gold hover:bg-gold hover:text-brown-dark transition-colors"
                >
                  {promo.status === "active" ? (
                    <>
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Activar</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewPromo({
                        title: promo.title,
                        description: promo.description,
                        imageUrl: promo.imageUrl,
                        ctaLabel: promo.ctaLabel,
                        ctaUrl: promo.ctaUrl,
                        ctaType: promo.ctaType,
                      })
                    }
                    className="p-2 border border-gold/25 text-cream/80 hover:text-gold hover:border-gold/50"
                    title="Vista previa"
                    aria-label="Vista previa"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditForm(promo)}
                    className="p-2 border border-gold/25 text-cream/80 hover:text-gold hover:border-gold/50"
                    title="Editar"
                    aria-label="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(promo)}
                    className="p-2 border border-red-500/30 text-red-300 hover:bg-red-950/60"
                    title="Eliminar"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Preview Modal */}
      {previewPromo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-preview-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setPreviewPromo(null)}
        >
          <div
            className="relative w-full max-w-md bg-brown-dark border border-gold/50 shadow-2xl overflow-hidden retro-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gold/15 border-b border-gold/30 px-4 py-2 flex items-center justify-between text-[11px] text-gold uppercase tracking-wider font-bold">
              <span>{previewPromo.isDraft ? "Vista Previa (Borrador)" : "Vista Previa del Pop-up"}</span>
              <button
                type="button"
                onClick={() => setPreviewPromo(null)}
                className="text-cream/80 hover:text-gold"
                aria-label="Cerrar vista previa"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {previewPromo.imageUrl && (
              <div className="w-full aspect-[16/9] bg-brown-medium overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewPromo.imageUrl}
                  alt={previewPromo.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 space-y-4 text-center">
              <h3 id="promo-preview-title" className="font-serif text-2xl font-bold text-cream">
                {previewPromo.title}
              </h3>
              {previewPromo.description && (
                <p className="text-sm text-cream/75 leading-relaxed">{previewPromo.description}</p>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={previewPromo.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-gold text-brown-dark font-bold text-xs uppercase tracking-widest hover:bg-gold-light transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>{previewPromo.ctaLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewPromo(null)}
                  className="w-full py-2 text-xs text-cream/50 hover:text-cream transition-colors"
                >
                  Cerrar vista previa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
