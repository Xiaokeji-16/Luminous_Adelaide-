import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.add.text(40, 40, "Loading...", { color: "#ffffff", fontSize: "28px" });

    // 先不加载任何图片也行，给你一个“有 preload”的结构
    // 后面 Week2/Week3 会在这里 load 地图 tiles / 图标等
  }

  create() {
    // 模拟加载完成
    this.time.delayedCall(800, () => {
      this.scene.start("GameScene", { from: "PreloadScene" });
    });
  }
}