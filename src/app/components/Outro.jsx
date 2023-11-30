"use client"

import { useEffect, useRef } from "react"
import { Press_Start_2P } from 'next/font/google'
import Typed from 'typed.js'

const ps2 = Press_Start_2P({ 
    subsets: ['latin'],
    weight : "400"
})

export default function Outro() {
    const h1_el = useRef(null)
    const h1_typed = useRef(null)
    const h3_01_el = useRef(null)
    const h3_01_typed = useRef(null)
    const h3_02_el = useRef(null)
    const h3_02_typed = useRef(null)

    useEffect(() => {
        h1_typed.current = new Typed(h1_el.current, {
            strings : ["Welcome to the EmpireGame"],
            typeSpeed : 100
        })
        h3_01_typed.current = new Typed(h3_01_el.current, {
            strings : ["Battle for Kings"],
            typeSpeed : 100,
            startDelay : 5000
        })
        h3_02_typed.current = new Typed(h3_02_el.current, {
            strings : ["No active battles"],
            typeSpeed : 100,
            startDelay : 8000
        })

        return () => {
            h1_typed.current.destroy()
            h3_01_typed.current.destroy()
            h3_02_typed.current.destroy()
        }
    })

    return (
        <div id="intro" className="bg-black w-screen h-screen flex justify-center items-center">
            <div>
                <h1 className={`${ps2.className} text-white text-center text-4xl font-bold my-4`} ref={h1_el}/>
                <h3 className={`${ps2.className} text-white text-center text-2xl font-bold my-4`} ref={h3_01_el}/>
                <h3 className={`${ps2.className} text-white text-center text-xl font-bold my-4 animate-pulse`} ref={h3_02_el}/>
            </div>
        </div>
    )
}