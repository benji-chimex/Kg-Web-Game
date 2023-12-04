import { dimension, GameVar, phaser } from "@/app/components/Game"

const Phaser = await import("phaser")

export class GameScene extends Phaser.Scene {
    constructor() {
        super("PlayGame")
    }

    create() {
        this.duration = GameVar.duration * 60

        this.playerCount = GameVar.players.length

        this.timer = this.time.addEvent({
            delay : 1000,
            callback : this.countdown,
            callbackScope : this,
            loop : true
        })
        this.shoot = this.time.addEvent({
            delay : 1000,
            callback : this.shootBeams,
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

        this.initPlayers()

        this.initPlayerLabels()

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

        this.initPhysicsGroups()

        this.setPhysics()

        this.setPhysicsCollider()
    }

    update() {
        // Move the background tilesprite
        this.background.tilePositionX -= 0.5

        if(this.playerCount == 2) {
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
        } else if(this.playerCount == 3) {
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

            for(let i = 0; i < this.white_beams.getLength(); i++) {
                if(this.white_beams.children.entries[i].x >= dimension.width) {
                    this.white_beams.children.entries[i].destroy()
                }
            }
        } else if(this.playerCount == 4) {
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

            for(let i = 0; i < this.white_beams.getLength(); i++) {
                if(this.white_beams.children.entries[i].x >= dimension.width) {
                    this.white_beams.children.entries[i].destroy()
                }
            }

            for(let i = 0; i < this.black_beams.getLength(); i++) {
                if(this.black_beams.children.entries[i].x <= 0) {
                    this.black_beams.children.entries[i].destroy()
                }
            }
        }

        if(this.playerCount == 2) {
            if(this.playerA.tanks == 0) {
                this.gameOverText(this.playerB.username)
               
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver(this.playerB.id),
                    callbackScope : this,
                    loop : false
                })
            }
    
            if(this.playerB.tanks == 0) {
                this.gameOverText(this.playerA.username)
    
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver(this.playerA.id),
                    callbackScope : this,
                    loop : false
                })
            }
        } else if(this.playerCount == 3) {
            if(this.playerA.tanks == 0 && this.playerB.tanks == 0) {
                this.gameOverText(this.playerC.username)
               
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver(this.playerC.id),
                    callbackScope : this,
                    loop : false
                })
            }
    
            if(this.playerB.tanks == 0 && this.playerC.tanks == 0) {
                this.gameOverText(this.playerA.username)
    
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver(this.playerA.id),
                    callbackScope : this,
                    loop : false
                })
            }

            if(this.playerA.tanks == 0 && this.playerC.tanks == 0) {
                this.gameOverText(this.playerB.username)
    
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver(this.playerB.id),
                    callbackScope : this,
                    loop : false
                })
            }
        } else if(this.playerCount == 4) {
            if(this.playerA.tanks == 0 && this.playerB.tanks == 0 && this.playerC.tanks == 0) {
                this.gameOverText(this.playerD.username)
               
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver(this.playerD.id),
                    callbackScope : this,
                    loop : false
                })
            }
    
            if(this.playerB.tanks == 0 && this.playerC.tanks == 0 && this.playerD.tanks == 0) {
                this.gameOverText(this.playerA.username)
    
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver(this.playerA.id),
                    callbackScope : this,
                    loop : false
                })
            }

            if(this.playerA.tanks == 0 && this.playerC.tanks == 0 && this.playerD.tanks == 0) {
                this.gameOverText(this.playerB.username)
    
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver(this.playerB.id),
                    callbackScope : this,
                    loop : false
                })
            }

            if(this.playerA.tanks == 0 && this.playerB.tanks == 0 && this.playerD.tanks == 0) {
                this.gameOverText(this.playerC.username)
    
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver(this.playerC.id),
                    callbackScope : this,
                    loop : false
                })
            }
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

    async gameOver(id) {
        const response = await fetch(`http://localhost:8000/deactivate/${GameVar.gameId}/${id}`)
        const data = await response.text()
        console.log(data)

        phaser.destroy(true, true)

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
        if(this.playerCount == 2) {
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
        } else if(this.playerCount == 3) {
            if((this.playerA.score > this.playerB.score) && (this.playerA.score > this.playerC.score)) {
                this.gameOverText(this.playerA.username)
               
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver,
                    callbackScope : this,
                    loop : false
                })
            } else if((this.playerB.score > this.playerA.score) && (this.playerB.score > this.playerC.score)) {
                this.gameOverText(this.playerB.username)
               
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver,
                    callbackScope : this,
                    loop : false
                })
            } else if((this.playerC.score > this.playerA.score) && (this.playerC.score > this.playerB.score)) {
                this.gameOverText(this.playerC.username)
               
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver,
                    callbackScope : this,
                    loop : false
                })
            } else if(this.playerA.score == this.playerB.score == this.playerC.score) {
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
        } else if(this.playerCount == 4) {
            if((this.playerA.score > this.playerB.score) && (this.playerA.score > this.playerC.score) && (this.playerA.score > this.playerD.score)) {
                this.gameOverText(this.playerA.username)
               
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver,
                    callbackScope : this,
                    loop : false
                })
            } else if((this.playerB.score > this.playerA.score) && (this.playerB.score > this.playerC.score) && (this.playerB.score > this.playerD.score)) {
                this.gameOverText(this.playerB.username)
               
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver,
                    callbackScope : this,
                    loop : false
                })
            } else if((this.playerC.score > this.playerA.score) && (this.playerC.score > this.playerB.score) && (this.playerC.score > this.playerD.score)) {
                this.gameOverText(this.playerC.username)
               
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver,
                    callbackScope : this,
                    loop : false
                })
            } else if((this.playerD.score > this.playerA.score) && (this.playerD.score > this.playerB.score) && (this.playerD.score > this.playerC.score)) {
                this.gameOverText(this.playerC.username)
               
                this.time.addEvent({
                    delay : 5000,
                    callback : this.gameOver,
                    callbackScope : this,
                    loop : false
                })
            } else if(this.playerA.score == this.playerB.score == this.playerC.score == this.playerD.score) {
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
    }

    initPlayers() {
        if(this.playerCount == 2) {
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
        } else if(this.playerCount == 3) {
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
            this.playerC = {
                id : GameVar.players[2].userId,
                username : GameVar.players[2].username,
                score : 0,
                tanks : GameVar.players[2].tanks,
            }
        } else if(this.playerCount == 4) {
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
            this.playerC = {
                id : GameVar.players[2].userId,
                username : GameVar.players[2].username,
                score : 0,
                tanks : GameVar.players[2].tanks,
            }
            this.playerD = {
                id : GameVar.players[3].userId,
                username : GameVar.players[3].username,
                score : 0,
                tanks : GameVar.players[3].tanks,
            }
        }
    }

    initPlayerLabels() {
        if(this.playerCount == 2) {
            this.add.text(25, 25, `${this.playerA.username}`, {
                fontSize : "18px"
            })
            this.scoreA = this.add.text(25, 50, `SCORE:${this.playerA.score}`, {
                fontSize : "18px"
            })
            this.add.text((dimension.width / 2) - 50, 25, `${GameVar.gameId}`, {
                fontSize : "18px"
            })
            this._timer = this.add.text((dimension.width / 2) - 50, 50, this.formatTime(this.duration), {
                fontSize : "18px"
            })
            this.add.text((dimension.width - 150), 25, `${this.playerB.username}`, {
                fontSize : "18px"
            })
            this.scoreB = this.add.text((dimension.width - 150), 50, `SCORE:${this.playerB.score}`, {
                fontSize : "18px"
            })
        } else if(this.playerCount == 3) {
            this.add.text(25, 25, `${this.playerA.username}`, {
                fontSize : "18px"
            })
            this.scoreA = this.add.text(25, 50, `SCORE:${this.playerA.score}`, {
                fontSize : "18px"
            })
            this.add.text((dimension.width / 2) - 50, 25, `${GameVar.gameId}`, {
                fontSize : "18px"
            })
            this._timer = this.add.text((dimension.width / 2) - 50, 50, this.formatTime(this.duration), {
                fontSize : "18px"
            })
            this.add.text((dimension.width - 150), 25, `${this.playerB.username}`, {
                fontSize : "18px"
            })
            this.scoreB = this.add.text((dimension.width - 150), 50, `SCORE:${this.playerB.score}`, {
                fontSize : "18px"
            })
            this.add.text(25, (dimension.height - 25), `${this.playerC.username}`, {
                fontSize : "18px"
            })
            this.scoreC = this.add.text(25, (dimension.height - 50), `SCORE:${this.playerC.score}`, {
                fontSize : "18px"
            })
        } else if(this.playerCount == 4) {
            this.add.text(25, 25, `${this.playerA.username}`, {
                fontSize : "18px"
            })
            this.scoreA = this.add.text(25, 50, `SCORE:${this.playerA.score}`, {
                fontSize : "18px"
            })
            this.add.text((dimension.width / 2) - 50, 25, `${GameVar.gameId}`, {
                fontSize : "18px"
            })
            this._timer = this.add.text((dimension.width / 2) - 50, 50, this.formatTime(this.duration), {
                fontSize : "18px"
            })
            this.add.text((dimension.width - 150), 25, `${this.playerB.username}`, {
                fontSize : "18px"
            })
            this.scoreB = this.add.text((dimension.width - 150), 50, `SCORE:${this.playerB.score}`, {
                fontSize : "18px"
            })
            this.add.text(25, (dimension.height - 25), `${this.playerC.username}`, {
                fontSize : "18px"
            })
            this.scoreC = this.add.text(25, (dimension.height - 50), `SCORE:${this.playerC.score}`, {
                fontSize : "18px"
            })
            this.add.text((dimension.width - 150), (dimension.height - 25), `${this.playerD.username}`, {
                fontSize : "18px"
            })
            this.scoreD = this.add.text((dimension.width - 150), (dimension.height - 50), `SCORE:${this.playerD.score}`, {
                fontSize : "18px"
            })
        }
    }

    initPhysicsGroups() {
        if(this.playerCount == 2) {
            this.blue_tanks = this.physics.add.group()
            this.red_tanks = this.physics.add.group()
            this.blue_beams = this.physics.add.group()
            this.red_beams = this.physics.add.group()
        } else if(this.playerCount == 3) {
            this.blue_tanks = this.physics.add.group()
            this.red_tanks = this.physics.add.group()
            this.white_tanks = this.physics.add.group()
            this.blue_beams = this.physics.add.group()
            this.red_beams = this.physics.add.group()
            this.white_beams = this.physics.add.group()
        } else if(this.playerCount == 4) {
            this.blue_tanks = this.physics.add.group()
            this.red_tanks = this.physics.add.group()
            this.white_tanks = this.physics.add.group()
            this.black_tanks = this.physics.add.group()
            this.blue_beams = this.physics.add.group()
            this.red_beams = this.physics.add.group()
            this.white_beams = this.physics.add.group()
            this.black_beams = this.physics.add.group()
        }
    }

    randomSpeed() {
        return Phaser.Math.Between(30, 50)
    }

    randomSpeed() {
        return Phaser.Math.Between(30, 50)
    }

    shootBeams() {
        this.beam.play()

        if(this.playerCount == 2) {
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
        } else if(this.playerCount == 3) {
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

            for(let i = 0; i < this.white_tanks.getLength(); i++) {
                let white_beam = this.physics.add.image(
                    this.white_tanks.children.entries[i].x, 
                    this.white_tanks.children.entries[i].y, 
                    `white_beam`
                )
                this.white_beams.add(white_beam)
                this.physics.world.enableBody(white_beam)
                white_beam.body.velocity.x = + 200
            }
        } else if(this.playerCount == 4) {
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

            for(let i = 0; i < this.white_tanks.getLength(); i++) {
                let white_beam = this.physics.add.image(
                    this.white_tanks.children.entries[i].x, 
                    this.white_tanks.children.entries[i].y, 
                    `white_beam`
                )
                this.white_beams.add(white_beam)
                this.physics.world.enableBody(white_beam)
                white_beam.body.velocity.x = + 200
            }

            for(let i = 0; i < this.black_tanks.getLength(); i++) {
                let black_beam = this.physics.add.image(
                    this.black_tanks.children.entries[i].x, 
                    this.black_tanks.children.entries[i].y, 
                    `black_beam`
                )
                this.black_beams.add(black_beam)
                this.physics.world.enableBody(black_beam)
                black_beam.body.velocity.x = - 200
            }
        }
    }

    setPhysics() {
        if(this.playerCount == 2) {
            for(let i = 0; i < this.playerA.tanks; i++) {
                let blue_tank = this.physics.add.sprite(`blue_tank`)
                this.blue_tanks.add(blue_tank)
                blue_tank.setRandomPosition(
                    0,
                    0,
                    dimension.width / 4,
                    dimension.height / 4
                )

                this.anims.create({
                    key : `blue_tank_anim`,
                    frameRate : 20,
                    frames : this.anims.generateFrameNumbers(`blue_tank`),
                    repeat : -1
                })
                blue_tank.play(`blue_tank_anim`)
    
                blue_tank.setVelocity(this.randomSpeed(), this.randomSpeed())
                blue_tank.setCollideWorldBounds(true)
                blue_tank.setBounce(1)
            }
    
            for(let i = 0; i < this.playerB.tanks; i++) {
                let red_tank = this.physics.add.sprite(`red_tank`)
                this.red_tanks.add(red_tank)
                red_tank.setRandomPosition(
                    dimension.width / 2,
                    0,
                    dimension.width / 4,
                    dimension.height / 4
                )

                this.anims.create({
                    key : `red_tank_anim`,
                    frameRate : 20,
                    frames : this.anims.generateFrameNumbers(`red_tank`),
                    repeat : -1
                })
                red_tank.play(`red_tank_anim`)
    
                red_tank.setVelocity(this.randomSpeed(), this.randomSpeed())
                red_tank.setCollideWorldBounds(true)
                red_tank.setBounce(1)
            }
        } else if(this.playerCount == 3) {
            for(let i = 0; i < this.playerA.tanks; i++) {
                let blue_tank = this.physics.add.sprite(`blue_tank`)
                this.blue_tanks.add(blue_tank)
                blue_tank.setRandomPosition(
                    0,
                    0,
                    dimension.width / 4,
                    dimension.height / 4
                )

                this.anims.create({
                    key : `blue_tank_anim`,
                    frameRate : 20,
                    frames : this.anims.generateFrameNumbers(`blue_tank`),
                    repeat : -1
                })
                blue_tank.play(`blue_tank_anim`)
    
                blue_tank.setVelocity(this.randomSpeed(), this.randomSpeed())
                blue_tank.setCollideWorldBounds(true)
                blue_tank.setBounce(1)
            }
    
            for(let i = 0; i < this.playerB.tanks; i++) {
                let red_tank = this.physics.add.sprite(`red_tank`)
                this.red_tanks.add(red_tank)
                red_tank.setRandomPosition(
                    dimension.width / 2,
                    0,
                    dimension.width / 4,
                    dimension.height / 4
                )

                this.anims.create({
                    key : `red_tank_anim`,
                    frameRate : 20,
                    frames : this.anims.generateFrameNumbers(`red_tank`),
                    repeat : -1
                })
                red_tank.play(`red_tank_anim`)
    
                red_tank.setVelocity(this.randomSpeed(), this.randomSpeed())
                red_tank.setCollideWorldBounds(true)
                red_tank.setBounce(1)
            }

            for(let i = 0; i < this.playerC.tanks; i++) {
                let white_tank = this.physics.add.sprite(`white_tank`)
                this.white_tanks.add(white_tank)
                white_tank.setRandomPosition(
                    0,
                    dimension.height / 2,
                    dimension.width / 4,
                    dimension.height / 4
                )

                this.anims.create({
                    key : `white_tank_anim`,
                    frameRate : 20,
                    frames : this.anims.generateFrameNumbers(`white_tank`),
                    repeat : -1
                })
                white_tank.play(`white_tank_anim`)
    
                white_tank.setVelocity(this.randomSpeed(), this.randomSpeed())
                white_tank.setCollideWorldBounds(true)
                white_tank.setBounce(1)
            }
        } else if(this.playerCount == 4) {
            for(let i = 0; i < this.playerA.tanks; i++) {
                let blue_tank = this.physics.add.sprite(`blue_tank`)
                this.blue_tanks.add(blue_tank)
                blue_tank.setRandomPosition(
                    0,
                    0,
                    dimension.width / 4,
                    dimension.height / 4
                )

                this.anims.create({
                    key : `blue_tank_anim`,
                    frameRate : 20,
                    frames : this.anims.generateFrameNumbers(`blue_tank`),
                    repeat : -1
                })
                blue_tank.play(`blue_tank_anim`)
    
                blue_tank.setVelocity(this.randomSpeed(), this.randomSpeed())
                blue_tank.setCollideWorldBounds(true)
                blue_tank.setBounce(1)
            }
    
            for(let i = 0; i < this.playerB.tanks; i++) {
                let red_tank = this.physics.add.sprite(`red_tank`)
                this.red_tanks.add(red_tank)
                red_tank.setRandomPosition(
                    dimension.width / 2,
                    0,
                    dimension.width / 4,
                    dimension.height / 4
                )

                this.anims.create({
                    key : `red_tank_anim`,
                    frameRate : 20,
                    frames : this.anims.generateFrameNumbers(`red_tank`),
                    repeat : -1
                })
                red_tank.play(`red_tank_anim`)
    
                red_tank.setVelocity(this.randomSpeed(), this.randomSpeed())
                red_tank.setCollideWorldBounds(true)
                red_tank.setBounce(1)
            }

            for(let i = 0; i < this.playerC.tanks; i++) {
                let white_tank = this.physics.add.sprite(`white_tank`)
                this.white_tanks.add(white_tank)
                white_tank.setRandomPosition(
                    0,
                    dimension.height / 2,
                    dimension.width / 4,
                    dimension.height / 4
                )

                this.anims.create({
                    key : `white_tank_anim`,
                    frameRate : 20,
                    frames : this.anims.generateFrameNumbers(`white_tank`),
                    repeat : -1
                })
                white_tank.play(`white_tank_anim`)
    
                white_tank.setVelocity(this.randomSpeed(), this.randomSpeed())
                white_tank.setCollideWorldBounds(true)
                white_tank.setBounce(1)
            }

            for(let i = 0; i < this.playerD.tanks; i++) {
                let black_tank = this.physics.add.sprite(`black_tank`)
                this.black_tanks.add(black_tank)
                black_tank.setRandomPosition(
                    dimension.width / 2,
                    dimension.height / 2,
                    dimension.width / 4,
                    dimension.height / 4
                )

                this.anims.create({
                    key : `black_tank_anim`,
                    frameRate : 20,
                    frames : this.anims.generateFrameNumbers(`black_tank`),
                    repeat : -1
                })
                black_tank.play(`black_tank_anim`)
    
                black_tank.setVelocity(this.randomSpeed(), this.randomSpeed())
                black_tank.setCollideWorldBounds(true)
                black_tank.setBounce(1)
            }
        }
    }

    setPhysicsCollider() {
        if(this.playerCount == 2) {
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
        } else if(this.playerCount == 3) {
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

            this.physics.add.collider(this.blue_beams, this.white_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreA.setText(`SCORE:${this.playerA.score + 1}`)
                this.playerA.score += 1
                this.playerC.tanks -= 1
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

            this.physics.add.collider(this.red_beams, this.white_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreB.setText(`SCORE:${this.playerB.score + 1}`)
                this.playerB.score += 1
                this.playerC.tanks -= 1
            })

            this.physics.add.collider(this.white_beams, this.blue_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreC.setText(`SCORE:${this.playerC.score + 1}`)
                this.playerC.score += 1
                this.playerA.tanks -= 1
            })

            this.physics.add.collider(this.white_beams, this.red_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreC.setText(`SCORE:${this.playerC.score + 1}`)
                this.playerC.score += 1
                this.playerB.tanks -= 1
            })
    
            this.physics.add.collider(this.blue_beams, this.red_beams, (blue_beam, red_beam) => {
                blue_beam.destroy()
                red_beam.destroy()
            })
            this.physics.add.collider(this.blue_beams, this.white_beams, (blue_beam, white_beam) => {
                blue_beam.destroy()
                white_beam.destroy()
            })
            this.physics.add.collider(this.red_beams, this.white_beams, (red_beam, white_beam) => {
                red_beam.destroy()
                white_beam.destroy()
            })
        } else if(this.playerCount == 4) {
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

            this.physics.add.collider(this.blue_beams, this.white_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreA.setText(`SCORE:${this.playerA.score + 1}`)
                this.playerA.score += 1
                this.playerC.tanks -= 1
            })

            this.physics.add.collider(this.blue_beams, this.black_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreA.setText(`SCORE:${this.playerA.score + 1}`)
                this.playerA.score += 1
                this.playerD.tanks -= 1
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

            this.physics.add.collider(this.red_beams, this.white_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreB.setText(`SCORE:${this.playerB.score + 1}`)
                this.playerB.score += 1
                this.playerC.tanks -= 1
            })

            this.physics.add.collider(this.red_beams, this.black_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreB.setText(`SCORE:${this.playerB.score + 1}`)
                this.playerB.score += 1
                this.playerD.tanks -= 1
            })

            this.physics.add.collider(this.white_beams, this.blue_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreC.setText(`SCORE:${this.playerC.score + 1}`)
                this.playerC.score += 1
                this.playerA.tanks -= 1
            })

            this.physics.add.collider(this.white_beams, this.red_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreC.setText(`SCORE:${this.playerC.score + 1}`)
                this.playerC.score += 1
                this.playerB.tanks -= 1
            })

            this.physics.add.collider(this.white_beams, this.black_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreC.setText(`SCORE:${this.playerC.score + 1}`)
                this.playerC.score += 1
                this.playerD.tanks -= 1
            })

            this.physics.add.collider(this.black_beams, this.blue_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreD.setText(`SCORE:${this.playerD.score + 1}`)
                this.playerD.score += 1
                this.playerA.tanks -= 1
            })

            this.physics.add.collider(this.black_beams, this.red_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreD.setText(`SCORE:${this.playerD.score + 1}`)
                this.playerC.score += 1
                this.playerB.tanks -= 1
            })

            this.physics.add.collider(this.black_beams, this.white_tanks, (beam, tank) => {
                beam.destroy()
                tank.destroy()
    
                let explode = this.physics.add.sprite(tank.x, tank.y, "explode")
                explode.play("explode_anim")
                this.explosion.play()
    
                this.scoreD.setText(`SCORE:${this.playerD.score + 1}`)
                this.playerD.score += 1
                this.playerC.tanks -= 1
            })
    
            this.physics.add.collider(this.blue_beams, this.red_beams, (blue_beam, red_beam) => {
                blue_beam.destroy()
                red_beam.destroy()
            })
            this.physics.add.collider(this.blue_beams, this.white_beams, (blue_beam, white_beam) => {
                blue_beam.destroy()
                white_beam.destroy()
            })
            this.physics.add.collider(this.blue_beams, this.black_beams, (blue_beam, black_beam) => {
                blue_beam.destroy()
                black_beam.destroy()
            })
            this.physics.add.collider(this.red_beams, this.white_beams, (red_beam, white_beam) => {
                red_beam.destroy()
                white_beam.destroy()
            })
            this.physics.add.collider(this.red_beams, this.black_beams, (red_beam, black_beam) => {
                red_beam.destroy()
                black_beam.destroy()
            })
            this.physics.add.collider(this.black_beams, this.white_beams, (black_beam, white_beam) => {
                black_beam.destroy()
                white_beam.destroy()
            })
        }
    }
}