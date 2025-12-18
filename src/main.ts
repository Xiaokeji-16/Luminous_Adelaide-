import Phaser from "phaser";
import { HelloScene } from "./scenes/HelloScene";

new Phaser.Game({
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  parent: "app",
  backgroundColor: "#111827",
  scene: [HelloScene],
});