import { NextRequest, NextResponse } from "next/server";
import { isOwnerAuthenticated } from "@/lib/auth";
import { getStoredEvents, aggregateMetrics, getFilterDates } from "@/lib/analytics";
import { getIntegrationsHealth, getChatWebSummary } from "@/lib/integrations";

export async function GET(request: NextRequest) {
  if (!isOwnerAuthenticated(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const preset = searchParams.get("preset") || "current_month";
  const customStart = searchParams.get("start") || undefined;
  const customEnd = searchParams.get("end") || undefined;

  const { start, end } = getFilterDates(preset, customStart, customEnd);
  const durationMs = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - durationMs);

  const allEvents = getStoredEvents();
  const metrics = aggregateMetrics(allEvents, start, end);
  const comparison = aggregateMetrics(allEvents, prevStart, prevEnd);
  const integrations = await getIntegrationsHealth();
  const chatWeb = await getChatWebSummary();

  const generatedAt = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte Comercial Mensual — Barbería Carlyn</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1a1410;
      background: #ffffff;
      line-height: 1.4;
      font-size: 11pt;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 2px solid #c8a45a;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title {
      font-size: 20pt;
      font-weight: 800;
      color: #0d0a07;
      letter-spacing: 1px;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 10pt;
      color: #c8a45a;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: bold;
      margin-top: 2px;
    }
    .meta-box {
      text-align: right;
      font-size: 9pt;
      color: #555;
    }
    .section-title {
      font-size: 13pt;
      color: #0d0a07;
      border-left: 4px solid #c8a45a;
      padding-left: 8px;
      margin-top: 22px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 15px;
    }
    .kpi-card {
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      padding: 10px;
      background: #faf8f5;
    }
    .kpi-label {
      font-size: 8.5pt;
      text-transform: uppercase;
      color: #666;
      font-weight: bold;
    }
    .kpi-value {
      font-size: 17pt;
      font-weight: bold;
      color: #0d0a07;
      margin-top: 4px;
    }
    .kpi-diff {
      font-size: 8pt;
      margin-top: 2px;
    }
    .diff-up { color: #15803d; }
    .diff-down { color: #b91c1c; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 10pt;
    }
    th {
      background: #f4ede0;
      color: #0d0a07;
      text-align: left;
      padding: 8px;
      font-size: 8.5pt;
      text-transform: uppercase;
      border-bottom: 1px solid #c8a45a;
    }
    td {
      padding: 7px 8px;
      border-bottom: 1px solid #eee;
    }
    .notice {
      background: #fdfbf7;
      border: 1px solid #eadfc9;
      padding: 10px 14px;
      border-radius: 4px;
      font-size: 9pt;
      color: #555;
      margin-top: 15px;
    }
    .recommendations {
      background: #faf7f0;
      border-left: 4px solid #c8a45a;
      padding: 12px 16px;
      margin-top: 15px;
      font-size: 9.5pt;
    }
    .recommendations li {
      margin-bottom: 6px;
    }
    .footer {
      margin-top: 35px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
      font-size: 8pt;
      color: #888;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      .no-print { display: none !important; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background: #0d0a07; color: #f5e6c8; padding: 12px 20px; text-align: center; margin-bottom: 20px; border-radius: 6px;">
    <strong>Reporte Comercial Generado</strong> — Pulsa 
    <button onclick="window.print()" style="background: #c8a45a; color: #0d0a07; border: none; padding: 6px 14px; font-weight: bold; margin: 0 8px; cursor: pointer; border-radius: 4px;">
      Descargar / Imprimir en PDF
    </button> o utiliza Ctrl + P.
  </div>

  <div class="header">
    <div>
      <h1 class="brand-title">BARBERÍA CARLYN</h1>
      <div class="brand-subtitle">Reporte de Inteligencia Comercial y Rendimiento Digital</div>
    </div>
    <div class="meta-box">
      <div><strong>Periodo:</strong> ${start.toLocaleDateString("es-MX")} al ${end.toLocaleDateString("es-MX")}</div>
      <div><strong>Filtro:</strong> ${preset.toUpperCase()}</div>
      <div><strong>Generado:</strong> ${generatedAt}</div>
    </div>
  </div>

  <div class="section-title">1. Resumen Ejecutivo de Conversión</div>
  <div class="grid-4">
    <div class="kpi-card">
      <div class="kpi-label">Sesiones Únicas</div>
      <div class="kpi-value">${metrics.totalVisits}</div>
      <div class="kpi-diff">Previo: ${comparison.totalVisits}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Interacciones Web</div>
      <div class="kpi-value">${metrics.totalInteractions}</div>
      <div class="kpi-diff">Previo: ${comparison.totalInteractions}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Contactos (WhatsApp / Chat)</div>
      <div class="kpi-value">${metrics.totalContacts}</div>
      <div class="kpi-diff">Tasa: ${metrics.conversionRates.visitToContact}%</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Solicitudes de Cita</div>
      <div class="kpi-value">${metrics.totalBookingRequests}</div>
      <div class="kpi-diff">Previo: ${comparison.totalBookingRequests}</div>
    </div>
  </div>

  <div class="notice">
    <strong>Auditoría Metodológica:</strong> No se asume automáticamente que un clic o contacto represente una venta confirmada. 
    Se registran eventos estrictamente distinguidos: Visita &rarr; Interacción &rarr; Clic en acción &rarr; Contacto generado &rarr; Solicitud de cita.
  </div>

  <div class="section-title">2. Rendimiento Comercial por Sucursal</div>
  <table>
    <thead>
      <tr>
        <th>Sucursal</th>
        <th>Visitas de Ficha</th>
        <th>Clics WhatsApp</th>
        <th>Solicitudes Cita</th>
        <th>Clics Reseñas Maps</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Aviación Civil</strong> (Atiende Jael)</td>
        <td>${metrics.branchBreakdown["aviacion-civil"].views}</td>
        <td>${metrics.branchBreakdown["aviacion-civil"].whatsappClicks}</td>
        <td>${metrics.branchBreakdown["aviacion-civil"].bookingRequests}</td>
        <td>${metrics.branchBreakdown["aviacion-civil"].reviewClicks}</td>
      </tr>
      <tr>
        <td><strong>Ex-Glorieta</strong> (Johan y Chucky)</td>
        <td>${metrics.branchBreakdown["ex-glorieta"].views}</td>
        <td>${metrics.branchBreakdown["ex-glorieta"].whatsappClicks}</td>
        <td>${metrics.branchBreakdown["ex-glorieta"].bookingRequests}</td>
        <td>${metrics.branchBreakdown["ex-glorieta"].reviewClicks}</td>
      </tr>
      <tr>
        <td><strong>Barber Studio Jacarandas</strong> (Carlyn)</td>
        <td>${metrics.branchBreakdown["jacarandas"].views}</td>
        <td>${metrics.branchBreakdown["jacarandas"].whatsappClicks}</td>
        <td>${metrics.branchBreakdown["jacarandas"].bookingRequests}</td>
        <td>${metrics.branchBreakdown["jacarandas"].reviewClicks}</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">3. Estado de Canales y ChatWeb AI</div>
  <div style="font-size: 9.5pt; line-height: 1.6;">
    <div><strong>Agente Inteligente ChatWeb AI:</strong> ${chatWeb.connected ? "Conectado y disponible en el sitio." : "Pendiente de configuración o inactivo."}</div>
    <div><strong>Agente Asignado:</strong> ${chatWeb.agentName} | <strong>Empresa:</strong> ${chatWeb.companyName}</div>
    ${chatWeb.activePromotion ? `<div><strong>Promoción Activa en ChatWeb:</strong> ${chatWeb.activePromotion.headline} (${chatWeb.activePromotion.message})</div>` : "<div><strong>Promoción Activa:</strong> Ninguna activa actualmente.</div>"}
    <div><strong>Google Analytics 4:</strong> ${integrations.ga4.connected ? "Activo (" + integrations.ga4.configuredId + ")" : "Sin credencial NEXT_PUBLIC_GA_MEASUREMENT_ID."}</div>
    <div><strong>Google Search Console:</strong> ${integrations.gsc.connected ? "Activo" : "Requiere cuenta de servicio para extracción automática."}</div>
  </div>

  <div class="section-title">4. Recomendaciones Comerciales Basadas en Datos</div>
  <div class="recommendations">
    <ul>
      <li><strong>Impulso a Jacarandas:</strong> Mantener el flujo exclusivo de citas previas con Carlyn en Jacarandas mediante WhatsApp para elevar el ticket promedio con paquetes VIP.</li>
      <li><strong>Aprovechamiento de la Promo Contornos:</strong> La promoción detectada en el widget de ChatWeb ($50 contornos para Aviación y Ex-Glorieta) impulsa recurrencia entre semana.</li>
      <li><strong>Reseñas en Google Maps:</strong> Incentivar a los clientes de Aviación Civil y Ex-Glorieta a calificar desde el enlace oficial para fortalecer el posicionamiento local en Huejutla.</li>
      <li><strong>Medición Continua:</strong> Mantener activo el monitoreo de eventos centralizado para detectar picos de demanda estacionales.</li>
    </ul>
  </div>

  <div class="footer">
    <div>Barbería Carlyn &copy; Huejutla de Reyes, Hgo. — Confidencial para el Propietario</div>
    <div>Reporte generado con métricas reales del sitio oficial barberiacarlyn.com</div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
