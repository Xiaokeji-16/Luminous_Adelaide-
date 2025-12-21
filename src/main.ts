import Phaser from "phaser";
import { PreloadScene } from "./scenes/PreloadScene";
import { GameScene } from "./scenes/GameScene";
import { ResultScene } from "./scenes/ResultScene";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "#111827",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PreloadScene, GameScene, ResultScene],
});