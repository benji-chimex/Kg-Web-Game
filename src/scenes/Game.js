import { dimension, GameVar } from "@/app/components/Game"
import Phaser from "phaser"

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("PlayGame")
    }

    create() {
        this.duration = GameVar.duration * 60

        this.timer = this.time.addEvent({
            delay : 1000,
            callback : this.countdown,
            callbackScope : this,
            loop : true
        })

        this.background = this.add.tileSprite(0, 0, dimension.width, dimension.height, "background")
        this.background.setOrigin(0, 0)

        this.playerA = {
            id : GameVar.players[0].userId,
            username : GameVar.players[0].username,
            score : 0,
            activeTanks : GameVar.players[0].activeTanks,
            reserveTanks : GameVar.players[0].reserveTanks,
        }
        this.playerB = {
            id : GameVar.players[1].userId,
            username : GameVar.players[1].username,
            score : 0,
            activeTanks : GameVar.players[1].activeTanks,
            reserveTanks : GameVar.players[1].reserveTanks,
        }

        this.add.text(25, 25, `${this.playerA.username}`, {
            fontSize : "18px"
        })
        this.add.text(25, 50, `SCORE:${this.playerA.score}`, {
            fontSize : "18px"
        })
        this.add.text((dimension.width / 2) - 50, 25, `${GameVar.gameId}`, {
            fontSize : "18px"
        })
        this.add.text((dimension.width - 150), 25, `${this.playerB.username}`, {
            fontSize : "18px"
        })
        this._timer = this.add.text((dimension.width / 2) - 50, 50, this.formatTime(this.duration), {
            fontSize : "18px"
        })
        this.add.text((dimension.width - 150), 50, `SCORE:${this.playerB.score}`, {
            fontSize : "18px"
        })
        console.log(this.playerA, this.playerB)

        this.beam = this.sound.add("beam")
        this.explosion = this.sound.add("explosion")
        this.music = this.sound.add("music")

        this.music.play({
            mute : false,
            volume : 1,
            rate : 1,
            detune : 0,
            seek : 0,
            loop : false,
            delay : 0
        })
        
        this.anims.create({
            key : "explode_anim",
            frameRate : 20,
            frames : this.anims.generateFrameNumbers("explode"),
            repeat : 0,
            hideOnComplete : true
        })

        this.setPhysics()
    }

    update() {
        // Move the background tilesprite
        this.background.tilePositionX -= 0.5
    }

    countdown() {
        this.beam.play()
        
        this.duration -= 1
        this._timer.setText(this.formatTime(this.duration))
        
        if(this.duration == 0) {
            this.timer.destroy()
            this._timer.setText("00:00")
        }
    }

    formatTime(seconds) {
        let minutes = Math.floor(seconds / 60)
        minutes = minutes.toString().padStart(2, "0")

        let _seconds = seconds % 60
        _seconds = _seconds.toString().padStart(2, "0")

        return `${minutes}:${_seconds}`
    }

    randomExplosion() {
        const randomNum = Phaser.Math.Between(0, 1)
        console.log(randomNum)

        if(randomNum > 0.5) {
            return "blue"
        } else if(randomNum < 0.5) {
            return "red"
        }
    }

    randomSpeed(a, b) {
        const randomNum = Phaser.Math.Between(a, b)
        console.log(randomNum)

        return randomNum
    }

    setPhysics() {
        this.physics.world.setBoundsCollision()

        this.blue_tanks = this.physics.add.group()

        this.red_tanks = this.physics.add.group()

        for(let i = 0; i < 5; i++) {
            let blue_tank = this.physics.add.sprite("blue_tank_fire")
            this.blue_tanks.add(blue_tank)
            blue_tank.setRandomPosition(0, 60, dimension.width / 2, dimension.height)

            this.anims.create({
                key : "blue_tank_fire_anim",
                frameRate : 20,
                frames : this.anims.generateFrameNumbers("blue_tank_fire"),
                repeat : -1
            })
            blue_tank.play("blue_tank_fire_anim")

            blue_tank.setVelocity(20, 20)
            blue_tank.setCollideWorldBounds(true)
            blue_tank.setBounce(1)
        }

        for(let i = 0; i < 5; i++) {
            let red_tank = this.physics.add.sprite("red_tank_fire")
            this.red_tanks.add(red_tank)
            red_tank.setRandomPosition(dimension.width / 2, 60, dimension.width, dimension.height)

            this.anims.create({
                key : "red_tank_fire_anim",
                frameRate : 20,
                frames : this.anims.generateFrameNumbers("red_tank_fire"),
                repeat : -1
            })
            red_tank.play("red_tank_fire_anim")

            red_tank.setVelocity(20, 20)
            red_tank.setCollideWorldBounds(true)
            red_tank.setBounce(1)
        }
    }
}