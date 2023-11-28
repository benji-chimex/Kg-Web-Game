"use client"

import { useEffect, useState } from "react"

export let dimension = null

export let phaser = null

export let GameVar = null

export default function Game({ game }) {
    const [pha_ser, setPhaser] = useState(null)

    useEffect(() => {
        const startGame = async () => {
            const _phaser = await initGame()
            dimension = { width: 1200, height: 600 }
            GameVar = game

            setPhaser(_phaser)
            phaser = _phaser
        }
        startGame()
    }, [])

    const initGame = async () => {
        const Phaser = await import("phaser")
        const { LoadingScene } = await import("../../scenes/LoadGame.js")
        const { GameScene } = await import("../../scenes/Game.js")

        const phaser = new Phaser.Game({
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 1200,
                height: 600
            },
            backgroundColor: 0x000000,
            pixelArt: true,
            scene: [LoadingScene, GameScene],
            physics: {
                default: "arcade",
                arcade: {
                    debug: false
                }
            },
            audio: {
                disableWebAudio: false
            }
        })

        return phaser
    }

    return (
        <></>
    )
}