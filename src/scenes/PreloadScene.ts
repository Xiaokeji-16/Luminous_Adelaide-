import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.add.text(40, 40, "Loading...", {
      color: "#ffffff",
      fontSize: "28px",
    });

    // 如果你还想保留整张底图（可选）
    this.load.image("map_base", "assets/map_base_4k.png");

    // Tiles
    const COLS = 28;
    const ROWS = 20;

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        this.load.image(`tile_${x}_${y}`, `assets/tiles/${x}_${y}.png`);
      }
    }
  }

  create() {
    // 加载完成后切到 GameScene
    this.scene.start("GameScene", { from: "PreloadScene" });
  }
}