import Phaser from "phaser";
import { saveState, clearState } from "../state/storage";
import type { MerchantState } from "../types/merchant";

type HotkeysDeps = {
  scene: Phaser.Scene;
  save: any; // 先不强卡类型，后面再升级成 SaveState
  ui: {
    refreshDebug: () => void;
  };
  world: {
    dots: Record<string, Phaser.GameObjects.Arc>;
    applyStateColor: (dot: Phaser.GameObjects.Arc, state: MerchantState) => void;
  };
};

export function registerHotkeys({ scene, save, ui, world }: HotkeysDeps) {
  // V: visits++
  scene.input.keyboard?.on("keydown-V", () => {
    const m1 = save.merchants["m1"];
    if (!m1) return;

    m1.visits += 1;
    saveState(save);
    ui.refreshDebug();
  });

  // L: toggle lit/available
  scene.input.keyboard?.on("keydown-L", () => {
    const m1 = save.merchants["m1"];
    if (!m1) return;

    m1.state = (m1.state === "lit" ? "available" : "lit") as MerchantState;
    if (m1.state === "lit") m1.lastLitAt = Date.now();

    saveState(save);

    const dot = world.dots["m1"];
    if (dot) world.applyStateColor(dot, m1.state);

    ui.refreshDebug();
  });

  // X: clear localStorage and reload
  scene.input.keyboard?.on("keydown-X", () => {
    clearState();
    window.location.reload();
  });

  // 清理监听（保险）
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    scene.input.keyboard?.off("keydown-V");
    scene.input.keyboard?.off("keydown-L");
    scene.input.keyboard?.off("keydown-X");
  });
}