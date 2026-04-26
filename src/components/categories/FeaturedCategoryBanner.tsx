import Link from "next/link"
import { JarSVG } from "@/components/icons/botanical/JarSVG"

const FeaturedCategoryBanner = () => {
  return (
    <section
      className="border-b"
      style={{ borderColor: "var(--rule)", padding: "0 0 clamp(60px, 8vw, 110px)" }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10">
        <div
          className="relative overflow-hidden flex flex-col md:grid"
          style={{
            borderRadius: "16px",
            border:       "1px solid var(--card-border-color)",
            boxShadow:    "var(--card-box-shadow)",
            gridTemplateColumns: "1fr 1.65fr",
          }}
        >
          {/* ── Left: dark jar panel ── */}
          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{
              background: "var(--moss-deep)",
              padding:    "52px 32px",
              minHeight:  300,
            }}
          >
            {/* Dot texture */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, oklch(0.44 0.07 145 / 0.28) 1px, transparent 1px)",
                backgroundSize:  "22px 22px",
                opacity:         0.4,
              }}
            />
            {/* Ambient blob */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: -40, left: -40, width: 240, height: 240,
                borderRadius: "50%",
                background: "radial-gradient(ellipse, oklch(0.28 0.08 140 / 0.45) 0%, transparent 70%)",
              }}
            />

            {/* Inner ruled border */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: 8, borderRadius: 8,
                border: "1px solid oklch(0.32 0.05 145 / 0.25)",
              }}
            />

            {/* Harvest label */}
            <div
              className="absolute z-10"
              style={{ top: 18, left: 18 }}
            >
              <span
                className="gr-mono"
                style={{ color: "oklch(0.72 0.09 82)", fontSize: 9, letterSpacing: "0.14em" }}
              >
                HARVEST № 001
              </span>
            </div>

            <div
              className="relative z-10"
              style={{ width: 140, color: "oklch(0.78 0.06 140)" }}
            >
              <JarSVG genus="Withania" species="somnifera" commonName="ASHWAGANDHA" />
            </div>
          </div>

          {/* ── Right: text panel ── */}
          <div
            className="flex flex-col justify-center"
            style={{
              background: "var(--card-surface)",
              padding:    "clamp(28px, 5vw, 52px) clamp(20px, 4vw, 56px)",
            }}
          >
            <span
              className="gr-mono mb-3"
              style={{ color: "var(--clay)", fontSize: 10, letterSpacing: "0.18em" }}
            >
              ☘ SEASONAL FEATURE
            </span>

            <h3
              className="mb-4"
              style={{
                fontFamily:    "var(--font-cormorant), Georgia, serif",
                fontWeight:    500,
                fontSize:      "clamp(30px, 3.5vw, 52px)",
                lineHeight:    1,
                letterSpacing: "-0.02em",
                color:         "var(--card-name-primary)",
              }}
            >
              The{" "}
              <em style={{ color: "var(--moss)", fontStyle: "italic" }}>Adaptogen</em>{" "}
              Collection
            </h3>

            <p
              className="mb-8"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontStyle:  "italic",
                fontSize:   18,
                lineHeight: 1.65,
                color:      "var(--card-subtitle)",
                maxWidth:   400,
              }}
            >
              Ashwagandha, Rhodiola &amp; Eleuthero — wild-craft harvested roots
              to balance stress, sharpen focus and restore vitality. Curated by
              our head herbalist.
            </p>

            {/* Stats row */}
            <div
              className="flex flex-wrap items-center gap-4 mb-8"
              style={{
                paddingBottom: 24,
                borderBottom:  "1px solid var(--card-divider)",
              }}
            >
              {[
                { n: "4",      label: "remedies" },
                { n: "100%",   label: "wild-craft" },
                { n: "₹480",   label: "from" },
              ].map(({ n, label }, idx) => (
                <div key={label} className="flex items-center gap-8">
                  {idx > 0 && (
                    <div style={{ width: 1, height: 28, background: "var(--card-divider)" }} />
                  )}
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-cormorant), Georgia, serif",
                        fontSize:   22,
                        fontWeight: 500,
                        color:      "var(--card-name-primary)",
                        lineHeight: 1,
                      }}
                    >
                      {n}
                    </div>
                    <div
                      className="gr-mono mt-0.5"
                      style={{ color: "var(--card-listing-label)", fontSize: 9 }}
                    >
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/categories/adaptogens"
                className="inline-flex items-center gap-3 rounded-full transition-colors"
                style={{
                  background:    "var(--moss-deep)",
                  color:         "var(--parchment)",
                  fontFamily:    "var(--font-cormorant), Georgia, serif",
                  fontStyle:     "italic",
                  fontSize:      16,
                  padding:       "12px 28px",
                }}
              >
                Explore Adaptogens →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCategoryBanner
