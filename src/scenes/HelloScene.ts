import Phaser from "phaser";

export class HelloScene extends Phaser.Scene {
    constructor() {
        super("HelloScene");
    }

    create() {
        this.add.text(40, 40, "Hello Phaser Scene", {
            fontSize:"32px",
            color:"#ffffff",
        });

        this.add.rectangle(80,120,220,100,0x22c55e).setOrigin(0);
        this.add.text(95, 155, "It runs!", { color: "#000000"});
    }
}