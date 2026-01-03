import Phaser from "phaser";
import { loadState } from "../state/storage";
import { createGameUI } from "../ui/gameUI";
import { createMerchantsWorld } from "../world/merchantsWorld";
import { enableCameraControls } from "../input/cameraControls";
import { buildTileMap } from "../world/tileMap";
import { applyWorldBounds } from "../world/worldBounds";
import { registerHotkeys } from "../input/hotkeys";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    // ====== 加载存档 ======
    const save = loadState();

    // ====== UI 模块 ======
    const ui = createGameUI(this, save);

    // ====== World 模块（点位/颜色等） ======
    const world = createMerchantsWorld(this, save);

    // ====== 双 Camera（隔离 UI & World）======
    const worldCam = this.cameras.main;
    const uiCam = this.cameras.add(0, 0, this.scale.width, ui.uiHeight);

    const placeCameras = () => {
      ui.placeUI();

      uiCam.setViewport(0, 0, this.scale.width, ui.uiHeight);
      worldCam.setViewport(0, ui.uiHeight, this.scale.width, this.scale.height - ui.uiHeight);

      // resize 后再 ignore 一次（保险）
      uiCam.ignore(world.worldObjects);
      worldCam.ignore(ui.uiObjects);
    };

    // 先放一次（首次进入就正确）
    placeCameras();
    this.scale.on("resize", placeCameras);

    // ====== Tiles 底图（256x256 拼接）======
    const COLS = 28;
    const ROWS = 20;
    const TILE = 256;

    buildTileMap({
      scene: this,
      uiCam,
      worldObjects: world.worldObjects,
      cols: COLS,
      rows: ROWS,
      tileSize: TILE,
      depth: -1000,
    });

    // ✅ tiles 加完后，再 ignore 一次（最稳）
    uiCam.ignore(world.worldObjects);

    // ====== 世界边界（用 tiles 拼接后的完整尺寸）======
    const worldWidth = COLS * TILE;   // 7168
    const worldHeight = ROWS * TILE;  // 5120

    // 注意：看你 worldBounds.ts 的函数签名
    // 如果是 applyWorldBounds(scene, params) 就用下面这行
    applyWorldBounds(this, { cam: worldCam, width: worldWidth, height: worldHeight, center: true });

    // 如果你 worldBounds.ts 是 applyWorldBounds(params)（没有 scene 参数）
    // 就改成：
    // applyWorldBounds({ cam: worldCam, width: worldWidth, height: worldHeight, center: true });

    // ✅ 拖拽 + 缩放
    enableCameraControls(this, worldCam, ui.uiHeight);

    // ====== 按键逻辑（拆到 hotkeys）======
    registerHotkeys({
      scene: this,
      save,
      ui,
      world: {
        dots: world.dots,
        applyStateColor: (dot, state) => world.applyStateColor(dot, state),
      },
    });

    // ====== 清理监听 ======
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off("resize", placeCameras);
    });
  }
}