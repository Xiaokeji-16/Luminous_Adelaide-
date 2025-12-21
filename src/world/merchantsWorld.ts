import Phaser from "phaser";
import merchantsData from "../data/merchants.json";
import type { Merchant, MerchantState } from "../types/merchant";
import type { SaveData } from "../types/save";

export function createMerchantsWorld(scene: Phaser.Scene, save: SaveData) {
  const worldObjects: Phaser.GameObjects.GameObject[] = [];
  const dots: Record<string, Phaser.GameObjects.Arc> = {};

  const applyStateColor = (dot: Phaser.GameObjects.Arc, state: MerchantState) => {
    if (state === "locked") dot.setFillStyle(0x6b7280);
    else if (state === "available") dot.setFillStyle(0x60a5fa);
    else dot.setFillStyle(0xfbbf24);
  };

  const merchants = merchantsData as Merchant[];

  merchants.forEach((m) => {
    const progress = save.merchants[m.id];
    const state = progress?.state ?? m.state;

    const dot = scene.add.circle(m.worldX, m.worldY, 8, 0xffffff);
    applyStateColor(dot, state);
    dots[m.id] = dot;
    worldObjects.push(dot);

    const label = scene.add.text(m.worldX + 12, m.worldY - 10, m.name, {
      color: "#9ca3af",
      fontSize: "14px",
    });
    worldObjects.push(label);
  });

  return { worldObjects, dots, applyStateColor };
}