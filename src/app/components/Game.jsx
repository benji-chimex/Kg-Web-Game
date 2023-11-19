"use client"

import { useEffect, useState } from "react"

export let dimension = null

export let phaser = null

export let GameVar = null

export default function Game({ game }) {
    const [pha_ser, setPhaser] = useState(null)

    useEffect(() => {
        const app = document.querySelector("body")
        console.log(app.clientWidth, app.clientHeight)

        const startGame = async () => {
            const _phaser = await initGame(app.clientWidth, 643)
            dimension = { width: app.clientWidth, height: 643}

            setPhaser(_phaser)
            phaser = _phaser
        }
        startGame()

        GameVar = game
        console.log(GameVar, "game", game)
    }, [])

    const initGame = async (width, height) => {
        const Phaser = await import("phaser")
        const { default: LoadingScene } = await import("../../scenes/LoadGame.js")
        const { default: GameScene } = await import("../../scenes/Game.js")

        const phaser = new Phaser.Game({
            type: Phaser.AUTO,
            width,
            height,
            backgroundColor: 0x000000,
            pixelArt: true,
            scene: [LoadingScene, GameScene],
            physics: {
                default: "arcade",
                arcade: {
                    debug: false
                }
            }
        })

        return phaser
    }

    return (
        <></>
    )
}