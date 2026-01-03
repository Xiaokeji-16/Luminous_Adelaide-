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

  // 如果你后面要用物理（目前可有可无）
  // 如果你没启用 physics，这行不会报错（只是不执行）
  // @ts-ignore
  scene.physics?.world?.setBounds?.(0, 0, width, height);

  if (center) cam.centerOn(width / 2, height / 2);
}