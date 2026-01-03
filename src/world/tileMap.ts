import Phaser from "phaser";

type BuildTileMapParams = {
  scene: Phaser.Scene;
  uiCam: Phaser.Cameras.Scene2D.Camera;
  worldObjects: Phaser.GameObjects.GameObject[];
  cols: number;
  rows: number;
  tileSize: number;
  depth?: number;
};

export function buildTileMap({
  scene,
  uiCam,
  worldObjects,
  cols,
  rows,
  tileSize,
  depth = -1000,
}: BuildTileMapParams) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const t = scene.add.image(x * tileSize, y * tileSize, `tile_${x}_${y}`).setOrigin(0, 0);
      t.setDepth(depth);

      // 归到 world 里（给 worldCam 画）
      worldObjects.unshift(t);

      // UI 相机不画 tiles
      uiCam.ignore(t);
    }
  }
}