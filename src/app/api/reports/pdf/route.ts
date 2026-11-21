import { NextRequest, NextResponse } from "next/server";
import { isOwnerAuthenticated } from "@/lib/auth";
import { getStoredEvents, aggregateMetrics, getFilterDates } from "@/lib/analytics";
import { getIntegrationsHealth } from "@/lib/integrations";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET(request: NextRequest) {
  if (!isOwnerAuthenticated(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const preset = searchParams.get("preset") || "current_month";
  const customStart = searchParams.get("start") || undefined;
  const customEnd = searchParams.get("end") || undefined;

  const { start, end } = getFilterDates(preset, customStart, customEnd);
  const allEvents = getStoredEvents();
  const metrics = aggregateMetrics(allEvents, start, end);
  const integrations = await getIntegrationsHealth();

  const periodLabel = `${start.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" })} al ${end.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" })}`;
  const generatedAt = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });

  // Generación binaria REAL de PDF con pdf-lib (A4)
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Paleta de colores oficial de Barbería Carlyn
  const colorGold = rgb(200 / 255, 164 / 255, 90 / 255); // #c8a45a
  const colorDark = rgb(13 / 255, 10 / 255, 7 / 255);    // #0d0a07
  const colorMuted = rgb(120 / 255, 115 / 255, 110 / 255);
  const colorBgCard = rgb(248 / 255, 246 / 255, 242 / 255);
  const colorBorder = rgb(229 / 255, 224 / 255, 216 / 255);

  const page = pdfDoc.addPage([595.28, 841.89]); // A4 estándar en puntos
  const { width, height } = page.getSize();
  let y = height - 50;

  // Header Banner
  page.drawRectangle({
    x: 40,
    y: y - 5,
    width: width - 80,
    height: 3,
    color: colorGold,
  });

  page.drawText("BARBERIA CARLYN", {
    x: 40,
    y: y + 10,
    size: 20,
    font: fontBold,
    color: colorDark,
  });

  page.drawText("INFORME DE RENDIMIENTO COMERCIAL Y ANALITICA", {
    x: 40,
    y: y - 22,
    size: 9,
    font: fontBold,
    color: colorMuted,
  });

  page.drawText(`Periodo: ${periodLabel}`, {
    x: width - 260,
    y: y + 10,
    size: 9,
    font: fontRegular,
    color: colorDark,
  });

  page.drawText(`Generado: ${generatedAt}`, {
    x: width - 260,
    y: y - 5,
    size: 8,
    font: fontRegular,
    color: colorMuted,
  });

  y -= 50;

  // 1. Resumen Ejecutivo (Tarjetas)
  page.drawText("1. RESUMEN EJECUTIVO DE METRICAS", {
    x: 40,
    y,
    size: 12,
    font: fontBold,
    color: colorDark,
  });
  y -= 15;

  const kpis = [
    { label: "Visitas Totales", val: metrics.totalVisits.toString() },
    { label: "Interacciones Totales", val: metrics.totalInteractions.toString() },
    { label: "Clics Totales", val: metrics.totalClicks.toString() },
    { label: "Contactos Realizados", val: metrics.totalContacts.toString() },
    { label: "Solicitudes de Cita", val: metrics.totalBookingRequests.toString() },
    { label: "Conversion Visita a Contacto", val: `${metrics.conversionRates.visitToContact.toFixed(1)}%` },
  ];

  const cardW = (width - 80 - 20) / 3;
  const cardH = 46;

  kpis.forEach((kpi, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const cardX = 40 + col * (cardW + 10);
    const cardY = y - (row + 1) * cardH;

    page.drawRectangle({
      x: cardX,
      y: cardY,
      width: cardW,
      height: cardH - 5,
      color: colorBgCard,
      borderColor: colorBorder,
      borderWidth: 1,
    });

    page.drawText(kpi.val, {
      x: cardX + 10,
      y: cardY + 22,
      size: 15,
      font: fontBold,
      color: colorDark,
    });

    page.drawText(kpi.label, {
      x: cardX + 10,
      y: cardY + 8,
      size: 7.5,
      font: fontRegular,
      color: colorMuted,
    });
  });

  y -= 2 * cardH + 20;

  // 2. Rendimiento por Sucursal
  page.drawText("2. RENDIMIENTO POR SUCURSAL", {
    x: 40,
    y,
    size: 12,
    font: fontBold,
    color: colorDark,
  });
  y -= 15;

  const branchKeys: Array<keyof typeof metrics.branchBreakdown> = ["aviacion-civil", "ex-glorieta", "jacarandas"];
  const branchLabels = {
    "aviacion-civil": "Sucursal Aviacion Civil",
    "ex-glorieta": "Sucursal Ex-Glorieta",
    jacarandas: "Barber Studio Jacarandas",
  };

  branchKeys.forEach((key) => {
    const b = metrics.branchBreakdown[key] || { views: 0, whatsappClicks: 0, bookingRequests: 0, reviewClicks: 0 };
    page.drawRectangle({
      x: 40,
      y: y - 24,
      width: width - 80,
      height: 22,
      color: colorBgCard,
      borderColor: colorBorder,
      borderWidth: 0.5,
    });

    page.drawText(branchLabels[key], {
      x: 50,
      y: y - 16,
      size: 9,
      font: fontBold,
      color: colorDark,
    });

    page.drawText(`Visitas: ${b.views} | WhatsApp: ${b.whatsappClicks} | Citas: ${b.bookingRequests} | Resenas: ${b.reviewClicks}`, {
      x: 230,
      y: y - 16,
      size: 8,
      font: fontRegular,
      color: colorDark,
    });

    y -= 26;
  });

  y -= 15;

  // 3. Servicios mas consultados
  page.drawText("3. SERVICIOS MAS CONSULTADOS", {
    x: 40,
    y,
    size: 12,
    font: fontBold,
    color: colorDark,
  });
  y -= 15;

  if (metrics.topServices.length === 0) {
    page.drawText("Sin consultas registradas en este periodo", {
      x: 45,
      y: y - 8,
      size: 8.5,
      font: fontRegular,
      color: colorMuted,
    });
    y -= 14;
  } else {
    metrics.topServices.slice(0, 6).forEach((s) => {
      page.drawText(`- ${s.name}:`, {
        x: 45,
        y: y - 8,
        size: 8.5,
        font: fontRegular,
        color: colorDark,
      });
      page.drawText(`${s.views} consultas`, {
        x: 280,
        y: y - 8,
        size: 8.5,
        font: fontBold,
        color: colorDark,
      });
      y -= 14;
    });
  }

  y -= 15;

  // 4. Estado de Integraciones
  page.drawText("4. ESTADO DE INFRAESTRUCTURA E INTEGRACIONES", {
    x: 40,
    y,
    size: 12,
    font: fontBold,
    color: colorDark,
  });
  y -= 15;

  const integrationList = [
    integrations.chatWeb,
    integrations.supabase,
    integrations.ga4,
    integrations.gsc,
  ].filter(Boolean);

  integrationList.forEach((item) => {
    const isConn = item.connected;
    page.drawText(`[${isConn ? "ACTIVO" : "PENDIENTE"}] ${item.name}:`, {
      x: 45,
      y: y - 8,
      size: 8.5,
      font: fontBold,
      color: isConn ? rgb(26 / 255, 127 / 255, 55 / 255) : rgb(180 / 255, 100 / 255, 20 / 255),
    });
    page.drawText(`${item.statusMessage}`, {
      x: 230,
      y: y - 8,
      size: 8,
      font: fontRegular,
      color: colorMuted,
    });
    y -= 14;
  });

  // Footer institucional
  page.drawRectangle({
    x: 40,
    y: 40,
    width: width - 80,
    height: 0.5,
    color: colorBorder,
  });

  page.drawText("Barberia Carlyn Huejutla - Documento Confidencial de Uso Exclusivo de Administracion", {
    x: 40,
    y: 28,
    size: 7.5,
    font: fontRegular,
    color: colorMuted,
  });

  const pdfBytes = await pdfDoc.save();
  const filename = `reporte-comercial-carlyn-${preset}-${new Date().toISOString().split("T")[0]}.pdf`;

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pdfBytes.byteLength.toString(),
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
