"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// ScrollTrigger registered once in LenisProvider — no second call here

interface GsapRevealProps {
  children: React.ReactNode
  className?: string
  y?: number
  duration?: number
  stagger?: number
  delay?: number
  start?: string
  selector?: string
  as?: keyof JSX.IntrinsicElements
}

/**
 * Wraps children in a container that reveals them on scroll.
 * Mark direct children with data-reveal to animate individually,
 * or pass selector to target specific elements inside.
 */
export function GsapReveal({
  children,
  className,
  y = 40,
  duration = 0.85,
  stagger = 0.1,
  delay = 0,
  start = "top 85%",
  selector = "[data-reveal]",
  as: Tag = "div",
}: GsapRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = el.querySelectorAll<HTMLElement>(selector)
    if (!targets.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: "power3.out",
          stagger,
          delay,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [selector, y, duration, stagger, delay, start])

  return (
    // @ts-ignore
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
