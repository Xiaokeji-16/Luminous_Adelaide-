import Phaser from "phaser";

type ApplyWorldBoundsParams = {
  cam: Phaser.Cameras.Scene2D.Camera;
  width: number;
  height: number;
  center?: boolean;
};

export function applyWorldBounds(scene: Phaser.Scene, params: ApplyWorldBoundsParams) {
  const { cam, width, height, center = true } = params;

  cam.setBounds(0, 0, width, height);

  // 可选：如果启用 physics
  // @ts-ignore
  scene.physics?.world?.setBounds?.(0, 0, width, height);

  if (center) cam.centerOn(width / 2, height / 2);
}