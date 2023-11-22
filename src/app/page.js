"use client"

import { useEffect, useState } from "react"
import Game from "./components/Game"
import Intro from "./components/Intro"
import { INTERVAL } from "@/constants"

export default function HomePage() {
  const [gaming, setGaming] = useState(false)
  const [game, setGame] = useState()

  useEffect(() => {
    const timeout01 = setTimeout(() => {
      setGaming(true)
    }, (INTERVAL*60*1000) + 5000)

    let timeout02 = null

    const _game = async () => {
      const {duration, gameId} = await getGame()
      console.log(duration, gameId)

      timeout02 = setTimeout(() => {
        endGame(gameId)
      }, (duration*60*1000) + (INTERVAL*60*1000) + 15000)
      console.log(timeout02)
    }

    _game()

    return () => {
      clearTimeout(timeout01)
      clearTimeout(timeout02)
    }
  }, [gaming])

  const getGame = async () => {
    const response = await fetch("http://localhost:8000/games")
    const data = await response.json()
    console.log(data._doc)

    setGame(data._doc)

    return data._doc
  }

  const endGame = async (id) => {
    const response = await fetch(`http://localhost:8000/deactivate/${id}`)
    const data = await response.text()
    console.log(data)

    data == "Success" ? setGaming(false) : null
  }

  return (
    <>
      { gaming ? <Game game={game}/> : <Intro duration={INTERVAL}/> }
    </>
  )
}