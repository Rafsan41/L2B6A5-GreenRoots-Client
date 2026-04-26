"use client"

import { CornerVineSVG } from "@/components/icons/botanical"

interface CategoryHeroProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  categoryCount?: number
}

const CategoryHero = ({
  searchQuery,
  onSearchChange,
  categoryCount = 6,
}: CategoryHeroProps) => {
  return (
    <section
      className="relative overflow-hidden border-b"
      style={{
        background:  "var(--moss-deep)",
        borderColor: "var(--rule)",
        padding:     "clamp(48px, 8vw, 88px) 0 clamp(48px, 8vw, 96px)",
        position:    "relative",
        zIndex:      2,
      }}
    >
      {/* Corner vine — top right */}
      <CornerVineSVG
        className="absolute pointer-events-none"
        style={{
          top: 0, right: 0,
          width: 260, height: 260,
          color:   "var(--moss-soft)",
          opacity: 0.38,
          transform: "scaleX(-1)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Ambient blob — bottom left */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -80, left: -120,
          width: 520, height: 420,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, oklch(0.28 0.08 140 / 0.30) 0%, transparent 70%)",
        }}
      />

      {/* Scattered leaf outlines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 320"
        fill="none"
        stroke="currentColor"
        strokeWidth={0.4}
        style={{ color: "oklch(0.38 0.08 140)", opacity: 0.28 }}
        aria-hidden="true"
      >
        <ellipse cx="110"  cy="55"  rx="7"  ry="14" transform="rotate(25 110 55)"   />
        <ellipse cx="1330" cy="75"  rx="6"  ry="12" transform="rotate(-35 1330 75)" />
        <ellipse cx="200"  cy="240" rx="8"  ry="15" transform="rotate(15 200 240)"  />
        <ellipse cx="1180" cy="210" rx="7"  ry="13" transform="rotate(-25 1180 210)"/>
        <ellipse cx="680"  cy="35"  rx="5"  ry="11" transform="rotate(40 680 35)"   />
        <ellipse cx="420"  cy="280" rx="6"  ry="12" transform="rotate(-20 420 280)" />
      </svg>

      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10 relative z-10">
        <div
          className="flex flex-col items-center text-center"
          style={{ maxWidth: 680, margin: "0 auto", gap: 28 }}
        >
          {/* Chapter label */}
          <span
            className="gr-mono"
            style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--clay-soft)" }}
          >
            ❦ Chapter III · The Collection
          </span>

          {/* Heading */}
          <h1
            style={{
              fontFamily:    "var(--font-cormorant), Georgia, serif",
              fontWeight:    500,
              fontSize:      "clamp(52px, 7vw, 96px)",
              lineHeight:    0.95,
              letterSpacing: "-0.025em",
              color:         "var(--parchment)",
            }}
          >
            Browse by{" "}
            <em style={{ color: "var(--clay-soft)", fontStyle: "italic" }}>
              category.
            </em>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle:  "italic",
              fontSize:   "clamp(16px, 1.8vw, 20px)",
              lineHeight: 1.65,
              color:      "oklch(0.78 0.04 90)",
              maxWidth:   520,
            }}
          >
            Six chapters of nature's remedies — from root adaptogens to
            sleep herbs. Find what your body needs.
          </p>

          {/* Botanical search bar */}
          <div className="relative w-full" style={{ maxWidth: 480 }}>
            <span
              className="gr-mono absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "oklch(0.55 0.06 140)", fontSize: 9 }}
            >
              SEARCH
            </span>
            <input
              type="text"
              placeholder="e.g. adaptogens, skin care, sleep…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width:        "100%",
                background:   "oklch(0.18 0.04 145 / 0.60)",
                border:       "1px solid oklch(0.35 0.06 145 / 0.70)",
                borderRadius: "100px",
                padding:      "14px 24px 14px 72px",
                color:        "var(--parchment)",
                fontFamily:   "var(--font-cormorant), Georgia, serif",
                fontStyle:    "italic",
                fontSize:     17,
                outline:      "none",
              }}
            />
          </div>

          {/* Stats strip */}
          <div
            className="flex items-center pt-6"
            style={{
              borderTop: "1px solid oklch(0.30 0.05 145)",
              gap:       32,
            }}
          >
            {/* Collections */}
            <div className="text-center">
              <div
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize:   40,
                  fontWeight: 500,
                  lineHeight: 0.9,
                  color:      "var(--parchment)",
                }}
              >
                {categoryCount}
              </div>
              <div
                className="gr-mono mt-1.5"
                style={{ color: "oklch(0.58 0.04 90)", fontSize: 9 }}
              >
                collections
              </div>
            </div>

            <div style={{ width: 1, height: 40, background: "oklch(0.35 0.05 145)" }} />

            {/* Herbs */}
            <div className="text-center">
              <div
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize:   40,
                  fontWeight: 500,
                  lineHeight: 0.9,
                  color:      "var(--parchment)",
                }}
              >
                300
                <sup style={{ fontSize: "0.34em", color: "var(--clay)", fontStyle: "italic" }}>+</sup>
              </div>
              <div
                className="gr-mono mt-1.5"
                style={{ color: "oklch(0.58 0.04 90)", fontSize: 9 }}
              >
                herbs &amp; roots
              </div>
            </div>

            <div style={{ width: 1, height: 40, background: "oklch(0.35 0.05 145)" }} />

            {/* Delivery */}
            <div className="text-center">
              <div
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize:   40,
                  fontWeight: 500,
                  lineHeight: 0.9,
                  color:      "var(--parchment)",
                }}
              >
                2
                <sup style={{ fontSize: "0.34em", color: "var(--clay)", fontStyle: "italic" }}>hr</sup>
              </div>
              <div
                className="gr-mono mt-1.5"
                style={{ color: "oklch(0.58 0.04 90)", fontSize: 9 }}
              >
                to your door
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategoryHero
