import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create(data: any) {
    this.add.text(40, 40, "Game Scene", { color: "#ffffff", fontSize: "32px" });
    this.add.text(40, 90, "Press R → Result", { color: "#9ca3af", fontSize: "20px" });

    if (data?.from) {
      this.add.text(40, 130, `Entered from: ${data.from}`, { color: "#9ca3af" });
    }

    this.input.keyboard?.once("keydown-R", () => {
      this.scene.start("ResultScene", { score: 123 });
    });
  }
}