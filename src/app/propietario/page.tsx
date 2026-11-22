"use client";

import { useState, useEffect, useCallback } from "react";
import BrandLogo from "@/components/BrandLogo";
import { MetricSummary } from "@/types/analytics";
import { IntegrationStatus, ChatWebSummary } from "@/lib/integrations";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin, 
  MessageSquare, 
  Search, 
  FileText, 
  Lock, 
  LogOut, 
  Download, 
  RefreshCw,
  PhoneCall,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Globe,
  Activity,
  GitBranch
} from "lucide-react";

interface DashboardPayload {
  filter: {
    preset: string;
    start: string;
    end: string;
    previousStart: string;
    previousEnd: string;
  };
  metrics: MetricSummary;
  comparison: MetricSummary;
  integrations: Record<string, IntegrationStatus>;
  chatWeb: ChatWebSummary;
  totalEventsStored: number;
}

export default function OwnerDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dashboard Data State
  const [preset, setPreset] = useState("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardPayload | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  const fetchDashboard = useCallback(async (filterPreset: string) => {
    setDataLoading(true);
    try {
      let url = `/api/dashboard?preset=${filterPreset}`;
      if (filterPreset === "custom" && customStart && customEnd) {
        url += `&start=${customStart}&end=${customEnd}`;
      }

      const res = await fetch(url);
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
        setIsAuthenticated(true);
      }
    } catch {
      // error loading dashboard
    } finally {
      setDataLoading(false);
    }
  }, [customStart, customEnd]);

  // Check initial session
  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const res = await fetch("/api/dashboard?preset=30d");
        if (!active) return;
        if (res.status === 401) {
          setIsAuthenticated(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
          setIsAuthenticated(true);
        }
      } catch {
        // ignore
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        fetchDashboard(preset);
      } else {
        const data = await res.json();
        setAuthError(data.error || "Contraseña incorrecta");
      }
    } catch {
      setAuthError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setDashboardData(null);
  }

  // 1. LOGIN SCREEN
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-brown-dark">
        <div className="w-full max-w-md p-8 border border-gold/30 bg-brown-medium/40 backdrop-blur-md retro-glow">
          <div className="text-center mb-8">
            <BrandLogo className="w-44 mx-auto mb-4" />
            <div className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-[0.25em] font-semibold border border-gold/30 px-3 py-1 bg-gold/10">
              <Lock className="w-3.5 h-3.5" />
              <span>Acceso Exclusivo Propietario</span>
            </div>
            <h1 className="font-serif text-2xl text-cream font-bold mt-4">
              Inteligencia Comercial
            </h1>
            <p className="text-cream/60 text-xs mt-1">
              Panel privado de analítica y toma de decisiones
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream/70 font-semibold mb-2">
                Contraseña de Propietario
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Introduce la clave de acceso"
                className="w-full bg-brown-dark/90 border border-gold/40 text-cream px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gold text-brown-dark font-bold text-sm tracking-widest uppercase hover:bg-gold-light transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Entrar al Dashboard"}
            </button>
          </form>

          <p className="text-center text-[11px] text-cream/40 mt-6">
            Uso confidencial · Solo para el titular de Barbería Carlyn
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isAuthenticated === null || !dashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <BrandLogo className="w-40 animate-pulse mb-4" />
        <p className="text-gold text-xs uppercase tracking-widest">Cargando inteligencia comercial...</p>
      </div>
    );
  }

  const { metrics, comparison, integrations, chatWeb } = dashboardData;

  return (
    <div className="min-h-screen pb-16">
      {/* Top Header */}
      <header className="border-b border-gold/20 bg-brown-dark/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo className="w-32" />
            <div className="h-6 w-px bg-gold/30 hidden sm:block" />
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
              Panel Propietario · Analítica
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/api/reports/pdf?preset=${preset}${preset === "custom" ? `&start=${customStart}&end=${customEnd}` : ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-gold/15 border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider hover:bg-gold hover:text-brown-dark transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Generar PDF</span>
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-cream/20 text-cream/70 text-xs font-semibold hover:text-red-400 hover:border-red-400/40 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Filters Bar */}
        <section className="p-4 bg-brown-medium/30 border border-gold/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase text-gold/80 font-bold tracking-wider mr-2">
              Periodo:
            </span>
            {[
              { id: "7d", label: "Últimos 7 días" },
              { id: "30d", label: "Últimos 30 días" },
              { id: "current_month", label: "Mes actual" },
              { id: "previous_month", label: "Mes anterior" },
              { id: "custom", label: "Personalizado" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPreset(item.id);
                  if (item.id !== "custom") fetchDashboard(item.id);
                }}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  preset === item.id
                    ? "bg-gold text-brown-dark"
                    : "border border-gold/20 text-cream/70 hover:border-gold/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {preset === "custom" && (
            <div className="flex items-center gap-2 text-xs">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-brown-dark border border-gold/30 px-2 py-1 text-cream text-xs"
              />
              <span className="text-gold">a</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-brown-dark border border-gold/30 px-2 py-1 text-cream text-xs"
              />
              <button
                onClick={() => fetchDashboard("custom")}
                className="px-3 py-1 bg-gold text-brown-dark font-bold text-xs uppercase"
              >
                Aplicar
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-cream/50 ml-auto">
            <span>Actualizado: {new Date().toLocaleTimeString("es-MX")}</span>
            <button
              onClick={() => fetchDashboard(preset)}
              className="p-1 hover:text-gold transition-colors"
              title="Recargar datos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </section>

        {/* 1. RESUMEN EJECUTIVO / KPIS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.2em] font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>1. Resumen Ejecutivo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-brown-medium/40 border border-gold/25 retro-glow flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-cream/60 uppercase font-semibold">
                <span>Sesiones Únicas</span>
                <Users className="w-4 h-4 text-gold" />
              </div>
              <div className="text-3xl font-serif font-bold text-cream my-2">
                {metrics.totalVisits}
              </div>
              <div className="text-[11px] text-cream/50">
                Previo: {comparison.totalVisits} sesiones
              </div>
            </div>

            <div className="p-5 bg-brown-medium/40 border border-gold/25 retro-glow flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-cream/60 uppercase font-semibold">
                <span>Interacciones Web</span>
                <BarChart3 className="w-4 h-4 text-gold" />
              </div>
              <div className="text-3xl font-serif font-bold text-cream my-2">
                {metrics.totalInteractions}
              </div>
              <div className="text-[11px] text-cream/50">
                Fichas de sucursales y servicios
              </div>
            </div>

            <div className="p-5 bg-brown-medium/40 border border-gold/25 retro-glow flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-cream/60 uppercase font-semibold">
                <span>Contactos Iniciados</span>
                <PhoneCall className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-3xl font-serif font-bold text-gold my-2">
                {metrics.totalContacts}
              </div>
              <div className="text-[11px] text-cream/50">
                Tasa de contacto: {metrics.conversionRates.visitToContact}%
              </div>
            </div>

            <div className="p-5 bg-brown-medium/40 border border-gold/25 retro-glow flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-cream/60 uppercase font-semibold">
                <span>Solicitudes de Cita</span>
                <CalendarCheck className="w-4 h-4 text-gold" />
              </div>
              <div className="text-3xl font-serif font-bold text-gold my-2">
                {metrics.totalBookingRequests}
              </div>
              <div className="text-[11px] text-cream/50">
                Previo: {comparison.totalBookingRequests}
              </div>
            </div>
          </div>

          <div className="p-3 bg-brown-dark/90 border border-gold/20 text-xs text-cream/70 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <div>
              <strong>Metodología de Conversión:</strong> Se distinguen con rigurosidad los niveles de interacción: 
              <span className="text-gold font-medium"> Visita &rarr; Interacción &rarr; Clic de acción &rarr; Contacto &rarr; Solicitud de Cita</span>. 
              No se asume una venta automáticamente a partir de un simple clic.
            </div>
          </div>
        </section>

        {/* 2. RESULTADOS POR SUCURSAL */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.2em] font-semibold">
            <MapPin className="w-4 h-4" />
            <span>2. Rendimiento Comercial por Sucursal</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Aviación Civil */}
            <div className="p-6 bg-brown-medium/30 border border-gold/20 flex flex-col justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-gold font-bold mb-1">
                  Atiende: Jael
                </div>
                <h3 className="font-serif text-xl font-bold text-cream mb-4">
                  Suc. Aviación Civil
                </h3>
                <div className="space-y-2 text-sm text-cream/80">
                  <div className="flex justify-between py-1 border-b border-gold/10">
                    <span className="text-cream/60">Vistas de ficha:</span>
                    <strong className="text-cream">{metrics.branchBreakdown["aviacion-civil"].views}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gold/10">
                    <span className="text-cream/60">Clics WhatsApp:</span>
                    <strong className="text-green-400">{metrics.branchBreakdown["aviacion-civil"].whatsappClicks}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gold/10">
                    <span className="text-cream/60">Solicitudes cita:</span>
                    <strong className="text-gold">{metrics.branchBreakdown["aviacion-civil"].bookingRequests}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gold/10">
                    <span className="text-cream/60">Clics Reseñas Maps:</span>
                    <strong className="text-cream">{metrics.branchBreakdown["aviacion-civil"].reviewClicks}</strong>
                  </div>
                  <div className="flex justify-between py-1 text-xs">
                    <span className="text-cream/50">Conv. Vista &rarr; WA / Cita:</span>
                    <span className="text-gold font-semibold">
                      {metrics.branchRates["aviacion-civil"].viewToWhatsapp}% / {metrics.branchRates["aviacion-civil"].viewToBooking}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gold/15 flex items-center justify-between text-[11px] text-cream/50">
                <span>Atención continua sin cita previa</span>
                <span className="text-gold/80 font-semibold">{metrics.branchRates["aviacion-civil"].shareOfViews}% vistas</span>
              </div>
            </div>

            {/* Ex-Glorieta */}
            <div className="p-6 bg-brown-medium/30 border border-gold/20 flex flex-col justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-gold font-bold mb-1">
                  Atienden: Johan y Chucky
                </div>
                <h3 className="font-serif text-xl font-bold text-cream mb-4">
                  Suc. Ex-Glorieta
                </h3>
                <div className="space-y-2 text-sm text-cream/80">
                  <div className="flex justify-between py-1 border-b border-gold/10">
                    <span className="text-cream/60">Vistas de ficha:</span>
                    <strong className="text-cream">{metrics.branchBreakdown["ex-glorieta"].views}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gold/10">
                    <span className="text-cream/60">Clics WhatsApp:</span>
                    <strong className="text-green-400">{metrics.branchBreakdown["ex-glorieta"].whatsappClicks}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gold/10">
                    <span className="text-cream/60">Solicitudes cita:</span>
                    <strong className="text-gold">{metrics.branchBreakdown["ex-glorieta"].bookingRequests}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gold/10">
                    <span className="text-cream/60">Clics Reseñas Maps:</span>
                    <strong className="text-cream">{metrics.branchBreakdown["ex-glorieta"].reviewClicks}</strong>
                  </div>
                  <div className="flex justify-between py-1 text-xs">
                    <span className="text-cream/50">Conv. Vista &rarr; WA / Cita:</span>
                    <span className="text-gold font-semibold">
                      {metrics.branchRates["ex-glorieta"].viewToWhatsapp}% / {metrics.branchRates["ex-glorieta"].viewToBooking}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gold/15 flex items-center justify-between text-[11px] text-cream/50">
                <span>Atención continua sin cita previa</span>
                <span className="text-gold/80 font-semibold">{metrics.branchRates["ex-glorieta"].shareOfViews}% vistas</span>
              </div>
            </div>

            {/* Jacarandas */}
            <div className="p-6 bg-brown-medium/30 border border-gold/30 flex flex-col justify-between retro-glow">
              <div>
                <div className="text-xs uppercase tracking-wider text-gold font-bold mb-1">
                  Atiende: Carlyn
                </div>
                <h3 className="font-serif text-xl font-bold text-cream mb-4">
                  Barber Studio Jacarandas
                </h3>
                <div className="space-y-2 text-sm text-cream/80">
                  <div className="flex justify-between py-1 border-b border-gold/10">
                    <span className="text-cream/60">Vistas de ficha:</span>
                    <strong className="text-cream">{metrics.branchBreakdown["jacarandas"].views}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gold/10">
                    <span className="text-cream/60">Clics WhatsApp:</span>
                    <strong className="text-green-400">{metrics.branchBreakdown["jacarandas"].whatsappClicks}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gold/10">
                    <span className="text-cream/60">Solicitudes cita VIP:</span>
                    <strong className="text-gold">{metrics.branchBreakdown["jacarandas"].bookingRequests}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gold/10">
                    <span className="text-cream/60">Clics Reseñas Maps:</span>
                    <strong className="text-cream">{metrics.branchBreakdown["jacarandas"].reviewClicks}</strong>
                  </div>
                  <div className="flex justify-between py-1 text-xs">
                    <span className="text-cream/50">Conv. Vista &rarr; WA / Cita:</span>
                    <span className="text-gold font-semibold">
                      {metrics.branchRates["jacarandas"].viewToWhatsapp}% / {metrics.branchRates["jacarandas"].viewToBooking}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gold/15 flex items-center justify-between text-[11px] text-gold font-semibold">
                <span>Exclusivo con cita previa</span>
                <span>{metrics.branchRates["jacarandas"].shareOfViews}% vistas</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2B. EMBUDO COMERCIAL Y TENDENCIA DIARIA */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.2em] font-semibold">
            <GitBranch className="w-4 h-4" />
            <span>Embudo Comercial &amp; Tasas de Conversión</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-brown-medium/30 border border-gold/20">
              <div className="text-[11px] uppercase tracking-wider text-cream/60 font-semibold">
                1. Visitas (Sesiones)
              </div>
              <div className="text-3xl font-serif font-bold text-cream mt-1">
                {metrics.funnel.visits}
              </div>
              <div className="text-[11px] text-cream/50 mt-2">
                Base 100% del periodo
              </div>
            </div>

            <div className="p-5 bg-brown-medium/30 border border-gold/20">
              <div className="text-[11px] uppercase tracking-wider text-cream/60 font-semibold">
                2. Clics WhatsApp
              </div>
              <div className="text-3xl font-serif font-bold text-green-400 mt-1">
                {metrics.funnel.whatsappClicks}
              </div>
              <div className="text-[11px] text-gold mt-2 font-semibold">
                {metrics.funnel.visitToWhatsappRate}% de visitas
              </div>
            </div>

            <div className="p-5 bg-brown-medium/30 border border-gold/20">
              <div className="text-[11px] uppercase tracking-wider text-cream/60 font-semibold">
                3. Solicitudes de Cita
              </div>
              <div className="text-3xl font-serif font-bold text-gold mt-1">
                {metrics.funnel.bookingRequests}
              </div>
              <div className="text-[11px] text-cream/60 mt-2">
                {metrics.funnel.visitToBookingRate}% de visitas · {metrics.funnel.whatsappToBookingRate}% vs WA
              </div>
            </div>

            <div className="p-5 bg-brown-medium/30 border border-gold/20">
              <div className="text-[11px] uppercase tracking-wider text-cream/60 font-semibold">
                4. Clics a Reseñas
              </div>
              <div className="text-3xl font-serif font-bold text-cream mt-1">
                {metrics.funnel.reviewClicks}
              </div>
              <div className="text-[11px] text-cream/60 mt-2">
                {metrics.funnel.visitToReviewRate}% de visitas
              </div>
            </div>
          </div>
        </section>

        {/* 2C. TENDENCIA DIARIA (America/Mexico_City) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.2em] font-semibold">
              <Activity className="w-4 h-4" />
              <span>Tendencia Diaria (America/Mexico_City)</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-cream/60">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-gold inline-block" /> Visitas
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-green-400 inline-block" /> WhatsApp + Citas
              </span>
            </div>
          </div>

          <div className="p-5 bg-brown-medium/30 border border-gold/20">
            {metrics.dailyTrend.length === 0 ? (
              <p className="text-xs text-cream/50 text-center py-6">
                Sin actividad diaria registrada en el periodo seleccionado.
              </p>
            ) : (
              (() => {
                const maxVal = Math.max(
                  1,
                  ...metrics.dailyTrend.map((d) => Math.max(d.visits, d.whatsappClicks + d.bookingRequests))
                );
                return (
                  <div className="overflow-x-auto">
                    <div className="flex items-end gap-2 min-w-[480px] h-40 pt-4 pb-2 border-b border-gold/15">
                      {metrics.dailyTrend.map((day) => {
                        const visitPct = Math.round((day.visits / maxVal) * 100);
                        const actionCount = day.whatsappClicks + day.bookingRequests;
                        const actionPct = Math.round((actionCount / maxVal) * 100);
                        return (
                          <div
                            key={day.date}
                            className="flex-1 min-w-[26px] flex flex-col items-center justify-end h-full group"
                            title={`${day.date} · Visitas: ${day.visits} · WhatsApp: ${day.whatsappClicks} · Citas: ${day.bookingRequests} · Reseñas: ${day.reviewClicks}`}
                          >
                            <div className="w-full flex items-end justify-center gap-0.5 h-28">
                              <div
                                className="w-2.5 bg-gold/80 group-hover:bg-gold transition-all"
                                style={{ height: `${day.visits > 0 ? Math.max(8, visitPct) : 2}%` }}
                              />
                              <div
                                className="w-2.5 bg-green-400/80 group-hover:bg-green-400 transition-all"
                                style={{ height: `${actionCount > 0 ? Math.max(8, actionPct) : 2}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-cream/50 mt-1.5 whitespace-nowrap">
                              {day.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </section>

        {/* 2D. RENDIMIENTO POR PÁGINA (origin_url) Y FUENTE (source) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.2em] font-semibold">
            <Globe className="w-4 h-4" />
            <span>Rendimiento por Página y Fuente de Interacción</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Por página (origin_url) */}
            <div className="p-5 bg-brown-medium/30 border border-gold/20">
              <h3 className="font-serif text-base font-bold text-cream mb-3">
                Páginas con Mayor Actividad (<code className="text-gold text-xs">origin_url</code>)
              </h3>
              {metrics.pagePerformance.length === 0 ? (
                <p className="text-xs text-cream/50 py-4">Sin eventos registrados por página en este periodo.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-gold/20 text-cream/60 uppercase text-[10px]">
                        <th className="py-2 pr-3">Ruta</th>
                        <th className="py-2 px-2 text-right">Sesiones</th>
                        <th className="py-2 px-2 text-right">Eventos</th>
                        <th className="py-2 px-2 text-right">WA</th>
                        <th className="py-2 pl-2 text-right">Citas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10 text-cream/80">
                      {metrics.pagePerformance.map((row) => (
                        <tr key={row.originUrl} className="hover:bg-gold/5">
                          <td className="py-2 pr-3 font-mono text-[11px] text-gold break-all">
                            {row.originUrl}
                          </td>
                          <td className="py-2 px-2 text-right font-semibold">{row.uniqueSessions}</td>
                          <td className="py-2 px-2 text-right">{row.events}</td>
                          <td className="py-2 px-2 text-right text-green-400">{row.whatsappClicks}</td>
                          <td className="py-2 pl-2 text-right text-gold">{row.bookingRequests}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Por fuente (source) */}
            <div className="p-5 bg-brown-medium/30 border border-gold/20">
              <h3 className="font-serif text-base font-bold text-cream mb-3">
                Fuentes de Interacción (<code className="text-gold text-xs">source</code>)
              </h3>
              {metrics.sourcePerformance.length === 0 ? (
                <p className="text-xs text-cream/50 py-4">Sin fuentes registradas en este periodo.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-gold/20 text-cream/60 uppercase text-[10px]">
                        <th className="py-2 pr-3">Fuente</th>
                        <th className="py-2 px-2 text-right">Sesiones</th>
                        <th className="py-2 pl-2 text-right">Eventos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10 text-cream/80">
                      {metrics.sourcePerformance.map((row) => (
                        <tr key={row.source} className="hover:bg-gold/5">
                          <td className="py-2 pr-3 font-mono text-[11px] text-cream">
                            {row.source}
                          </td>
                          <td className="py-2 px-2 text-right font-semibold">{row.uniqueSessions}</td>
                          <td className="py-2 pl-2 text-right text-gold font-semibold">{row.events}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. CHATWEB AI Y CANALES */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.2em] font-semibold">
            <MessageSquare className="w-4 h-4" />
            <span>3. Actividad de ChatWeb AI</span>
          </div>

          <div className="p-6 bg-brown-medium/30 border border-gold/20 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-cream/60 uppercase">Estado del Asistente Virtual</div>
                <div className="text-lg font-serif font-bold text-cream flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${chatWeb.connected ? "bg-green-500" : "bg-yellow-500"}`} />
                  {chatWeb.connected ? `Activo: ${chatWeb.agentName} (${chatWeb.companyName})` : "Pendiente de conexión"}
                </div>
              </div>
              <div className="text-xs text-cream/50 bg-brown-dark px-3 py-1.5 border border-gold/20">
                Widget Slug: <strong className="text-gold">barberia-carlyn</strong>
              </div>
            </div>

            {chatWeb.activePromotion && (
              <div className="p-4 bg-gold/10 border border-gold/30">
                <span className="text-[10px] uppercase tracking-wider text-gold font-bold">
                  Promoción Activa en Asistente Virtual
                </span>
                <h4 className="font-bold text-cream text-sm mt-1">{chatWeb.activePromotion.headline}</h4>
                <p className="text-cream/70 text-xs mt-1">{chatWeb.activePromotion.message}</p>
                <div className="mt-2 text-[11px] text-gold font-semibold">
                  Palabra clave disparadora: &quot;{chatWeb.activePromotion.keyword}&quot; · CTA: {chatWeb.activePromotion.cta_label}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4. POSICIONAMIENTO E INTEGRACIONES (GA4 / GSC / SUPABASE) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.2em] font-semibold">
            <Search className="w-4 h-4" />
            <span>4. Posicionamiento Google & Estado de Integraciones</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(integrations).map((svc: IntegrationStatus) => (
              <div key={svc.service} className="p-4 bg-brown-medium/30 border border-gold/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-cream">{svc.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 uppercase font-bold ${
                      svc.connected ? "bg-green-950 text-green-300 border border-green-600/40" : "bg-yellow-950 text-yellow-300 border border-yellow-600/40"
                    }`}>
                      {svc.connected ? "Conectado" : "Pendiente"}
                    </span>
                  </div>
                  <p className="text-xs text-cream/70 leading-relaxed mb-3">
                    {svc.statusMessage}
                  </p>
                </div>
                <div className="text-[10px] text-cream/40 pt-2 border-t border-gold/10">
                  ID: {svc.configuredId}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. GENERADOR DE REPORTES PDF */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.2em] font-semibold">
            <FileText className="w-4 h-4" />
            <span>5. Reportes Comerciales PDF</span>
          </div>

          <div className="p-6 bg-brown-medium/40 border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-6 retro-glow">
            <div>
              <h3 className="font-serif text-xl font-bold text-cream mb-1">
                Descargar Reporte Ejecutivo Mensual
              </h3>
              <p className="text-xs text-cream/70 max-w-xl leading-relaxed">
                Genera un informe completo para imprimir o guardar en PDF con portada, métricas de sucursales, 
                comparativa con el periodo anterior y recomendaciones comerciales basadas en datos.
              </p>
            </div>

            <a
              href={`/api/reports/pdf?preset=${preset}${preset === "custom" ? `&start=${customStart}&end=${customEnd}` : ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-gold text-brown-dark font-bold text-sm tracking-wider uppercase hover:bg-gold-light transition-all flex items-center gap-2 shadow-lg shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
