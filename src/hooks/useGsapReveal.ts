"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// ScrollTrigger registered once in LenisProvider — no second call here

/**
 * Attach to a container ref — every child matching `selector`
 * will fade + slide up when scrolled into view.
 */
export function useGsapReveal(
  selector = "[data-reveal]",
  options?: {
    y?: number
    duration?: number
    stagger?: number
    start?: string
  }
) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = el.querySelectorAll<HTMLElement>(selector)
    if (!targets.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: options?.y ?? 40 },
        {
          opacity:  1,
          y:        0,
          duration: options?.duration ?? 0.85,
          ease:     "power3.out",
          stagger:  options?.stagger ?? 0.12,
          scrollTrigger: {
            trigger:  el,
            start:    options?.start ?? "top 82%",
            once:     true,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [selector, options?.y, options?.duration, options?.stagger, options?.start])

  return ref
}
