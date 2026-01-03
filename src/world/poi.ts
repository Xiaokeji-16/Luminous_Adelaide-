import Phaser from "phaser";
import merchantsData from "../data/merchants.json";
import type { Merchant } from "../types/merchant";
import type { WorldLayers } from "./layers";

export type MerchantState = "locked" | "available" | "lit";

export function applyStateColor(dot: Phaser.GameObjects.Arc, state: MerchantState) {
  if (state === "locked") dot.setFillStyle(0x6b7280);
  if (state === "available") dot.setFillStyle(0x60a5fa);
  if (state === "lit") dot.setFillStyle(0xfbbf24);
}

export function buildPOI(
  scene: Phaser.Scene,
  layers: WorldLayers,
  save: any
) {
  const merchants = merchantsData as Merchant[];
  const dots: Record<string, Phaser.GameObjects.Arc> = {};

  merchants.forEach((m) => {
    const progress = save.merchants[m.id];
    const state = (progress?.state ?? m.state) as MerchantState;

    const dot = scene.add.circle(m.worldX, m.worldY, 8, 0xffffff);
    applyStateColor(dot, state);

    const label = scene.add.text(m.worldX + 12, m.worldY - 10, m.name, {
      color: "#9ca3af",
      fontSize: "14px",
    });

    layers.poi.add([dot, label]);
    dots[m.id] = dot;
  });

  return { dots, applyStateColor };
}