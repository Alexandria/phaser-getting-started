import Phaser from "phaser";
import tiles from "url:../assets/platformergraphics-iceworld/sheet.png";
import tileMap from "../assets/gameMap.json";
import ground from "url:../assets/platform.png";
import star from "url:../assets/star.png";
import dude from "url:../assets/dude.png";
import bg from "url:../assets/bg.png";

export default class HellowWorldScene extends Phaser.Scene {
  private player?: Phaser.Physics.Matter.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private isTouchingGround = false;

  constructor() {
    super("game");
  }

  init = () => {
    this.cursors = this.input.keyboard.createCursorKeys();
  };

  preload = () => {
    this.load.image("tiles", tiles);
    this.load.image("bg", bg);
    this.load.tilemapTiledJSON("tileMap", tileMap);
    this.load.spritesheet("dude", dude, { frameWidth: 32, frameHeight: 48 });
  };

  create = () => {
    const { width, height } = this.scale;
    const map = this.make.tilemap({ key: "tileMap" });
    const backgound = map.images;
    backgound.forEach((bgImage, index) => {
      const { x, y } = bgImage;
      let test = 1;

      if (index === 1) {
        this.add.image(test + 2400 * index, y - height * 0.1, "bg");
      } else {
        this.add.image(x, y, "bg");
      }
    });
    const tileSet = map.addTilesetImage("iceworld", "tiles");

    const ground = map.createLayer("ground", tileSet);

    console.log("What are my layers?? ", backgound);
    this.createDudeAnimations();

    ground.setCollisionByProperty({ collides: true });

    const objectLayer = map.getObjectLayer("object");

    objectLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "spawn": {
          this.player = this.matter.add
            .sprite(x + width * 0.05, y, "dude", 4)
            .play("idel")
            .setFixedRotation();

          this.player.setOnCollide((data: MatterJS.ICollisionPair) => {
            this.isTouchingGround = true;
          });
          this.cameras.main.startFollow(this.player);
        }
      }
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.matter.world.convertTilemapLayer(ground);
  };

  private createDudeAnimations = () => {
    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "idel",
      frames: [{ key: "dude", frame: 4 }],
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 12,
      repeat: -1,
    });
  };

  update = () => {
    if (!this.player) return;
    const speed = 3;
    if (this.cursors?.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.play("walk-left", true);
    } else if (this.cursors?.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.play("walk-right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.play("idel", true);
    }

    const spaceJustPressed = this.cursors
      ? Phaser.Input.Keyboard.JustDown(this.cursors?.space)
      : "";

    if (spaceJustPressed && this.isTouchingGround) {
      this.player?.setVelocityY(-12);
      this.isTouchingGround = false;
    }
  };
}
