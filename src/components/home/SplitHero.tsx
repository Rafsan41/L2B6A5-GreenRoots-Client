"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { FernSVG, CornerVineSVG, JarSVG } from "@/components/icons/botanical"

// ── Specimen card ─────────────────────────────────────────────────────────────
function SpecimenCard({
  number, tag, genus, species, commonName, partName, price, rotate, marginLeft,
}: {
  number: string; tag: string; genus: string; species: string
  commonName: string; partName: string; price: string
  rotate: string; marginLeft?: string
}) {
  return (
    <article
      className="relative p-5 rounded-2xl transition-all duration-300"
      style={{
        background:  "var(--parchment)",
        border:      "1px solid var(--rule)",
        boxShadow:   "4px 4px 0 oklch(0.88 0.025 80)",
        transform:   rotate,
        marginLeft,
      }}
    >
      <div className="flex justify-between items-baseline gap-2 mb-3">
        <span className="gr-mono" style={{ color: "var(--bark)" }}>Harvest {number}</span>
        <span className="gr-mono" style={{ color: "var(--clay)" }}>· {tag}</span>
      </div>

      <JarSVG
        genus={genus} species={species} commonName={commonName}
        className="w-24 mx-auto mb-3"
        style={{ color: "var(--ink)" }}
      />

      <h3
        className="text-2xl leading-tight mb-1"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 500, color: "var(--ink)" }}
      >
        {commonName.charAt(0) + commonName.slice(1).toLowerCase()}{" "}
        <em style={{ color: "var(--moss)", fontStyle: "italic" }}>{partName}</em>
      </h3>
      <p
        className="text-sm mb-2"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic", color: "var(--bark)" }}
      >
        {genus} {species}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-xl" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 500, color: "var(--ink)" }}>
          {price}
        </span>
        <span className="gr-mono">· 60 caps</span>
      </div>

      {/* Fresh harvest seal */}
      <div
        className="absolute -top-4 -right-4 w-14 h-14 rounded-full flex items-center justify-center text-center leading-tight"
        style={{
          border: "1px solid var(--rust)", background: "var(--parchment)", color: "var(--rust)",
          fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 8,
          letterSpacing: "0.08em", textTransform: "uppercase", transform: "rotate(12deg)",
        }}
      >
        Fresh<br />Harvest
      </div>
    </article>
  )
}

// ── Slide 1: Herb guide + specimen cards ──────────────────────────────────────
function SlideOne() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return

    // Scope ALL selectors to this component only — no global document leakage
    const ctx = gsap.context((self) => {
      const leftEls  = self.selector!("[data-hero-left]")
      const cardEls  = self.selector!("[data-hero-card]")

      // Left panel — stagger text elements up
      gsap.fromTo(
        leftEls,
        { opacity: 0, y: 32 },
        {
          opacity:  1,
          y:        0,
          duration: 0.9,
          ease:     "power3.out",
          stagger:  0.10,
          delay:    0.1,
          clearProps: "transform",   // don't leave inline transform after animation
        }
      )

      // Right panel cards — slide from right, preserve tilt via CSS (not inline style)
      gsap.fromTo(
        cardEls,
        { opacity: 0, x: 55 },
        {
          opacity:    1,
          x:          0,
          duration:   0.85,
          ease:       "power3.out",
          stagger:    0.16,
          delay:      0.35,
          clearProps: "x,opacity",   // clean up so CSS transform (rotate) still applies
        }
      )
    }, rootRef) // ← scope to rootRef

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="w-screen h-full shrink-0 flex flex-col lg:grid" style={{ gridTemplateColumns: "1.15fr 1fr" }}>

      {/* LEFT: dark moss panel — semi-transparent over hero photo */}
      <div
        className="flex flex-col relative overflow-hidden h-full"
        style={{
          background: "oklch(0.10 0.04 145 / 0.75)",
          color:      "var(--parchment)",
          padding:    "clamp(20px, 3vw, 44px) clamp(20px, 5vw, 56px)",
          backdropFilter: "blur(2px)",
        }}
      >
        <CornerVineSVG
          className="absolute pointer-events-none"
          style={{ top: 0, left: 0, width: 280, height: 280, color: "var(--moss-soft)", opacity: 0.55, zIndex: 3 }}
        />
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 400 800" fill="none" stroke="currentColor" strokeWidth={0.4}
          style={{ color: "oklch(0.38 0.08 140)", opacity: 0.5, zIndex: 0 }}
          aria-hidden="true"
        >
          <g opacity="0.5">
            <ellipse cx="60"  cy="120" rx="8" ry="16" transform="rotate(25 60 120)"   />
            <ellipse cx="340" cy="200" rx="7" ry="14" transform="rotate(-35 340 200)" />
            <ellipse cx="80"  cy="400" rx="9" ry="17" transform="rotate(15 80 400)"   />
            <ellipse cx="320" cy="500" rx="6" ry="13" transform="rotate(-25 320 500)" />
            <ellipse cx="50"  cy="700" rx="7" ry="14" transform="rotate(35 50 700)"   />
          </g>
        </svg>

        <div className="relative flex-1 flex flex-col justify-center max-w-xl" style={{ zIndex: 2 }}>
          <span
            data-hero-left
            className="gr-mono mb-3 inline-block"
            style={{
              background: "oklch(0.83 0.17 89 / 0.18)",
              color: "oklch(0.84 0.14 82)",
              border: "1px solid oklch(0.83 0.17 89 / 0.40)",
              borderRadius: 9999,
              padding: "4px 14px",
              fontSize: 10,
              letterSpacing: "0.14em",
            }}
          >
            ✦ BOTANICAL PRECISION
          </span>

          <h1 data-hero-left
            style={{
              fontFamily:    "var(--font-cormorant), Georgia, serif",
              fontWeight:    500,
              fontSize:      "clamp(44px, 5.8vw, 88px)",
              lineHeight:    0.95,
              letterSpacing: "-0.025em",
              color:         "oklch(0.96 0.02 90)",
              margin:        "10px 0 16px",
            }}
          >
            Your herbal<br />
            <em style={{ color: "var(--cta)" }}>pantry,</em><br />
            delivered<br />
            <em style={{ color: "var(--cta)" }}>fresh.</em>
          </h1>

          <p data-hero-left style={{ fontSize: "clamp(13px, 1.1vw, 15px)", lineHeight: 1.6, color: "oklch(0.88 0.04 90)", maxWidth: 400, marginBottom: 12 }}>
            300+ herbs & remedies — curated by herbalists, delivered in 2 hours.
          </p>

          <div data-hero-left className="flex flex-wrap gap-3 items-center mb-4">
            <Link
              href="/medicines"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all hover:scale-[1.02]"
              style={{ background: "var(--cta)", color: "#fff", boxShadow: "0 8px 20px -8px rgba(255,111,60,0.55)" }}
            >
              Shop Remedies →
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all"
              style={{ border: "1.5px solid oklch(0.96 0.02 90 / 0.5)", color: "oklch(0.96 0.02 90)", background: "transparent" }}
            >
              Explore Botanical Guide
            </Link>
          </div>

          <div
            data-hero-left
            className="flex flex-wrap items-center gap-3 md:gap-5 pt-3"
            style={{ borderTop: "1px solid oklch(0.38 0.06 145)", maxWidth: 520 }}
          >
            {[
              { num: "340", sup: "+",  label: "herbs & roots"   },
              { num: "2",   sup: "hr", label: "to your door"    },
              { num: "4.9", sup: "★",  label: "customer rating" },
            ].map(({ num, sup, label }, i) => (
              <div key={num} className="flex items-center gap-4 md:gap-6">
                {i > 0 && (
                  <div className="w-px h-9 hidden sm:block shrink-0" style={{ background: "oklch(0.35 0.05 145)" }} />
                )}
                <div className="min-w-0">
                  <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(22px, 2.5vw, 32px)", lineHeight: 0.85, color: "oklch(0.96 0.02 90)", fontWeight: 500 }}>
                    {num}<sup style={{ fontSize: "0.35em", color: "oklch(0.84 0.17 89)", fontStyle: "italic" }}>{sup}</sup>
                  </div>
                  <div className="gr-mono mt-1" style={{ color: "oklch(0.78 0.04 90)" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <FernSVG
          className="absolute pointer-events-none animate-sway hidden md:block"
          style={{ right: -40, bottom: -80, width: 280, height: 700, color: "var(--moss-soft)", opacity: 0.35 }}
          aria-hidden="true"
        />
      </div>

      {/* RIGHT: specimen card stack — frosted glass over hero photo */}
      <div
        className="relative flex items-center justify-center overflow-hidden h-full"
        style={{
          background:     "oklch(0.92 0.03 88 / 0.55)",
          backdropFilter: "blur(12px)",
          padding:        "clamp(20px, 3vw, 44px) clamp(16px, 4vw, 48px)",
        }}
      >
        <div className="relative w-full max-w-sm">
          <div data-hero-card className="rotate-[-1.5deg]">
            <SpecimenCard
              number="№ 001" tag="Adaptogen"
              genus="Withania" species="somnifera"
              commonName="ASHWAGANDHA" partName="Root"
              price="৳480" rotate=""
            />
          </div>
          <div className="h-4" />
          <article
            data-hero-card
            className="rounded-2xl p-5 rotate-[1.8deg]"
            style={{
              background:  "var(--parchment)",
              border:      "1px solid var(--rule)",
              boxShadow:   "4px 4px 0 oklch(0.88 0.025 80)",
              marginLeft:  "clamp(16px, 5vw, 60px)",
            }}
          >
            <div className="flex justify-between items-baseline mb-3">
              <span className="gr-mono">Harvest № 004</span>
              <span className="gr-mono" style={{ color: "var(--clay)" }}>· Anti-inflammatory</span>
            </div>
            <div className="grid gap-4 items-center" style={{ gridTemplateColumns: "auto 1fr" }}>
              <JarSVG genus="Curcuma" species="longa" commonName="TURMERIC" className="w-20" style={{ color: "var(--ink)" }} />
              <div>
                <h3 className="text-xl leading-tight mb-0.5" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 500, color: "var(--ink)" }}>
                  Turmeric <em style={{ color: "var(--moss)", fontStyle: "italic" }}>Root</em>
                </h3>
                <p className="text-sm mb-2" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic", color: "var(--bark)" }}>
                  Curcuma longa
                </p>
                <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 20, fontWeight: 500, color: "var(--ink)" }}>
                  ৳120
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

// ── Slide 2: Herbalist quote ──────────────────────────────────────────────────
function SlideTwo() {
  return (
    <div className="w-screen h-full shrink-0 flex flex-col lg:grid" style={{ gridTemplateColumns: "1fr 1fr" }}>

      {/* LEFT: quote — semi-transparent over hero photo */}
      <div
        className="relative flex flex-col justify-center overflow-hidden h-full"
        style={{
          background:     "oklch(0.10 0.04 145 / 0.80)",
          backdropFilter: "blur(2px)",
          padding:        "clamp(32px, 5vw, 72px) clamp(24px, 5vw, 64px)",
        }}
      >
        <CornerVineSVG
          className="absolute pointer-events-none"
          style={{ top: 0, left: 0, width: 240, height: 240, color: "var(--moss-soft)", opacity: 0.45, zIndex: 1 }}
        />
        <FernSVG
          className="absolute pointer-events-none hidden md:block"
          style={{ right: -30, bottom: -60, width: 220, height: 560, color: "var(--moss-soft)", opacity: 0.3 }}
          aria-hidden="true"
        />

        <div className="relative" style={{ zIndex: 2 }}>
          <span className="gr-mono on-dark mb-6 block" style={{ letterSpacing: "0.18em" }}>❦ Herbalist&apos;s Note</span>

          {/* Big quotation mark */}
          <div
            style={{
              fontFamily:  "var(--font-cormorant), Georgia, serif",
              fontSize:    "clamp(80px, 10vw, 140px)",
              lineHeight:  0.7,
              color:       "oklch(0.84 0.06 35)",
              opacity:     0.55,
              marginBottom: -16,
            }}
            aria-hidden="true"
          >
            &ldquo;
          </div>

          <blockquote
            style={{
              fontFamily:    "var(--font-cormorant), Georgia, serif",
              fontStyle:     "italic",
              fontSize:      "clamp(22px, 3vw, 40px)",
              lineHeight:    1.25,
              color:         "oklch(0.95 0.02 90)",
              letterSpacing: "-0.01em",
              marginBottom:  28,
            }}
          >
            Our spring selection — small-batch harvested, ready for your home remedy shelf. Every jar tells the story of the soil it came from.
          </blockquote>

          <div style={{ borderTop: "1px solid oklch(0.30 0.05 145)", paddingTop: 20 }}>
            <p
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize:   18,
                color:      "oklch(0.84 0.17 89)",
                fontStyle:  "italic",
              }}
            >
              — R. Ahmed
            </p>
            <p className="gr-mono mt-1" style={{ color: "oklch(0.72 0.05 140)", letterSpacing: "0.12em" }}>
              Head Herbalist · GreenRoots Apothecary
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: credentials + jar */}
      <div
        className="relative flex flex-col items-center justify-center gap-6 overflow-hidden h-full"
        style={{
          background:     "oklch(0.92 0.03 88 / 0.55)",
          backdropFilter: "blur(12px)",
          padding:        "clamp(32px, 5vw, 64px) clamp(24px, 4vw, 56px)",
        }}
      >
        {/* Large decorative jar */}
        <div style={{ width: 160, color: "var(--ink)", opacity: 0.85 }}>
          <JarSVG genus="Withania" species="somnifera" commonName="ASHWAGANDHA" />
        </div>

        {/* Credential card — goldenrod light / dark olive dark */}
        <div
          className="w-full max-w-md rounded-2xl p-7 text-center relative
                     bg-[oklch(0.93_0.06_85)] dark:bg-[oklch(0.20_0.05_85)]
                     border border-[var(--clay)] border-l-4"
          style={{
            boxShadow: "4px 4px 0 oklch(0.78 0.08 75 / 0.5)",
            transform: "rotate(-1deg)",
          }}
        >
          {/* Paper clip */}
          <div
            className="absolute border-2 border-b-0 border-[var(--clay)] dark:border-[var(--clay-soft)]"
            style={{ top: -14, left: 30, width: 20, height: 28, borderRadius: "10px 10px 3px 3px" }}
          />

          <p className="gr-mono mb-3 text-[var(--clay)] dark:text-[var(--clay-soft)]"
             style={{ fontSize: 9, letterSpacing: "0.16em" }}>
            HERBALIST&apos;S PROFILE
          </p>

          {/* Avatar */}
          <div
            className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center
                       bg-[var(--moss-deep)] text-[var(--parchment)]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 24, fontWeight: 500 }}
          >
            RA
          </div>

          <h3
            className="text-[var(--ink)] dark:text-[oklch(0.93_0.04_85)]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 22, fontWeight: 500 }}
          >
            R. Ahmed
          </h3>
          <p
            className="mt-1 text-[var(--bark)] dark:text-[oklch(0.72_0.04_85)]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic", fontSize: 14 }}
          >
            Head Herbalist · 14 yrs experience
          </p>

          {/* Skill tags */}
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {["Ayurveda", "Ethnobotany", "Formulation"].map((tag) => (
              <span
                key={tag}
                className="gr-mono
                           bg-[oklch(0.80_0.08_75)] text-[oklch(0.22_0.04_80)]
                           dark:bg-[oklch(0.30_0.06_80)] dark:text-[oklch(0.90_0.04_85)]"
                style={{ borderRadius: 3, padding: "2px 7px", fontSize: 9, letterSpacing: "0.12em" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/about#herbalists"
          className="gr-mono transition-colors text-[var(--bark)] dark:text-[oklch(0.72_0.04_85)] hover:text-[var(--moss)]"
          style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}
        >
          Meet all our herbalists →
        </Link>
      </div>
    </div>
  )
}

// ── Main hero with slider ─────────────────────────────────────────────────────
export function SplitHero() {
  const [slide, setSlide] = useState(0)
  const TOTAL = 2

  // Auto-advance every 6 seconds
  useEffect(() => {
    const t = setTimeout(() => setSlide((s) => (s + 1) % TOTAL), 6000)
    return () => clearTimeout(t)
  }, [slide])

  return (
    <section
      className="relative border-b overflow-hidden"
      style={{ borderColor: "var(--rule)", zIndex: 2, height: "70svh", minHeight: 520 }}
    >
      {/* ── Full-width hero background image ──────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/markus-spiske-6hDDnisCRMk-unsplash.jpg"
          alt=""
          fill
          priority
          quality={85}
          className="object-cover object-center"
          aria-hidden="true"
        />
        {/* Dark vignette so text is always legible */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, oklch(0.10 0.04 145 / 0.82) 0%, oklch(0.10 0.04 145 / 0.55) 50%, oklch(0.12 0.02 90 / 0.40) 100%)" }}
        />
      </div>

      {/* Sliding track — suppressHydrationWarning because transform is state-driven */}
      <div
        suppressHydrationWarning
        className="relative flex h-full w-full"
        style={{
          transform:  `translateX(-${slide * 100}%)`,
          transition: "transform 0.7s cubic-bezier(0.77, 0, 0.18, 1)",
          zIndex: 1,
        }}
      >
        <SlideOne />
        <SlideTwo />
      </div>

      {/* ── Nav dots ─────────────────────────────────────────── */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-30"
        role="tablist"
        aria-label="Hero slides"
      >
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={slide === i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setSlide(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width:      slide === i ? 24 : 8,
              height:     8,
              background: slide === i ? "var(--parchment)" : "oklch(0.75 0.04 90 / 0.5)",
              border:     "none",
              cursor:     "pointer",
              padding:    0,
            }}
          />
        ))}
      </div>

      {/* ── Prev / Next arrows ───────────────────────────────── */}
      <button
        onClick={() => setSlide((s) => (s - 1 + TOTAL) % TOTAL)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 36, height: 36, background: "oklch(1 0 0 / 0.1)", border: "1px solid oklch(1 0 0 / 0.25)", color: "var(--parchment)", backdropFilter: "blur(4px)" }}
      >
        ‹
      </button>
      <button
        onClick={() => setSlide((s) => (s + 1) % TOTAL)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 36, height: 36, background: "oklch(1 0 0 / 0.1)", border: "1px solid oklch(1 0 0 / 0.25)", color: "var(--parchment)", backdropFilter: "blur(4px)" }}
      >
        ›
      </button>
    </section>
  )
}
