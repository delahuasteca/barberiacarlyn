"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/tracker";
import { BranchId } from "@/types/analytics";

const BRANCH_LANDING_MAP: Record<string, BranchId> = {
  "/barberia-huejutla-aviacion-civil": "aviacion-civil",
  "/barberia-huejutla-ex-glorieta": "ex-glorieta",
  "/barber-studio-jacarandas-huejutla": "jacarandas",
};

export default function AnalyticsAutoTracker() {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);

  // Track direct navigation to any of the 3 branch landing pages without duplicates
  useEffect(() => {
    if (!pathname) return;
    const normalizedPath = pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;
    const branchId = BRANCH_LANDING_MAP[normalizedPath];

    if (!branchId) {
      lastTrackedPathRef.current = normalizedPath;
      return;
    }

    if (lastTrackedPathRef.current === normalizedPath) {
      return;
    }

    lastTrackedPathRef.current = normalizedPath;

    trackEvent("branch_view", {
      source: "direct_landing_view",
      branchId,
    });
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href") || "";
      const text = (target.textContent || "").toLowerCase();

      // Detect WhatsApp clicks
      if (href.includes("wa.me") || href.includes("whatsapp.com") || text.includes("whatsapp") || text.includes("agendar")) {
        let branchId: BranchId | undefined = undefined;
        if (href.includes("aviacion") || window.location.pathname.includes("aviacion")) {
          branchId = "aviacion-civil";
        } else if (href.includes("glorieta") || window.location.pathname.includes("glorieta")) {
          branchId = "ex-glorieta";
        } else if (href.includes("jacarandas") || window.location.pathname.includes("jacarandas")) {
          branchId = "jacarandas";
        }

        const isBooking = text.includes("agendar") || href.includes("agendar") || href.includes("cita");

        trackEvent(isBooking ? "booking_request" : "whatsapp_click", {
          source: target.getAttribute("aria-label") || "auto_link_click",
          branchId,
        });
      }

      // Detect Google Maps Reviews clicks
      if (text.includes("reseña") || href.includes("writereview") || href.includes("digita3hub.net/r/")) {
        let branchId: BranchId | undefined = undefined;
        if (window.location.pathname.includes("aviacion") || href.includes("aviacion")) {
          branchId = "aviacion-civil";
        } else if (window.location.pathname.includes("glorieta") || href.includes("glorieta")) {
          branchId = "ex-glorieta";
        } else if (window.location.pathname.includes("jacarandas") || href.includes("jacarandas") || href.includes("cantores")) {
          branchId = "jacarandas";
        }

        trackEvent("review_click", {
          source: "reviews_button",
          branchId,
        });
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
