import type { MerchantState } from "./merchant";

export interface MerchantProgress {
  visits: number;
  level: number;
  lastLitAt: number;       // timestamp (ms)
  storyUnlocked: number;   // 简化：解锁到第几段
  state: MerchantState;    // "locked" | "available" | "lit"
}

export interface SaveData {
  schemaVersion: 1;
  merchants: Record<string, MerchantProgress>; // key = merchantId
  updatedAt: number;
}