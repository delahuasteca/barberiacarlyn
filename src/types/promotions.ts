export type PromotionStatus = "active" | "paused";
export type PromotionCtaType = "whatsapp" | "link";
export type PromotionFrequencyMode = "once_per_session" | "once_per_day" | "every_n_days";
export type PromotionTargetBranch = "all" | "aviacion-civil" | "ex-glorieta" | "jacarandas";

export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  ctaLabel: string;
  ctaUrl: string;
  ctaType: PromotionCtaType;
  targetBranches: PromotionTargetBranch[];
  targetPaths: string[];
  status: PromotionStatus;
  startsAt?: string; // ISO 8601
  endsAt?: string;   // ISO 8601
  frequencyMode: PromotionFrequencyMode;
  frequencyDays: number;
  delaySeconds: number;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionCreateInput {
  title: string;
  description?: string;
  imageUrl?: string | null;
  ctaLabel: string;
  ctaUrl: string;
  ctaType?: PromotionCtaType;
  targetBranches?: PromotionTargetBranch[];
  targetPaths?: string[];
  status?: PromotionStatus;
  startsAt?: string | null;
  endsAt?: string | null;
  frequencyMode?: PromotionFrequencyMode;
  frequencyDays?: number;
  delaySeconds?: number;
  priority?: number;
}

export type PromotionUpdateInput = Partial<PromotionCreateInput>;
