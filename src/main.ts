import Phaser from "phaser";
import { PreloadScene } from "./scenes/PreloadScene";
import { GameScene } from "./scenes/GameScene";
import { ResultScene } from "./scenes/ResultScene";

new Phaser.Game({
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  parent: "app",
  backgroundColor: "#111827",
  scene: [PreloadScene, GameScene, ResultScene],
});