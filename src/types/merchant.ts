export type MerchantState = "locked" | "available" | "lit";

export interface Merchant {
  id: string;
  name: string;
  worldX: number;
  worldY: number;
  type: string;
  unlockRule: string;
  state: MerchantState;
}