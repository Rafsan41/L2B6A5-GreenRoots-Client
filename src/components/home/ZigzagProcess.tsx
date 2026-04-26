import { SideVineSVG } from "@/components/icons/botanical";

const STEPS = [
  {
    num: "I",
    title: "Browse the",
    titleEm: "shelves",
    desc: "Search by ailment, herb, or benefit. Every listing shows batch date, origin farm and the herbalist who curated it.",
    time: "~ five minutes",
    side: "left",
  },
  {
    num: "II",
    title: "Fill your",
    titleEm: "basket",
    desc: "Choose dose and quantity. We highlight complementary herb pairings already in your basket before you check out.",
    time: "~ two minutes",
    side: "right",
  },
  {
    num: "III",
    title: "Confirm the",
    titleEm: "order",
    desc: "Address, phone, delivery window. Cash on delivery is the default — no subscriptions, no hidden fees.",
    time: "~ one minute",
    side: "left",
  },
  {
    num: "IV",
    title: "Receive at your",
    titleEm: "door",
    desc: "A sealed, herbalist-signed parcel arrives. Track in real time, pay on delivery, rate from your doorstep.",
    time: "< two hours",
    side: "right",
  },
] as const;

export function ZigzagProcess() {
  return (
    <section
      className="relative overflow-hidden border-b"
      style={{
        padding: "clamp(60px, 8vw, 120px) 0",
        borderColor: "var(--rule)",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* Decorative side vine */}
      <SideVineSVG
        className="absolute pointer-events-none hidden lg:block"
        style={{
          top: 60,
          right: -60,
          width: 300,
          height: 440,
          color: "var(--moss-mid)",
          opacity: 0.45,
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <span className="gr-index inline-block mb-4">❦ Chapter IV · The Method</span>
          <h2
            className="mx-auto"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 500,
              fontSize: "clamp(36px, 5.5vw, 80px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              maxWidth: 800,
            }}
          >
            Four steps,{" "}
            <em style={{ color: "var(--moss)", fontStyle: "italic" }}>two hours,</em>
            <br />no fuss.
          </h2>
        </div>

        {/* Mobile: vertical stacked list */}
        <div className="flex flex-col gap-8 md:hidden">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex gap-5 items-start">
              {/* Step node */}
              <div
                className="flex-none flex items-center justify-center"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--parchment)",
                  boxShadow: `0 0 0 1px var(--moss), 0 0 0 5px var(--parchment), 0 0 0 6px var(--sage)`,
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "var(--moss)",
                  flexShrink: 0,
                }}
              >
                {step.num}
              </div>
              <div className="pt-1">
                <h3
                  className="leading-none mb-2"
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontWeight: 500,
                    fontSize: 26,
                    color: "var(--ink)",
                  }}
                >
                  {step.title}{" "}
                  <em style={{ color: "var(--moss)", fontStyle: "italic" }}>{step.titleEm}</em>
                </h3>
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--bark)", lineHeight: 1.6 }}
                >
                  {step.desc}
                </p>
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontStyle: "italic",
                    fontSize: 14,
                    color: "var(--clay)",
                  }}
                >
                  {step.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: zigzag layout */}
        <div
          className="relative mx-auto hidden md:block"
          style={{ maxWidth: 960, padding: "24px 0" }}
        >
          {/* Center spine line */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: "50%",
              width: 1,
              background: "var(--rule)",
              transform: "translateX(-0.5px)",
            }}
          />

          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="grid items-center mb-12 last:mb-0 relative"
              style={{ gridTemplateColumns: "1fr auto 1fr" }}
            >
              {/* Left content */}
              <div
                style={
                  step.side === "left"
                    ? { gridColumn: 1, textAlign: "right", paddingRight: 48 }
                    : { gridColumn: 1 }
                }
              >
                {step.side === "left" && (
                  <StepContent step={step} align="right" />
                )}
              </div>

              {/* Center node */}
              <div
                className="flex items-center justify-center relative"
                style={{
                  gridColumn: 2,
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "var(--parchment)",
                  boxShadow: `0 0 0 1px var(--moss), 0 0 0 6px var(--parchment), 0 0 0 7px var(--sage)`,
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 28,
                  fontWeight: 500,
                  color: "var(--moss)",
                  zIndex: 2,
                }}
              >
                {step.num}
                {/* Clover above node */}
                <span
                  className="absolute"
                  style={{ top: -22, left: "50%", transform: "translateX(-50%)", color: "var(--clay)", fontSize: 12 }}
                >
                  ☘
                </span>
              </div>

              {/* Right content */}
              <div
                style={
                  step.side === "right"
                    ? { gridColumn: 3, paddingLeft: 48 }
                    : { gridColumn: 3 }
                }
              >
                {step.side === "right" && (
                  <StepContent step={step} align="left" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepContent({
  step,
  align,
}: {
  step: (typeof STEPS)[number];
  align: "left" | "right";
}) {
  return (
    <div style={{ textAlign: align }}>
      <h3
        className="leading-none mb-2.5"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontWeight: 500,
          fontSize: 32,
          color: "var(--ink)",
        }}
      >
        {step.title}{" "}
        <em style={{ color: "var(--moss)", fontStyle: "italic" }}>{step.titleEm}</em>
      </h3>
      <p
        className="text-sm mb-2 mx-auto"
        style={{
          color: "var(--bark)",
          lineHeight: 1.6,
          maxWidth: 360,
          marginLeft: align === "right" ? 0 : "auto",
          marginRight: align === "left" ? 0 : "auto",
        }}
      >
        {step.desc}
      </p>
      <span
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontStyle: "italic",
          fontSize: 14,
          color: "var(--clay)",
        }}
      >
        {step.time}
      </span>
    </div>
  );
}
