import Link from "next/link";
import { FernSVG, CornerVineSVG, JarSVG } from "@/components/icons/botanical";

/** Rotated specimen card with jar illustration */
function SpecimenCard({
  number,
  tag,
  genus,
  species,
  commonName,
  partName,
  price,
  rotate,
  marginLeft,
}: {
  number: string;
  tag: string;
  genus: string;
  species: string;
  commonName: string;
  partName: string;
  price: string;
  rotate: string;
  marginLeft?: string;
}) {
  return (
    <article
      className="relative p-5 rounded-2xl transition-all duration-300"
      style={{
        background: "var(--parchment)",
        border: "1px solid var(--rule)",
        boxShadow: "4px 4px 0 oklch(0.88 0.025 80)",
        transform: rotate,
        marginLeft,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-baseline gap-2 mb-4">
        <span className="gr-mono" style={{ color: "var(--bark)" }}>
          Harvest {number}
        </span>
        <span className="gr-mono" style={{ color: "var(--clay)" }}>
          · {tag}
        </span>
      </div>

      {/* Jar illustration */}
      <JarSVG
        genus={genus}
        species={species}
        commonName={commonName}
        className="w-32 mx-auto mb-4"
        style={{ color: "var(--ink)" }}
      />

      {/* Info */}
      <h3
        className="text-2xl leading-tight mb-1"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontWeight: 500,
          color: "var(--ink)",
        }}
      >
        {commonName.charAt(0) + commonName.slice(1).toLowerCase()}{" "}
        <em style={{ color: "var(--moss)", fontStyle: "italic" }}>{partName}</em>
      </h3>
      <p
        className="text-sm mb-2"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontStyle: "italic",
          color: "var(--bark)",
        }}
      >
        {genus} {species}
      </p>
      <div className="flex items-baseline gap-2">
        <span
          className="text-xl"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontWeight: 500,
            color: "var(--ink)",
          }}
        >
          {price}
        </span>
        <span className="gr-mono">· 60 caps</span>
      </div>

      {/* "Fresh harvest" seal */}
      <div
        className="absolute -top-4 -right-4 w-14 h-14 rounded-full flex items-center justify-center text-center leading-tight"
        style={{
          border: "1px solid var(--rust)",
          background: "var(--parchment)",
          color: "var(--rust)",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 8,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          transform: "rotate(12deg)",
        }}
      >
        Fresh<br />Harvest
      </div>
    </article>
  );
}

/** Handwritten paper-clip note */
function PaperClipNote() {
  return (
    <div
      className="relative ml-4 mr-6 md:ml-6 md:mr-10 rounded-lg"
      style={{
        background: "oklch(0.92 0.06 85)",
        border: "1px solid var(--clay)",
        borderLeft: "4px solid var(--clay)",
        padding: "18px 22px 20px",
        transform: "rotate(-1deg)",
      }}
    >
      {/* Clip */}
      <div
        className="absolute"
        style={{
          top: -14,
          left: 30,
          width: 20,
          height: 28,
          border: "2px solid var(--bark-2)",
          borderRadius: "10px 10px 3px 3px",
          borderBottom: 0,
        }}
      />
      <p className="text-xs gr-mono mb-1">Herbalist&apos;s note</p>
      <p
        className="text-lg leading-snug my-2"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontStyle: "italic",
          color: "var(--ink)",
        }}
      >
        &ldquo;Our spring selection — small-batch harvested, ready for your
        home remedy shelf.&rdquo;
      </p>
      <p className="gr-mono" style={{ color: "var(--bark)" }}>
        — R. Ahmed, head herbalist
      </p>
    </div>
  );
}

export function SplitHero() {
  return (
    <section
      className="flex flex-col lg:grid border-b overflow-hidden"
      style={{
        gridTemplateColumns: "1.15fr 1fr",
        borderColor: "var(--rule)",
        position: "relative",
        zIndex: 2,
        minHeight: "100svh",
      }}
    >
      {/* ── LEFT: dark moss panel ───────────────────────────── */}
      <div
        className="flex flex-col relative overflow-hidden"
        style={{
          background: "var(--moss-deep)",
          color: "var(--parchment)",
          padding: "clamp(24px, 4vw, 56px) clamp(20px, 5vw, 56px) clamp(32px, 4vw, 56px)",
        }}
      >
        {/* Corner vine decoration */}
        <CornerVineSVG
          className="absolute pointer-events-none"
          style={{
            top: 0,
            left: 0,
            width: 280,
            height: 280,
            color: "var(--moss-soft)",
            opacity: 0.55,
            zIndex: 3,
          }}
        />

        {/* Subtle leaf dot pattern */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 400 800"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.4}
          style={{ color: "oklch(0.38 0.08 140)", opacity: 0.5, zIndex: 0 }}
          aria-hidden="true"
        >
          <g opacity="0.5">
            <ellipse cx="60" cy="120" rx="8" ry="16" transform="rotate(25 60 120)" />
            <ellipse cx="340" cy="200" rx="7" ry="14" transform="rotate(-35 340 200)" />
            <ellipse cx="80" cy="400" rx="9" ry="17" transform="rotate(15 80 400)" />
            <ellipse cx="320" cy="500" rx="6" ry="13" transform="rotate(-25 320 500)" />
            <ellipse cx="50" cy="700" rx="7" ry="14" transform="rotate(35 50 700)" />
          </g>
        </svg>

        {/* Hero body */}
        <div
          className="relative flex-1 flex flex-col justify-center max-w-xl"
          style={{ paddingTop: "clamp(40px, 6vw, 60px)", zIndex: 2 }}
        >
          <span className="gr-mono on-dark mb-3">❦ Vol. I · The Herb Guide</span>

          <h1
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 500,
              fontSize: "clamp(48px, 7.5vw, 104px)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: "var(--parchment)",
              margin: "24px 0 32px",
            }}
          >
            Your herbal<br />
            <em style={{ color: "var(--clay-soft)" }}>pantry,</em><br />
            delivered<br />
            <em style={{ color: "var(--clay-soft)" }}>fresh.</em>
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 2vw, 17px)",
              lineHeight: 1.65,
              color: "oklch(0.85 0.04 90)",
              maxWidth: 460,
              marginBottom: 36,
            }}
          >
            Three hundred herbs, roots and organic remedies — curated by
            herbalists, sourced from local farms and delivered from our Dhaka
            store within two hours of ordering.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 items-center mb-10 md:mb-14">
            <Link
              href="/medicines"
              className="inline-flex items-center gap-3 rounded-full px-6 md:px-7 py-3 md:py-4 text-sm font-medium transition-colors"
              style={{
                background: "var(--parchment)",
                color: "var(--moss-deep)",
              }}
            >
              Explore the herb guide <span>→</span>
            </Link>
            <Link
              href="/about"
              className="px-4 py-3 md:py-4 text-sm font-medium"
              style={{ background: "transparent", border: 0, color: "oklch(0.85 0.04 90)" }}
            >
              <span style={{ borderBottom: "1px solid currentColor", paddingBottom: 2 }}>
                Meet our herbalists
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap items-center gap-4 md:gap-6 pt-7"
            style={{
              borderTop: "1px solid oklch(0.30 0.05 145)",
              maxWidth: 520,
            }}
          >
            {[
              { num: "340", sup: "+", label: "herbs & roots" },
              { num: "2", sup: "hr", label: "to your door" },
              { num: "4.9", sup: "★", label: "customer rating" },
            ].map(({ num, sup, label }, i) => (
              <>
                {i > 0 && (
                  <div
                    key={`sep-${i}`}
                    className="w-px h-11 hidden sm:block"
                    style={{ background: "oklch(0.35 0.05 145)" }}
                  />
                )}
                <div key={num} className="min-w-0">
                  <div
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontSize: "clamp(36px, 5vw, 48px)",
                      lineHeight: 0.85,
                      color: "var(--parchment)",
                      fontWeight: 500,
                    }}
                  >
                    {num}
                    <sup style={{ fontSize: "0.35em", color: "var(--clay)", fontStyle: "italic" }}>
                      {sup}
                    </sup>
                  </div>
                  <div
                    className="gr-mono mt-1.5"
                    style={{ color: "oklch(0.75 0.04 90)" }}
                  >
                    {label}
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>

        {/* Decorative fern — bottom right */}
        <FernSVG
          className="absolute pointer-events-none animate-sway hidden md:block"
          style={{
            right: -40,
            bottom: -80,
            width: 280,
            height: 700,
            color: "var(--moss-soft)",
            opacity: 0.35,
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── RIGHT: parchment panel with specimen stack ─────── */}
      <div
        className="relative flex items-center justify-center py-12 lg:py-0"
        style={{
          background: "var(--cream)",
          padding: "clamp(32px, 5vw, 56px) clamp(16px, 4vw, 48px)",
        }}
      >
        <div className="relative w-full max-w-md">
          {/* Specimen card 1 */}
          <SpecimenCard
            number="№ 001"
            tag="Adaptogen"
            genus="Withania"
            species="somnifera"
            commonName="ASHWAGANDHA"
            partName="Root"
            price="৳480"
            rotate="rotate(-1.5deg)"
          />

          {/* Spacer */}
          <div className="h-6 md:h-8" />

          {/* Specimen card 2 (offset) */}
          <article
            className="rounded-2xl p-5"
            style={{
              background: "var(--parchment)",
              border: "1px solid var(--rule)",
              boxShadow: "4px 4px 0 oklch(0.88 0.025 80)",
              transform: "rotate(1.8deg)",
              marginLeft: "clamp(16px, 5vw, 60px)",
            }}
          >
            <div className="flex justify-between items-baseline mb-3">
              <span className="gr-mono">Harvest № 004</span>
              <span className="gr-mono" style={{ color: "var(--clay)" }}>
                · Anti-inflammatory
              </span>
            </div>
            <div className="grid gap-4 items-center" style={{ gridTemplateColumns: "auto 1fr" }}>
              <JarSVG
                genus="Curcuma"
                species="longa"
                commonName="TURMERIC"
                className="w-20"
                style={{ color: "var(--ink)" }}
              />
              <div>
                <h3
                  className="text-xl leading-tight mb-0.5"
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontWeight: 500,
                    color: "var(--ink)",
                  }}
                >
                  Turmeric <em style={{ color: "var(--moss)", fontStyle: "italic" }}>Root</em>
                </h3>
                <p
                  className="text-sm mb-2"
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontStyle: "italic",
                    color: "var(--bark)",
                  }}
                >
                  Curcuma longa
                </p>
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: 20,
                    fontWeight: 500,
                    color: "var(--ink)",
                  }}
                >
                  ৳120
                </span>
              </div>
            </div>
          </article>

          {/* Paper-clip note */}
          <div className="mt-6 md:mt-7">
            <PaperClipNote />
          </div>
        </div>
      </div>
    </section>
  );
}
