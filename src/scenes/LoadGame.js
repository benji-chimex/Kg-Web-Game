import { dimension, phaser, GameVar } from "@/app/components/Game"
import Phaser from "phaser"

export class LoadingScene extends Phaser.Scene {
    constructor() {
        super("LoadGame")
    }

    preload() {
        // Load background image
        this.load.image("background", "grass/grass-1.jpg")

        // Load beam images
        this.load.image("blue_beam", "beam/blue_beam.png")
        this.load.image("red_beam", "beam/red_beam.png")

        // Load spritesheets
        this.load.spritesheet("blue_tank_fire", "bluetank/right_fire_blue-Sheet.png", {
            frameWidth : 64,
            frameHeight : 64
        })
        this.load.spritesheet("red_tank_fire", "redtank/left_fire_red-Sheet.png", {
            frameWidth : 64,
            frameHeight : 64
        })
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
}