import Phaser from "phaser";

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  create(data: any) {
    const score = data?.score ?? 0;

    this.add.text(40, 40, "Result Scene", { color: "#ffffff", fontSize: "32px" });
    this.add.text(40, 90, `Score: ${score}`, { color: "#ffffff", fontSize: "24px" });
    this.add.text(40, 130, "Press G → Game", { color: "#9ca3af", fontSize: "20px" });

    this.input.keyboard?.once("keydown-G", () => {
      this.scene.start("GameScene", { from: "ResultScene" });
    });
  }
}