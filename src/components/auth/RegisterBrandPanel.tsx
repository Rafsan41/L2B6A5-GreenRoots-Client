import { JarSVG, CornerVineSVG } from "@/components/icons/botanical"

export default function RegisterBrandPanel() {
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

      {/* ── Corner vine — bottom left ───────────────────────── */}
      <CornerVineSVG
        className="absolute pointer-events-none"
        style={{
          bottom: -20, left: -20,
          width:   220, height: 220,
          color:   "var(--moss-soft)",
          opacity: 0.28,
          transform: "rotate(180deg) scaleX(-1)",
          zIndex:  0,
        }}
        aria-hidden="true"
      />

      {/* ── Ambient blob ────────────────────────────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -100, right: -140,
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
          ☘ &nbsp; Begin Your Journey
        </span>

        {/* Jar illustration */}
        <JarSVG
          genus="Curcuma"
          species="longa"
          commonName="TURMERIC"
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
          Join the{" "}
          <em style={{ color: "var(--clay-soft)", fontStyle: "italic" }}>community.</em>
        </h2>

        {/* Sub */}
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontStyle:  "italic",
            fontSize:   17,
            lineHeight: 1.65,
            color:      "oklch(0.72 0.04 90)",
            marginBottom: 28,
          }}
        >
          Thousands of herb enthusiasts trust GreenRoots for their
          botanical wellness journey.
        </p>

        {/* Benefits */}
        <div
          className="flex flex-col gap-2.5 w-full mb-7"
          style={{ textAlign: "left" }}
        >
          {[
            "Access 340+ herbalist-curated remedies",
            "Track orders &amp; save your favourites",
            "Cash on delivery, free returns in 7 days",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontStyle:  "italic",
                fontSize:   15,
                color:      "oklch(0.82 0.04 90)",
              }}
            >
              <span style={{ color: "var(--clay)", fontSize: 14, flexShrink: 0, marginTop: 1 }}>✦</span>
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </div>
          ))}
        </div>

        {/* Seller callout box */}
        <div
          className="w-full"
          style={{
            border:       "1px solid oklch(0.30 0.05 145)",
            borderRadius: 10,
            padding:      "16px 18px",
            background:   "oklch(0.18 0.04 145 / 0.50)",
            textAlign:    "left",
          }}
        >
          <p
            style={{
              fontFamily:    "var(--font-dm-mono, 'DM Mono'), monospace",
              fontSize:      9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color:         "oklch(0.55 0.04 140)",
              marginBottom:  10,
            }}
          >
            ❧ &nbsp; Herb grower or seller?
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle:  "italic",
              fontSize:   15,
              lineHeight: 1.55,
              color:      "oklch(0.78 0.04 90)",
            }}
          >
            List your herbs and reach thousands of wellness seekers.
            Select{" "}
            <strong style={{ fontStyle: "normal", color: "var(--parchment)", fontWeight: 500 }}>
              Seller / Grower
            </strong>{" "}
            when registering.
          </p>
        </div>
      </div>
    </div>
  )
}
