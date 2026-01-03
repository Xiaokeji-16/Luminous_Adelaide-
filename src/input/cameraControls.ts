import Phaser from "phaser";

export function enableCameraControls(
  scene: Phaser.Scene,
  cam: Phaser.Cameras.Scene2D.Camera,
  uiHeight: number
) {
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  scene.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
    if (p.y < uiHeight) return; // 点在 UI 区就不拖
    dragging = true;
    lastX = p.x;
    lastY = p.y;
  });

  scene.input.on("pointerup", () => {
    dragging = false;
  });

  scene.input.on("pointermove", (p: Phaser.Input.Pointer) => {
    if (!dragging) return;

    const dx = p.x - lastX;
    const dy = p.y - lastY;

    cam.scrollX -= dx / cam.zoom;
    cam.scrollY -= dy / cam.zoom;

    lastX = p.x;
    lastY = p.y;
  });

  scene.input.on("wheel", (pointer: Phaser.Input.Pointer, _go: any, _dx: number, dy: number) => {
    if (pointer.y < uiHeight) return; // UI 区不缩放
    const nextZoom = Phaser.Math.Clamp(cam.zoom - dy * 0.001, 0.35, 2.5);
    cam.setZoom(nextZoom);
  });
}