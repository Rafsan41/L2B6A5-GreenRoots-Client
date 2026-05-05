"use client"

import { createContext, useContext, useEffect, useRef } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register once — here, not in every consumer
gsap.registerPlugin(ScrollTrigger)

// ── Context ───────────────────────────────────────────────────────────────────
const LenisContext = createContext<Lenis | null>(null)

/** Access the Lenis instance from any client component */
export function useLenis() {
  return useContext(LenisContext)
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration:        1.2,
      easing:          (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel:     true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite:        false,
    })
    lenisRef.current = lenis

    // Store reference so cleanup removes the SAME function
    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // Keep ScrollTrigger scroll position in sync with Lenis
    const onScroll = () => ScrollTrigger.update()
    lenis.on("scroll", onScroll)

    // Refresh ScrollTrigger once fonts + images are ready
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener("load", onLoad)

    return () => {
      lenis.off("scroll", onScroll)
      gsap.ticker.remove(onTick)
      window.removeEventListener("load", onLoad)
      ScrollTrigger.killAll()
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
