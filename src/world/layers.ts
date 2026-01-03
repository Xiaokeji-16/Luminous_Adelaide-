import Phaser from "phaser";

export type WorldLayers = {
  ground: Phaser.GameObjects.Container;
  deco: Phaser.GameObjects.Container;
  poi: Phaser.GameObjects.Container;
  fx: Phaser.GameObjects.Container;
};

export function createWorldLayers(scene: Phaser.Scene, uiCam: Phaser.Cameras.Scene2D.Camera) {
  const ground = scene.add.container(0, 0).setDepth(-1000);
  const deco   = scene.add.container(0, 0).setDepth(-900);
  const poi    = scene.add.container(0, 0).setDepth(-800);
  const fx     = scene.add.container(0, 0).setDepth(-700);

  uiCam.ignore([ground, deco, poi, fx]);

  return { ground, deco, poi, fx } satisfies WorldLayers;
}