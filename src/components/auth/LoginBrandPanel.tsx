import { JarSVG, CornerVineSVG } from "@/components/icons/botanical"

export default function LoginBrandPanel() {
  return (
    <div
      className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "var(--moss-deep)",
        padding:    "80px 56px",
      }}
    >
      {/* ── Dot texture overlay ─────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, oklch(0.44 0.07 145 / 0.20) 1px, transparent 1px)",
          backgroundSize:  "22px 22px",
          opacity:         0.40,
        }}
      />

      {/* ── Corner vine — top right ─────────────────────────── */}
      <CornerVineSVG
        className="absolute pointer-events-none"
        style={{
          top: -20, right: -20,
          width: 220, height: 220,
          color:   "var(--moss-soft)",
          opacity: 0.28,
          zIndex:  0,
        }}
        aria-hidden="true"
      />

      {/* ── Ambient blob ────────────────────────────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -100, left: -140,
          width: 480, height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, oklch(0.28 0.08 140 / 0.35) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* ── Content ─────────────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center text-center"
        style={{ zIndex: 1, maxWidth: 340 }}
      >
        {/* Chapter label */}
        <span
          style={{
            fontFamily:    "var(--font-dm-mono, 'DM Mono'), monospace",
            fontSize:      10,
            letterSpacing: "0.18em",
            color:         "var(--clay-soft)",
            marginBottom:  28,
            textTransform: "uppercase",
          }}
        >
          ☘ &nbsp; The Herb Collection
        </span>

        {/* Jar illustration */}
        <JarSVG
          genus="Withania"
          species="somnifera"
          commonName="ASHWAGANDHA"
          style={{
            width:  130,
            height: 167,
            color:  "oklch(0.78 0.06 140)",
            filter: "drop-shadow(0 12px 28px oklch(0.10 0.05 145 / 0.55))",
            marginBottom: 32,
          }}
        />

        {/* Heading */}
        <h2
          style={{
            fontFamily:    "var(--font-cormorant), Georgia, serif",
            fontWeight:    500,
            fontSize:      "clamp(38px, 4vw, 52px)",
            lineHeight:    1.0,
            letterSpacing: "-0.02em",
            color:         "var(--parchment)",
            marginBottom:  16,
          }}
        >
          Your herbal{" "}
          <em style={{ color: "var(--clay-soft)", fontStyle: "italic" }}>pantry,</em>
          <br />delivered.
        </h2>

        {/* Sub */}
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontStyle:  "italic",
            fontSize:   17,
            lineHeight: 1.65,
            color:      "oklch(0.72 0.04 90)",
            marginBottom: 32,
          }}
        >
          Wild-crafted herbs, herbalist-curated blends &amp; botanical remedies
          — delivered to your door.
        </p>

        {/* Trust items */}
        <div
          className="flex flex-col gap-2.5 w-full mb-9"
          style={{ textAlign: "left" }}
        >
          {[
            "Wild-craft sourced, small-batch herbs",
            "Herbalist-curated every collection",
            "Free shipping on orders over ৳500",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontStyle:  "italic",
                fontSize:   15,
                color:      "oklch(0.82 0.04 90)",
              }}
            >
              <span style={{ color: "var(--clay)", fontSize: 14, flexShrink: 0 }}>✦</span>
              {item}
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div
          className="grid grid-cols-3 w-full"
          style={{
            borderTop:    "1px solid oklch(0.30 0.05 145)",
            paddingTop:   20,
            gap:          0,
          }}
        >
          {[
            { value: "340+", label: "Herbs" },
            { value: "4.9★", label: "Rating" },
            { value: "Free", label: "Returns" },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              className="flex flex-col items-center"
              style={{
                borderRight: i < 2 ? "1px solid oklch(0.30 0.05 145)" : "none",
                padding:     "0 12px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontWeight: 600,
                  fontSize:   22,
                  color:      "var(--parchment)",
                  lineHeight: 1,
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontFamily:    "var(--font-dm-mono, 'DM Mono'), monospace",
                  fontSize:      9,
                  letterSpacing: "0.12em",
                  color:         "oklch(0.55 0.04 140)",
                  marginTop:     4,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
