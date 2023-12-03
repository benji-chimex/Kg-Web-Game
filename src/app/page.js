"use client"

import { useEffect, useState } from "react"
import Game from "./components/Game"
import Intro from "./components/Intro"
import { INTERVAL } from "@/constants"
import Outro from "./components/Outro"

export default function HomePage() {
  const [game, setGame] = useState()
  const [gaming, setGaming] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGaming(true)
    }, (INTERVAL*60*1000) + 5000)

    const _game = async () => {
      const data = await getGame()
      data ? await activateGame(data.gameId) : null
    }

    _game()

    return () => clearTimeout(timeout)
  }, [])

  const getGame = async () => {
    const response = await fetch("https://kg-web-server.onrender.com/games")
    const data = await response.json()
    console.log(data._doc)

    setGame(data._doc)

    return data._doc
  }

  const activateGame = async (id) => {
    const response = await fetch(`https://kg-web-server.onrender.com/activate/${id}`)
    const data = await response.text()
    console.log(data)
  }

  return (
    <>
      { game && gaming && <Game game={game}/> }
      { game && !gaming && <Intro duration={INTERVAL}/> }
      { !game && !gaming && <Outro/> }
    </>
  )
}