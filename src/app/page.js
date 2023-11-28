"use client"

import { useEffect, useState } from "react"
import Game from "./components/Game"
import Intro from "./components/Intro"
import { INTERVAL } from "@/constants"

export default function HomePage() {
  const [game, setGame] = useState()
  const [gaming, setGaming] = useState()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGaming(true)
    }, (INTERVAL*60*1000) + 5000)

    const _game = async () => {
      await getGame()
    }

    _game()

    return () => clearTimeout(timeout)
  }, [gaming])

  const getGame = async () => {
    const response = await fetch("https://kg-web-server.onrender.com/games")
    const data = await response.json()
    console.log(data._doc)

    setGame(data._doc)

    return data._doc
  }

  return (
    <>
      { gaming ? <Game game={game}/> : <Intro duration={INTERVAL}/> }
    </>
  )
}