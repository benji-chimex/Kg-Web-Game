import { dimension, phaser, GameVar } from "@/app/components/Game"

const Phaser = await import("phaser")

export class LoadingScene extends Phaser.Scene {
    constructor() {
        super("LoadGame")
    }

    preload() {
        const int = this.random()
        console.log(int)

        // Load background image
        this.load.image("background", `backgrounds/battleground-${int}.png`)

        // No of players
        this.playerCount = GameVar.players.length

        // Load beam images
        this.loadBeamImages()

        // Load tank spritesheets
        this.loadTankImages()

        // Load explosion spritesheet
        this.load.spritesheet("explode", "explosion/explosion.png", {
            frameWidth : 256,
            frameHeight : 256
        })

        // Load sounds
        this.load.audio("beam", ["sounds/beam.ogg", "sounds/beam.mp3"])
        this.load.audio("explosion", ["sounds/explosion.ogg", "sounds/explosion.mp3"])
        this.load.audio("music", ["sounds/music.ogg", "sounds/music.mp3"])
    }

    create() {
        console.log(dimension, phaser, GameVar)
        this.add.text(dimension.width / 2, dimension.height / 2, "Loading Game....", {
            fontSize : "50px"
        })
        this.scene.start("PlayGame")
    }

    loadBeamImages() {
        if(this.playerCount == 2) {
            this.load.image("blue_beam", "beams/blue_beam.png")
            this.load.image("red_beam", "beams/red_beam.png")
        } else if(this.playerCount == 3) {
            this.load.image("blue_beam", "beams/blue_beam.png")
            this.load.image("red_beam", "beams/red_beam.png")
            this.load.image("white_beam", "beams/white_beam.png")
        } else if(this.playerCount == 4) {
            this.load.image("blue_beam", "beams/blue_beam.png")
            this.load.image("red_beam", "beams/red_beam.png")
            this.load.image("white_beam", "beams/white_beam.png")
            this.load.image("black_beam", "beams/black_beam.png")
        }
    }

    loadTankImages() {
        if(this.playerCount == 2) {
            this.load.spritesheet("blue_tank", "tanks/blue_right.png", {
                frameWidth : 64,
                frameHeight : 64
            })
            this.load.spritesheet("red_tank", "tanks/red_left.png", {
                frameWidth : 64,
                frameHeight : 64
            })
        } else if(this.playerCount == 3) {
            this.load.spritesheet("blue_tank", "tanks/blue_right.png", {
                frameWidth : 64,
                frameHeight : 64
            })
            this.load.spritesheet("red_tank", "tanks/red_left.png", {
                frameWidth : 64,
                frameHeight : 64
            })
            this.load.spritesheet("white_tank", "tanks/white_right.png", {
                frameWidth : 64,
                frameHeight : 64
            })
        } else if(this.playerCount == 4) {
            this.load.spritesheet("blue_tank", "tanks/blue_right.png", {
                frameWidth : 64,
                frameHeight : 64
            })
            this.load.spritesheet("red_tank", "tanks/red_left.png", {
                frameWidth : 64,
                frameHeight : 64
            })
            this.load.spritesheet("white_tank", "tanks/white_right.png", {
                frameWidth : 64,
                frameHeight : 64
            })
            this.load.spritesheet("black_tank", "tanks/black_left.png", {
                frameWidth : 64,
                frameHeight : 64
            })
        }
    }

    random() {
        return Phaser.Math.Between(1, 4)
    }
}