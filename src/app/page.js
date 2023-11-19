"use client"

import { useEffect, useState } from "react"
import Game from "./components/Game"
import Intro from "./components/Intro"
import { INTERVAL } from "@/constants"

export default function HomePage() {
  const [gaming, setGaming] = useState(false)
  const [game, setGame] = useState()

  useEffect(() => {
    const timeout = setTimeout(() => {
      getGame()
    }, (INTERVAL*60*1000) + 5000)

    return () => clearTimeout(timeout)
  })

  const getGame = async () => {
    const response = await fetch("http://localhost:8000/games")
    const data = await response.json()
    console.log(data._doc)

    setGame(data._doc)
    setGaming(true)
  }

  return (
    <>
      { gaming ? <Game game={game}/> : <Intro duration={INTERVAL}/> }
    </>
  )
}