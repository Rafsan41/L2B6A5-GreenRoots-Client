import Link from "next/link"
import { CornerVineSVG } from "@/components/icons/botanical"

const CategoryCTA = () => {
  return (
    <section
      className="relative overflow-hidden border-b"
      style={{
        background:  "var(--moss-deep)",
        borderColor: "var(--rule)",
        padding:     "clamp(60px, 8vw, 110px) 0",
        position:    "relative",
        zIndex:      2,
      }}
    >
      {/* Corner vine — bottom right */}
      <CornerVineSVG
        className="absolute pointer-events-none"
        style={{
          bottom: -20, right: -20,
          width:   260, height: 260,
          color:   "var(--moss-soft)",
          opacity: 0.30,
          transform: "rotate(180deg) scaleX(-1)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Dot texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, oklch(0.44 0.07 145 / 0.22) 1px, transparent 1px)",
          backgroundSize:  "22px 22px",
          opacity:         0.40,
        }}
      />

      {/* Ambient blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -100, left: -160,
          width: 560, height: 460,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, oklch(0.28 0.08 140 / 0.38) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10 relative z-10">
        <div
          className="flex flex-col items-center text-center"
          style={{ maxWidth: 700, margin: "0 auto" }}
        >
          <span
            className="gr-mono mb-7"
            style={{ color: "var(--clay-soft)", fontSize: 11, letterSpacing: "0.16em" }}
          >
            ☘ ☘ ☘ &nbsp; Ready to begin?
          </span>

          <h2
            className="mb-8"
            style={{
              fontFamily:    "var(--font-cormorant), Georgia, serif",
              fontWeight:    500,
              fontSize:      "clamp(52px, 7vw, 96px)",
              lineHeight:    0.95,
              letterSpacing: "-0.025em",
              color:         "var(--parchment)",
            }}
          >
            Fill your herb{" "}
            <em style={{ color: "var(--clay-soft)", fontStyle: "italic" }}>shelf.</em>
          </h2>

          <p
            className="mb-10"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle:  "italic",
              fontSize:   "clamp(17px, 1.8vw, 21px)",
              lineHeight: 1.65,
              color:      "oklch(0.78 0.04 90)",
              maxWidth:   520,
            }}
          >
            Pick a collection above or browse every herb in our full catalogue.
            Cash on delivery, free shipping over ৳500.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 items-center justify-center mb-12">
            <Link
              href="/medicines"
              className="inline-flex items-center gap-3 rounded-full transition-colors"
              style={{
                background: "var(--parchment)",
                color:      "var(--moss-deep)",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontStyle:  "italic",
                fontSize:   17,
                padding:    "14px 28px",
              }}
            >
              Explore the herb guide →
            </Link>
            <Link
              href="/register"
              style={{
                padding:    "14px 16px",
                background: "transparent",
                border:     "none",
                color:      "oklch(0.85 0.04 90)",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontStyle:  "italic",
                fontSize:   17,
              }}
            >
              <span style={{ borderBottom: "1px solid currentColor", paddingBottom: 2 }}>
                Create a free account
              </span>
            </Link>
          </div>

          {/* Trust items */}
          <div
            className="flex flex-wrap justify-center gap-6 pt-8"
            style={{ borderTop: "1px solid oklch(0.30 0.05 145)" }}
          >
            {[
              "Herbalist-curated inventory",
              "Cash on delivery nationwide",
              "Free returns within 7 days",
            ].map((item) => (
              <div
                key={item}
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontStyle:  "italic",
                  fontSize:   17,
                  color:      "oklch(0.85 0.04 90)",
                }}
              >
                <span style={{ color: "var(--clay)", marginRight: 8 }}>✦</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategoryCTA
