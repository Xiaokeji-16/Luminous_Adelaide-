import Phaser from "phaser";

type BuildTileMapParams = {
  scene: Phaser.Scene;
  uiCam: Phaser.Cameras.Scene2D.Camera;
  worldObjects: Phaser.GameObjects.GameObject[];
  cols: number;
  rows: number;
  tileSize: number;
  depth?: number;
  parent?: Phaser.GameObjects.Container;
};

export function buildTileMap({
  scene,
  uiCam,
  worldObjects,
  cols,
  rows,
  tileSize,
  depth = -1000,
  parent,
}: BuildTileMapParams) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const t = scene.add.image(x * tileSize, y * tileSize, `tile_${x}_${y}`).setOrigin(0, 0);
      t.setDepth(depth);

      // 如果传了 parent，就把 tile 放进 worldRoot（做 2.5D 变换用）
      parent?.add(t);

      // 兼容你原来的 worldObjects 逻辑（给 ignore/管理用）
      worldObjects.unshift(t);

      // UI 相机不画 tiles
      uiCam.ignore(t);
    }
  }
}