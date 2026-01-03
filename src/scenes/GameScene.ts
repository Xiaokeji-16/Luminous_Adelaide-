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
    const save = loadState();

    // UI
    const ui = createGameUI(this, save);

    // Cameras
    const worldCam = this.cameras.main;
    const uiCam = this.cameras.add(0, 0, this.scale.width, ui.uiHeight);

    // worldRoot：2.5D 变换只作用在它身上
    const worldRoot = this.add.container(0, 0);

    uiCam.ignore(worldRoot);
    worldCam.ignore(ui.uiObjects);

    // World（POI点位等）
    const world = createMerchantsWorld(this, save);

    // 把现有 worldObjects 放进 worldRoot（POI 也一起 2.5D）
    world.worldObjects.forEach((obj) => {
      if ((obj as any).parentContainer !== worldRoot) {
        worldRoot.add(obj as any);
      }
    });

    // Viewport + resize
    const placeCameras = () => {
      ui.placeUI();

      uiCam.setViewport(0, 0, this.scale.width, ui.uiHeight);
      worldCam.setViewport(0, ui.uiHeight, this.scale.width, this.scale.height - ui.uiHeight);

      uiCam.ignore(worldRoot);
      worldCam.ignore(ui.uiObjects);
    };

    placeCameras();
    this.scale.on("resize", placeCameras);

    // Tiles
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
      parent: worldRoot,
    });

    // 2.5D transform
    const angle = Phaser.Math.DegToRad(45);
    const sx = 1;
    const sy = 0.5;

    worldRoot.setRotation(angle);
    worldRoot.setScale(sx, sy);

    // Bounds from transformed AABB
    const baseWorldWidth = COLS * TILE;   // 7168
    const baseWorldHeight = ROWS * TILE;  // 5120
    const aabb = getIsoAABB(baseWorldWidth, baseWorldHeight, angle, sx, sy);

    worldRoot.setPosition(-aabb.minX, -aabb.minY);

    applyWorldBounds(this, {
      cam: worldCam,
      width: aabb.width,
      height: aabb.height,
      center: true,
    });

    // Background
    worldCam.setBackgroundColor(0x0b1120);

    // Fit to screen (world area)
    const viewW = this.scale.width;
    const viewH = this.scale.height - ui.uiHeight;

    const fitZoom = Math.min(viewW / aabb.width, viewH / aabb.height);
    worldCam.setZoom(Phaser.Math.Clamp(fitZoom, 0.08, 2.5));
    worldCam.centerOn(aabb.width / 2, aabb.height / 2);

    // Drag + wheel zoom
    enableCameraControls(this, worldCam, ui.uiHeight);

    // Hotkeys
    registerHotkeys({
      scene: this,
      save,
      ui,
      world: {
        dots: world.dots,
        applyStateColor: (dot, state) => world.applyStateColor(dot, state),
      },
    });

    // Cleanup
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off("resize", placeCameras);
    });
  }
}

// AABB of (0..w, 0..h) after scale + rotate
function getIsoAABB(w: number, h: number, angleRad: number, sx: number, sy: number) {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const pts = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: 0, y: h },
    { x: w, y: h },
  ].map((p) => {
    const x1 = p.x * sx;
    const y1 = p.y * sy;

    const x2 = x1 * cos - y1 * sin;
    const y2 = x1 * sin + y1 * cos;

    return { x: x2, y: y2 };
  });

  const minX = Math.min(...pts.map((p) => p.x));
  const maxX = Math.max(...pts.map((p) => p.x));
  const minY = Math.min(...pts.map((p) => p.y));
  const maxY = Math.max(...pts.map((p) => p.y));

  return {
    minX,
    minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}