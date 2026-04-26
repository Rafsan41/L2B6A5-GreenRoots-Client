import { SideVineSVG } from "@/components/icons/botanical"

const FEATURES = [
  {
    num:   "I",
    title: "Wild-craft",
    em:    "Sourced",
    desc:  "Every herb is hand-harvested from certified organic farms and single-origin suppliers across South Asia.",
    note:  "Farm to shelf",
  },
  {
    num:   "II",
    title: "Herbalist",
    em:    "Curated",
    desc:  "Our in-house herbalists verify every batch for potency, purity and botanical authenticity before listing.",
    note:  "Quality checked",
  },
  {
    num:   "III",
    title: "Delivered",
    em:    "in 2 hours",
    desc:  "From our Dhaka store to your doorstep within two hours of placing your order. Cash on delivery always.",
    note:  "Same-day Dhaka",
  },
  {
    num:   "IV",
    title: "Free",
    em:    "Returns",
    desc:  "Seven-day hassle-free returns on all orders. No questions asked — your satisfaction is our promise.",
    note:  "7-day guarantee",
  },
]

const WhyChooseUs = () => {
  return (
    <section
      className="relative overflow-hidden border-b"
      style={{
        padding:     "clamp(60px, 8vw, 110px) 0",
        borderColor: "var(--rule)",
        position:    "relative",
        zIndex:      2,
      }}
    >
      {/* Side vine decoration */}
      <SideVineSVG
        className="absolute pointer-events-none"
        style={{
          top: 40, left: -50,
          width: 280, height: 420,
          color:   "var(--moss-mid)",
          opacity: 0.38,
        }}
        aria-hidden="true"
      />

      {/* Ambient blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -80, right: -120,
          width: 500, height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, oklch(0.38 0.08 140 / 0.10) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10 relative z-10">

        {/* ── Section header ── */}
        <div
          className="flex flex-col gap-8 md:grid md:gap-16 items-end mb-10 md:mb-20"
          style={{ gridTemplateColumns: "1.2fr 1fr" }}
        >
          <div>
            <span className="gr-index">❦ Our Promise</span>
            <h2
              style={{
                fontFamily:    "var(--font-cormorant), Georgia, serif",
                fontWeight:    500,
                fontSize:      "clamp(44px, 5.5vw, 80px)",
                lineHeight:    1,
                letterSpacing: "-0.02em",
                color:         "var(--ink)",
              }}
            >
              Rooted in{" "}
              <em style={{ color: "var(--moss)", fontStyle: "italic" }}>trust,</em>
              <br />
              grown with{" "}
              <em style={{ color: "var(--moss)", fontStyle: "italic" }}>care.</em>
            </h2>
          </div>
          <p
            style={{
              fontFamily:    "var(--font-cormorant), Georgia, serif",
              fontStyle:     "italic",
              fontSize:      20,
              lineHeight:    1.6,
              color:         "var(--bark)",
              maxWidth:      420,
              paddingLeft:   20,
              borderLeft:    "2px solid var(--clay)",
              paddingBottom: 12,
            }}
          >
            From the farm to your shelf — every step of the GreenRoots journey
            is guided by herbalists, not algorithms.
          </p>
        </div>

        {/* ── 4-col feature grid ── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.num} className="flex flex-col gap-4">
              {/* Roman numeral */}
              <div
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontStyle:  "italic",
                  fontSize:   64,
                  lineHeight: 0.82,
                  color:      "var(--sage)",
                  fontWeight: 500,
                }}
              >
                {f.num}
              </div>

              {/* Short rule */}
              <div style={{ height: 1, background: "var(--rule)", maxWidth: 44 }} />

              {/* Feature title */}
              <h3
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontWeight: 500,
                  fontSize:   28,
                  color:      "var(--ink)",
                  lineHeight: 1.1,
                }}
              >
                {f.title}{" "}
                <em style={{ color: "var(--moss)", fontStyle: "italic" }}>{f.em}</em>
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontStyle:  "italic",
                  fontSize:   16,
                  lineHeight: 1.7,
                  color:      "var(--bark)",
                  flexGrow:   1,
                }}
              >
                {f.desc}
              </p>

              {/* Note tag */}
              <span
                className="gr-mono"
                style={{ color: "var(--clay)", fontSize: 9 }}
              >
                ✦ {f.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
