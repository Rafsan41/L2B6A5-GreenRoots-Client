"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// ScrollTrigger already registered in LenisProvider — no second register needed

/**
 * Global scroll-reveal runner.
 * Place once in layout — picks up all [data-reveal] elements.
 *
 * Supported data attributes:
 *   data-reveal               → fade + slide up (default)
 *   data-reveal-y="60"        → custom y offset (default 40)
 *   data-reveal-delay="0.15"  → entrance delay in seconds
 *   data-reveal-from="left"   → slide in from left
 *   data-reveal-from="right"  → slide in from right
 *   data-reveal-stagger       → staggers direct children instead of the element
 *   data-reveal-stagger="0.1" → custom stagger gap (default 0.12s)
 */
export function GsapScrollReveal() {
  useEffect(() => {
    // Wait one tick so the DOM is fully painted
    const id = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {

        // ── 1. Stagger groups ─────────────────────────────────────────────────
        document.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((parent) => {
          const staggerGap = parseFloat(parent.dataset.revealStagger || "0.12")
          const children   = Array.from(parent.children) as HTMLElement[]
          if (!children.length) return

          gsap.fromTo(
            children,
            { opacity: 0, y: 40 },
            {
              opacity:  1,
              y:        0,
              duration: 0.75,
              ease:     "power3.out",
              stagger:  staggerGap,
              scrollTrigger: {
                trigger: parent,
                start:   "top 86%",
                once:    true,
              },
            }
          )
        })

        // ── 2. Individual reveals ─────────────────────────────────────────────
        document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
          // Skip if it's a stagger parent (handled above)
          if (el.hasAttribute("data-reveal-stagger")) return

          const delay = parseFloat(el.dataset.revealDelay ?? "0")
          const y     = parseFloat(el.dataset.revealY     ?? "40")
          const from  = el.dataset.revealFrom               // "left" | "right" | undefined

          const fromVars: gsap.TweenVars = { opacity: 0, y }
          if (from === "left")  { fromVars.x = -60; fromVars.y = 0 }
          if (from === "right") { fromVars.x =  60; fromVars.y = 0 }

          gsap.fromTo(
            el,
            fromVars,
            {
              opacity:  1,
              y:        0,
              x:        0,
              duration: 0.85,
              ease:     "power3.out",
              delay,
              scrollTrigger: {
                trigger: el,
                start:   "top 88%",
                once:    true,
              },
            }
          )
        })

        // ── 3. Parallax leaves (DriftingLeaves layer) ─────────────────────────
        const leaves = document.querySelectorAll<HTMLElement>("[data-parallax]")
        leaves.forEach((leaf) => {
          const speed = parseFloat(leaf.dataset.parallax ?? "0.15")
          gsap.to(leaf, {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger:  document.body,
              start:    "top top",
              end:      "bottom bottom",
              scrub:    true,
            },
          })
        })

      }) // end gsap.context

      // Refresh after layout settles
      ScrollTrigger.refresh()

      return () => ctx.revert()
    })

    return () => cancelAnimationFrame(id)
  }, [])

  return null
}
