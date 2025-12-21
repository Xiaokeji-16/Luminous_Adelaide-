import Phaser from "phaser";
import type { SaveData } from "../types/save";

export function createGameUI(scene: Phaser.Scene, save: SaveData) {
  const uiDepth = 999;
  const uiHeight = 210;

  const uiObjects: Phaser.GameObjects.GameObject[] = [];

  const uiBg = scene.add
    .rectangle(0, 0, scene.scale.width, uiHeight, 0x000000, 0.75)
    .setOrigin(0)
    .setDepth(uiDepth - 1);
  uiObjects.push(uiBg);

  const addText = (x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle) => {
    const t = scene.add.text(x, y, text, style).setDepth(uiDepth);
    uiObjects.push(t);
    return t;
  };

  addText(40, 40, "Game Scene - Merchants + Save + Lit Demo", { color: "#ffffff", fontSize: "28px" });
  addText(40, 80, "Press V: m1 visits++ (saved)", { color: "#9ca3af", fontSize: "18px" });
  addText(40, 110, "Press L: toggle m1 lit (saved, instant color)", { color: "#9ca3af", fontSize: "18px" });
  addText(40, 140, "Press X: reset save (clear localStorage)", { color: "#9ca3af", fontSize: "18px" });

  const debugText = addText(40, 175, "", { color: "#ffffff", fontSize: "18px" });

  const refreshDebug = () => {
    const m1 = save.merchants["m1"];
    debugText.setText(`m1 visits: ${m1?.visits ?? 0} | state: ${m1?.state ?? "n/a"}`);
  };
  refreshDebug();

  const toggleFullscreen = () => {
    if (scene.scale.isFullscreen) scene.scale.stopFullscreen();
    else scene.scale.startFullscreen();
  };

  scene.input.keyboard?.on("keydown-F", toggleFullscreen);

  const btn = scene.add
    .text(0, 0, "⛶ Fullscreen (F)", {
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.45)",
      padding: { left: 10, right: 10, top: 6, bottom: 6 },
    })
    .setInteractive({ useHandCursor: true })
    .setDepth(uiDepth);

  btn.on("pointerup", toggleFullscreen);
  uiObjects.push(btn);

  const placeUI = () => {
    uiBg.setSize(scene.scale.width, uiHeight);
    btn.setPosition(scene.scale.width - btn.width - 12, 12);
  };
  placeUI();
  scene.scale.on("resize", placeUI);

  return { uiHeight, uiObjects, refreshDebug, placeUI, toggleFullscreen };
}