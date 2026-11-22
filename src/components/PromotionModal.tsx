"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Promotion } from "@/types/promotions";
import { X, ExternalLink } from "lucide-react";

const DAY_MS = 24 * 60 * 60 * 1000;

function getStorageKey(promoId: string): string {
  return `carlyn_promo_seen_${promoId}`;
}

export function canShowPromotion(promo: Promotion, nowMs = Date.now()): boolean {
  if (typeof window === "undefined") return false;
  const key = getStorageKey(promo.id);

  try {
    if (promo.frequencyMode === "once_per_session") {
      return !window.sessionStorage.getItem(key);
    }

    const raw = window.localStorage.getItem(key);
    if (!raw) return true;
    const lastSeen = Number(raw);
    if (isNaN(lastSeen)) return true;

    const days = promo.frequencyMode === "every_n_days" ? Math.max(1, promo.frequencyDays || 1) : 1;
    return nowMs - lastSeen >= days * DAY_MS;
  } catch {
    return true;
  }
}

export function markPromotionSeen(promo: Promotion, nowMs = Date.now()): void {
  if (typeof window === "undefined") return;
  const key = getStorageKey(promo.id);

  try {
    if (promo.frequencyMode === "once_per_session") {
      window.sessionStorage.setItem(key, String(nowMs));
    } else {
      window.localStorage.setItem(key, String(nowMs));
    }
  } catch {
    // ignore private browsing storage quota errors
  }
}

export default function PromotionModal() {
  const pathname = usePathname();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
    setPromotion((current) => {
      if (current) markPromotionSeen(current);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/propietario") || pathname.startsWith("/api")) {
      return;
    }

    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    async function loadActivePromotion() {
      try {
        const res = await fetch(`/api/promotions/active?path=${encodeURIComponent(pathname)}`);
        if (!res.ok || cancelled) return;

        const data = await res.json();
        const promo: Promotion | null = data?.ok && data?.promotion ? data.promotion : null;
        if (!promo || cancelled) return;

        // Extra client-side safeguard for dates & frequency
        const nowMs = Date.now();
        if (promo.startsAt && new Date(promo.startsAt).getTime() > nowMs) return;
        if (promo.endsAt && new Date(promo.endsAt).getTime() < nowMs) return;
        if (!canShowPromotion(promo, nowMs)) return;

        const delayMs = Math.max(0, Math.min(60, Number(promo.delaySeconds) || 0)) * 1000;
        timerId = setTimeout(() => {
          if (cancelled) return;
          setPromotion(promo);
          setVisible(true);
          markPromotionSeen(promo);
        }, delayMs);
      } catch {
        // Silent fail — never disturb public browsing
      }
    }

    loadActivePromotion();

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [pathname]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, handleClose]);

  if (!visible || !promotion) return null;

  const isExternal = promotion.ctaUrl.startsWith("https://");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="carlyn-promo-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-brown-dark border border-gold/50 shadow-2xl overflow-hidden retro-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar promoción"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-brown-dark/85 border border-gold/40 text-cream hover:text-gold hover:border-gold transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {promotion.imageUrl && (
          <div className="w-full aspect-[16/9] bg-brown-medium overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={promotion.imageUrl}
              alt={promotion.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        )}

        <div className="p-6 space-y-4 text-center">
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
            Barbería Carlyn · Promoción
          </div>

          <h2
            id="carlyn-promo-modal-title"
            className="font-serif text-2xl font-bold text-cream leading-snug"
          >
            {promotion.title}
          </h2>

          {promotion.description && (
            <p className="text-sm text-cream/80 leading-relaxed">
              {promotion.description}
            </p>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={promotion.ctaUrl}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              onClick={handleClose}
              className="w-full py-3 px-4 bg-gold text-brown-dark font-bold text-xs uppercase tracking-widest hover:bg-gold-light transition-colors inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <span>{promotion.ctaLabel}</span>
              {isExternal && <ExternalLink className="w-3.5 h-3.5" />}
            </a>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2 text-xs text-cream/55 hover:text-cream transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
