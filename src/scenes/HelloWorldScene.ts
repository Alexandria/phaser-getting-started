import Phaser from 'phaser'
import sky from 'url:../assets/sky.png'
import ground from 'url:../assets/platform.png'
import star from 'url:../assets/star.png'
import dude from 'url:../assets/dude.png'
import { group } from 'node:console'
import { POINT_CONVERSION_COMPRESSED } from 'node:constants'

 
export default class HellowWorldScene extends Phaser.Scene {

    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private player?:Phaser.Physics.Arcade.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private stars?: Phaser.Physics.Arcade.Group
    private score:number = 0
    private scoreText:Phaser.GameObjects.Text

    constructor(){
        super('hello-world')
    }

    preload =()=>
    {
        this.load.image('sky', sky);
        this.load.image('ground', ground);
        this.load.image('star', star);
        this.load.spritesheet('dude', dude, {frameWidth:32,frameHeight:48})
    }

    create = () =>
    {
        this.add.image(400, 300, 'sky');
        this.scoreText = this.add.text(16,16,'score:0', {fontSize:'32', fill:'#000'})

        this.platforms = this.physics.add.staticGroup()
        const ground:Phaser.GameObjects.Sprite = this.platforms.create(400, 568, 'ground')
         ground.setScale(2).refreshBody()

         this.platforms.create(600, 400, 'ground')
         this.platforms.create(50, 250, 'ground')
         this.platforms.create(750, 220, 'ground')

         this.player = this.physics.add.sprite(100, 400, 'dude')
         this.player.setBounce(0.2)
         this.player.setCollideWorldBounds(true)

         this.anims.create({
             key:'left',
             frames: this.anims.generateFrameNumbers('dude', {start:0, end:3}),
             frameRate:10,
             repeat:-1
         })

         this.anims.create({
             key:'turn',
             frames: [{key:'dude', frame:4}],
             frameRate:20
         })

         this.anims.create({
             key:'right',
             frames: this.anims.generateFrameNumbers('dude', {start:5, end:8}),
             frameRate:10,
             repeat:-1

         })



         const  collectStar = (player,star) => {
             star.disableBody(true,true)

             this.score += 10
             this.scoreText.setText('Score: '+this.score)
            
            }


         this.physics.add.collider(this.player, this.platforms)

         
         this.stars = this.physics.add.group({
            key:'star',
            repeat: 11,
            setXY:{ x:12, y:0, stepX: 70}
         })

         this.physics.add.collider(this.stars, this.platforms)


         this.stars.children.iterate( (child) => {
             child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
         })

         this.physics.add.overlap(this.player, this.stars, collectStar, null, this)

         this.cursors = this.input.keyboard.createCursorKeys()
      


    }

    update = () => {
        if(this.cursors && this.cursors?.left.isDown){
            this.player?.setVelocityX(-160)
            this.player?.anims.play('left', true)
        } else if (this.cursors?.right.isDown){
            this.player?.setVelocityX(160)
            this.player?.anims.play('right', true)
        }else{
            this.player?.setVelocityX(0)
            this.player?.anims.play('turn')
        }


        if(this.cursors?.up.isDown && this.player?.body.touching.down){
            this.player?.setVelocityY(-330)
        }


    }
}