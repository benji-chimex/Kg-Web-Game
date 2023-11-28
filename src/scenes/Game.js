import { dimension, GameVar, phaser } from "@/app/components/Game"

const Phaser = await import("phaser")

export class GameScene extends Phaser.Scene {
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
        this.shoot = this.time.addEvent({
            delay : 1000,
            callback : this.shootBeam,
            callbackScope : this,
            loop : true
        })
        this.time.addEvent({
            delay : this.duration * 1000,
            callback : this.gameTimeOut,
            callbackScope : this,
            loop : false
        })

        this.background = this.add.tileSprite(0, 0, dimension.width, dimension.height, "background")
        this.background.setOrigin(0, 0)

        this.playerA = {
            id : GameVar.players[0].userId,
            username : GameVar.players[0].username,
            score : 0,
            tanks : GameVar.players[0].tanks
        }
        this.playerB = {
            id : GameVar.players[1].userId,
            username : GameVar.players[1].username,
            score : 0,
            tanks : GameVar.players[1].tanks,
        }

        this.add.text(25, 25, `${this.playerA.username}`, {
            fontSize : "18px"
        })
        this.scoreA = this.add.text(25, 50, `SCORE:${this.playerA.score}`, {
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
        this.scoreB = this.add.text((dimension.width - 150), 50, `SCORE:${this.playerB.score}`, {
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

        this.physics.world.setBoundsCollision()

        this.blue_tanks = this.physics.add.group()
        this.red_tanks = this.physics.add.group()
        this.blue_beams = this.physics.add.group()
        this.red_beams = this.physics.add.group()

        this.setPhysics()

        this.physics.add.collider(this.blue_beams, this.red_tanks, (beam, tank) => {
            beam.destroy()
            tank.destroy()

            let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
            explode.play("explode_anim")
            this.explosion.play()

            this.scoreA.setText(`SCORE:${this.playerA.score + 1}`)
            this.playerA.score += 1
            this.playerB.tanks -= 1
        })

        this.physics.add.collider(this.red_beams, this.blue_tanks, (beam, tank) => {
            beam.destroy()
            tank.destroy()

            let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
            explode.play("explode_anim")
            this.explosion.play()

            this.scoreB.setText(`SCORE:${this.playerB.score + 1}`)
            this.playerB.score += 1
            this.playerA.tanks -= 1
        })

        this.physics.add.collider(this.blue_beams, this.red_beams, (blue_beam, red_beam) => {
            blue_beam.destroy()
            red_beam.destroy()
        })
    }

    update() {
        // Move the background tilesprite
        this.background.tilePositionX -= 0.5

        for(let i = 0; i < this.blue_beams.getLength(); i++) {
            if(this.blue_beams.children.entries[i].x >= dimension.width) {
                this.blue_beams.children.entries[i].destroy()
            }
        }

        for(let i = 0; i < this.red_beams.getLength(); i++) {
            if(this.red_beams.children.entries[i].x <= 0) {
                this.red_beams.children.entries[i].destroy()
            }
        }

        if(this.playerA.tanks == 0) {
            this.gameOverText(this.playerB.username)
           
            this.time.addEvent({
                delay : 5000,
                callback : this.gameOver,
                callbackScope : this,
                loop : false
            })
        }

        if(this.playerB.tanks == 0) {
            this.gameOverText(this.playerA.username)

            this.time.addEvent({
                delay : 5000,
                callback : this.gameOver,
                callbackScope : this,
                loop : false
            })
        }
    }

    countdown() {
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

    async gameOver() {
        phaser.destroy(true, true)

        const response = await fetch(`https://kg-web-server.onrender.com/deactivate/${GameVar.gameId}`)
        const data = await response.text()
        console.log(data)

        window.location.reload()
    }

    gameOverText(username) {
        this.add.text(dimension.width / 2, dimension.height / 2, "GAME OVER", {
            fontSize : "24px"
        })
        this.add.text(dimension.width / 2, (dimension.height / 2) + 30, `WINNER : ${username}`, {
            fontSize : "24px"
        })
    }

    gameTimeOut() {
        if(this.playerA.score > this.playerB.score) {
            this.gameOverText(this.playerA.username)
           
            this.time.addEvent({
                delay : 5000,
                callback : this.gameOver,
                callbackScope : this,
                loop : false
            })
        } else if(this.playerA.score < this.playerB.score) {
            this.gameOverText(this.playerB.username)
           
            this.time.addEvent({
                delay : 5000,
                callback : this.gameOver,
                callbackScope : this,
                loop : false
            })
        } else if(this.playerA.score == this.playerB.score) {
            this.add.text(dimension.width / 2, dimension.height / 2, "GAME OVER", {
                fontSize : "24px"
            })
            this.add.text(dimension.width / 2, (dimension.height / 2) + 30, `NO WINNER : TIE`, {
                fontSize : "24px"
            })
            
            this.time.addEvent({
                delay : 5000,
                callback : this.gameOver,
                callbackScope : this,
                loop : false
            })
        }
    }

    randomSpeed() {
        return Phaser.Math.Between(30, 50)
    }

    shootBeam() {
        this.beam.play()

        for(let i = 0; i < this.blue_tanks.getLength(); i++) {
            let blue_beam = this.physics.add.image(
                this.blue_tanks.children.entries[i].x,
                this.blue_tanks.children.entries[i].y,
                `blue_beam`
            )
            this.blue_beams.add(blue_beam)
            this.physics.world.enableBody(blue_beam)
            blue_beam.body.velocity.x = + 200
        }

        for(let i = 0; i < this.red_tanks.getLength(); i++) {
            let red_beam = this.physics.add.image(
                this.red_tanks.children.entries[i].x, 
                this.red_tanks.children.entries[i].y, 
                `red_beam`
            )
            this.red_beams.add(red_beam)
            this.physics.world.enableBody(red_beam)
            red_beam.body.velocity.x = - 200
        }
    }

    setPhysics() {
        for(let i = 0; i < this.playerA.tanks; i++) {
            let blue_tank = this.physics.add.sprite(`blue_tank_fire`)
            this.blue_tanks.add(blue_tank)
            blue_tank.setRandomPosition(0, 60, dimension.width / 2, dimension.height)

            this.anims.create({
                key : `blue_tank_fire_anim`,
                frameRate : 20,
                frames : this.anims.generateFrameNumbers(`blue_tank_fire`),
                repeat : -1
            })
            blue_tank.play(`blue_tank_fire_anim`)

            blue_tank.setVelocity(this.randomSpeed(), this.randomSpeed())
            blue_tank.setCollideWorldBounds(true)
            blue_tank.setBounce(1)
        }

        for(let i = 0; i < this.playerB.tanks; i++) {
            let red_tank = this.physics.add.sprite(`red_tank_fire`)
            this.red_tanks.add(red_tank)
            red_tank.setRandomPosition(dimension.width / 2, 60, dimension.width, dimension.height)

            this.anims.create({
                key : `red_tank_fire_anim`,
                frameRate : 20,
                frames : this.anims.generateFrameNumbers(`red_tank_fire`),
                repeat : -1
            })
            red_tank.play(`red_tank_fire_anim`)

            red_tank.setVelocity(this.randomSpeed(), this.randomSpeed())
            red_tank.setCollideWorldBounds(true)
            red_tank.setBounce(1)
        }
    }
}