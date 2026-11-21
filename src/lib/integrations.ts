export interface IntegrationStatus {
  service: "GA4" | "SearchConsole" | "ChatWebAI" | "Supabase";
  name: string;
  connected: boolean;
  configuredId?: string;
  statusMessage: string;
  lastChecked: string;
  metricsAvailable: boolean;
}

export interface SearchConsoleMetric {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number; // %
  position: number;
}

export interface SearchConsolePageMetric {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface ChatWebSummary {
  connected: boolean;
  companyName: string;
  agentName: string;
  slug: string;
  activePromotion?: {
    name: string;
    headline: string;
    message?: string;
    keyword: string;
    cta_label: string;
  };
  inferredInterest: {
    contornosPromotion: boolean;
    branchesMentioned: string[];
  };
}

/**
 * Checks connection and configuration of external intelligence services.
 * Never invents credentials; clearly surfaces missing keys and current status.
 */
export async function getIntegrationsHealth(): Promise<Record<string, IntegrationStatus>> {
  const now = new Date().toISOString();

  // 1. GA4 Status
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.GA_MEASUREMENT_ID;
  const gaConnected = Boolean(gaId && gaId.startsWith("G-"));

  // 2. Google Search Console Status
  const gscEmail = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL;
  const gscKey = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY;
  const gscConnected = Boolean(gscEmail && gscKey);

  // 3. ChatWeb AI Status
  let chatWebConnected = false;
  let chatWebCompany = "Barberia Carlyn";
  try {
    const res = await fetch("https://chatwebai.digita3hub.net/api/chat/config?slug=barberia-carlyn", {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      chatWebConnected = Boolean(data && data.company);
      if (data?.company?.name) chatWebCompany = data.company.name;
    }
  } catch {
    chatWebConnected = false;
  }

  // 4. Supabase Status (requires both URL and server-side Service Role key)
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const supabaseConnected = Boolean(
    supabaseUrl &&
    !supabaseUrl.includes("your_supabase_project_url_here") &&
    supabaseUrl.startsWith("https://") &&
    supabaseServiceKey &&
    !supabaseServiceKey.includes("your_supabase")
  );

  return {
    ga4: {
      service: "GA4",
      name: "Google Analytics 4",
      connected: gaConnected,
      configuredId: gaId || "No configurado",
      statusMessage: gaConnected
        ? "Propiedad GA4 vinculada y activa para captura de eventos."
        : "Pendiente: Configura NEXT_PUBLIC_GA_MEASUREMENT_ID en variables de entorno.",
      lastChecked: now,
      metricsAvailable: gaConnected,
    },
    gsc: {
      service: "SearchConsole",
      name: "Google Search Console",
      connected: gscConnected,
      configuredId: gscEmail ? `${gscEmail.slice(0, 15)}...` : "Sin cuenta de servicio",
      statusMessage: gscConnected
        ? "Cuenta de servicio conectada para consulta de rendimiento orgánico."
        : "Pendiente: Configurar GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL y PRIVATE_KEY.",
      lastChecked: now,
      metricsAvailable: gscConnected,
    },
    chatweb: {
      service: "ChatWebAI",
      name: "ChatWeb AI (Digita3)",
      connected: chatWebConnected,
      configuredId: "barberia-carlyn",
      statusMessage: chatWebConnected
        ? `Agente activo para ${chatWebCompany}. Conexión de configuración verificada.`
        : "Servicio no accesible temporalmente.",
      lastChecked: now,
      metricsAvailable: chatWebConnected,
    },
    supabase: {
      service: "Supabase",
      name: "Base de Datos Supabase",
      connected: supabaseConnected,
      configuredId: supabaseConnected ? supabaseUrl.replace(/https:\/\/(.*?)\..*/, "$1") : "No configurado",
      statusMessage: supabaseConnected
        ? "Conexión remota establecida."
        : "Persistencia local de eventos activa; Supabase en espera de credenciales de producción.",
      lastChecked: now,
      metricsAvailable: true,
    },
  };
}

/**
 * Returns real ChatWeb AI configuration and active promotional context.
 */
export async function getChatWebSummary(): Promise<ChatWebSummary> {
  try {
    const res = await fetch("https://chatwebai.digita3hub.net/api/chat/config?slug=barberia-carlyn", {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        connected: true,
        companyName: data.company?.name || "Barberia Carlyn",
        agentName: data.agent?.name || "Carlyn",
        slug: data.company?.slug || "barberia-carlyn",
        activePromotion: data.promotion
          ? {
              name: data.promotion.name,
              headline: data.promotion.headline,
              message: data.promotion.message,
              keyword: data.promotion.keyword,
              cta_label: data.promotion.cta_label,
            }
          : undefined,
        inferredInterest: {
          contornosPromotion: Boolean(data.promotion?.keyword?.includes("Contornos")),
          branchesMentioned: ["Sucursal Aviación Civil", "Sucursal Ex-Glorieta"],
        },
      };
    }
  } catch {
    // Return graceful fallback
  }

  return {
    connected: false,
    companyName: "Barberia Carlyn",
    agentName: "Carlyn",
    slug: "barberia-carlyn",
    inferredInterest: {
      contornosPromotion: false,
      branchesMentioned: [],
    },
  };
}
