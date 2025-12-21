import Phaser from "phaser";
import { loadState, saveState, clearState } from "../state/storage";
import { createGameUI } from "../ui/gameUI";
import { createMerchantsWorld } from "../world/merchantsWorld";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    const save = loadState();

    // UI 模块
    const ui = createGameUI(this, save);

    // World 模块
    const world = createMerchantsWorld(this, save);

    // 双 Camera（彻底隔离 UI & World）
    const worldCam = this.cameras.main;
    worldCam.setViewport(0, ui.uiHeight, this.scale.width, this.scale.height - ui.uiHeight);

    const uiCam = this.cameras.add(0, 0, this.scale.width, ui.uiHeight);
    uiCam.ignore(world.worldObjects);
    worldCam.ignore(ui.uiObjects);

    const placeCameras = () => {
      ui.placeUI();
      uiCam.setViewport(0, 0, this.scale.width, ui.uiHeight);
      worldCam.setViewport(0, ui.uiHeight, this.scale.width, this.scale.height - ui.uiHeight);
    };
    this.scale.on("resize", placeCameras);

    // 按键逻辑
    this.input.keyboard?.on("keydown-V", () => {
      const m1 = save.merchants["m1"];
      if (!m1) return;
      m1.visits += 1;
      saveState(save);
      ui.refreshDebug();
    });

    this.input.keyboard?.on("keydown-L", () => {
      const m1 = save.merchants["m1"];
      if (!m1) return;

      m1.state = m1.state === "lit" ? "available" : "lit";
      if (m1.state === "lit") m1.lastLitAt = Date.now();

      saveState(save);
      const dot = world.dots["m1"];
      if (dot) world.applyStateColor(dot, m1.state);
      ui.refreshDebug();
    });

    this.input.keyboard?.on("keydown-X", () => {
      clearState();
      window.location.reload();
    });

    // 清理监听
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off("resize", placeCameras);
    });
  }
}