export type AnalyticsEventType =
  | "branch_view"
  | "service_view"
  | "whatsapp_click"
  | "booking_request"
  | "chat_started"
  | "chat_lead"
  | "review_click";

export type BranchId = "aviacion-civil" | "ex-glorieta" | "jacarandas";

export type InteractionStage =
  | "visita"
  | "interaccion"
  | "clic"
  | "contacto"
  | "solicitud_cita"
  | "cita_confirmada"
  | "servicio_realizado";

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  stage: InteractionStage;
  timestamp: string; // ISO 8601
  branchId?: BranchId;
  serviceName?: string;
  source: string; // e.g., 'hero_button', 'branch_card', 'floating_whatsapp', 'widget_ai', 'navbar'
  originUrl: string;
  sessionId: string;
  dedupKey?: string;
  metadata?: Record<string, unknown>;
  isTest?: boolean;
}

export interface PagePerformanceMetric {
  originUrl: string;
  events: number;
  uniqueSessions: number;
  whatsappClicks: number;
  bookingRequests: number;
  reviewClicks: number;
}

export interface SourcePerformanceMetric {
  source: string;
  events: number;
  uniqueSessions: number;
}

export interface DailyTrendPoint {
  date: string; // YYYY-MM-DD in America/Mexico_City
  label: string;
  visits: number;
  whatsappClicks: number;
  bookingRequests: number;
  reviewClicks: number;
  totalEvents: number;
}

export interface CommercialFunnelSummary {
  visits: number;
  whatsappClicks: number;
  bookingRequests: number;
  reviewClicks: number;
  visitToWhatsappRate: number; // %
  whatsappToBookingRate: number; // %
  visitToBookingRate: number; // %
  visitToReviewRate: number; // %
}

export interface BranchConversionRates {
  viewToWhatsapp: number; // %
  viewToBooking: number; // %
  shareOfViews: number; // %
}

export interface MetricSummary {
  totalVisits: number;
  totalInteractions: number;
  totalClicks: number;
  totalContacts: number;
  totalBookingRequests: number;
  confirmedBookingsEstimate: number; // Distinct explicitly: not automatic conversion
  completedServicesEstimate: number;
  branchBreakdown: Record<
    BranchId,
    {
      views: number;
      whatsappClicks: number;
      bookingRequests: number;
      reviewClicks: number;
    }
  >;
  branchRates: Record<BranchId, BranchConversionRates>;
  funnel: CommercialFunnelSummary;
  pagePerformance: PagePerformanceMetric[];
  sourcePerformance: SourcePerformanceMetric[];
  dailyTrend: DailyTrendPoint[];
  topServices: { name: string; views: number }[];
  conversionRates: {
    visitToContact: number; // %
    contactToBookingRequest: number; // %
  };
}

export interface DateRangeFilter {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  preset: "7d" | "30d" | "current_month" | "previous_month" | "custom";
}
