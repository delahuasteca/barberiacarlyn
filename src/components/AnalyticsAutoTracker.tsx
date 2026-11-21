"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracker";

export default function AnalyticsAutoTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href") || "";
      const text = (target.textContent || "").toLowerCase();

      // Detect WhatsApp clicks
      if (href.includes("wa.me") || href.includes("whatsapp.com") || text.includes("whatsapp") || text.includes("agendar")) {
        let branchId: "aviacion-civil" | "ex-glorieta" | "jacarandas" | undefined = undefined;
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
        let branchId: "aviacion-civil" | "ex-glorieta" | "jacarandas" | undefined = undefined;
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
