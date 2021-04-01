import { debug } from "node:console";
import Phaser from "phaser";

import HellowWorldScene from "./scenes/HelloWorldScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  physics: {
    default: "matter",
    matter: {
      debug: true,
    },
  },
  scene: [HellowWorldScene],
};

export default new Phaser.Game(config);
