const STEPS = [
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-full h-full">
        <path d="M32 10 C 32 10, 20 22, 20 34 C 20 44, 25 50, 32 50 C 39 50, 44 44, 44 34 C 44 22, 32 10, 32 10 Z" />
        <path d="M32 50 L 32 58" />
        <path d="M26 54 C 21 54, 18 57, 18 60" />
        <path d="M38 54 C 43 54, 46 57, 46 60" />
        <ellipse cx="20" cy="30" rx="8" ry="4" transform="rotate(-25 20 30)" />
        <ellipse cx="44" cy="30" rx="8" ry="4" transform="rotate(25 44 30)" />
      </svg>
    ),
    number: "01",
    title: "Sourced",
    titleEm: "from the field",
    desc: "Every herb is traceable to a named farm or forest. We work directly with small-scale growers across Bangladesh and the subcontinent.",
    tag: "Single-origin",
    tagColor: "var(--moss)",
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-full h-full">
        <rect x="16" y="20" width="32" height="28" rx="3" />
        <path d="M22 20 L 22 14 Q 22 10 26 10 L 38 10 Q 42 10 42 14 L 42 20" />
        <line x1="24" y1="32" x2="40" y2="32" />
        <line x1="24" y1="38" x2="34" y2="38" />
        <circle cx="46" cy="44" r="10" fill="var(--clay-soft)" stroke="var(--clay)" />
        <path d="M42 44 L 45 47 L 50 41" stroke="var(--clay)" strokeWidth={1.5} />
      </svg>
    ),
    number: "02",
    title: "Dried &",
    titleEm: "processed",
    desc: "Slow-dried at low temperature to preserve active compounds. Each batch is tested and signed off by our in-house herbalist before packing.",
    tag: "Herbalist-verified",
    tagColor: "var(--clay)",
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-full h-full">
        <rect x="18" y="28" width="28" height="26" rx="2" />
        <path d="M22 28 L 22 24 L 42 24 L 42 28" />
        <rect x="26" y="36" width="12" height="10" rx="1" fill="var(--parchment)" strokeWidth={0.6} />
        <text x="32" y="43" textAnchor="middle" fontSize={5} fontFamily="serif" fill="var(--bark)" stroke="none">HERB</text>
        <path d="M36 18 Q 44 10 50 14" strokeWidth={0.8} />
        <circle cx="50" cy="14" r="3" fill="var(--clay-soft)" />
      </svg>
    ),
    number: "03",
    title: "Packed &",
    titleEm: "dispatched",
    desc: "Sealed in airtight kraft paper with a handwritten batch card. Dispatched from our Dhaka store within two hours of your order.",
    tag: "< 2 hr dispatch",
    tagColor: "var(--rust)",
  },
];

export function FieldToJar() {
  return (
    <section
      className="border-b"
      style={{
        padding: "clamp(60px, 8vw, 110px) 0",
        borderColor: "var(--rule)",
        background: "var(--cream)",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="gr-index inline-block mb-4">❦ Chapter V · Transparency</span>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 500,
              fontSize: "clamp(36px, 5.5vw, 80px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
            }}
          >
            From{" "}
            <em style={{ color: "var(--moss)", fontStyle: "italic" }}>field</em>{" "}
            to jar.
          </h2>
          <p
            className="mx-auto mt-5 text-lg"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle: "italic",
              color: "var(--bark)",
              maxWidth: 520,
              lineHeight: 1.6,
            }}
          >
            We believe you deserve to know exactly where your herbs come from —
            and how they get to you.
          </p>
        </div>

        {/* 3-col timeline */}
        <div className="relative">
          {/* Connecting amber line */}
          <div
            className="absolute hidden lg:block"
            style={{
              top: 56,
              left: "16.6%",
              right: "16.6%",
              height: 1,
              background: "var(--clay)",
              opacity: 0.35,
            }}
          />

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                {/* Icon circle */}
                <div
                  className="relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center mb-6 z-10"
                  style={{
                    background: "var(--parchment)",
                    border: "1px solid var(--rule)",
                    padding: 20,
                    color: "var(--moss)",
                    boxShadow: "0 0 0 6px var(--cream), 0 0 0 7px var(--rule)",
                  }}
                >
                  {step.icon}
                  {/* Step number */}
                  <span
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{
                      background: "var(--clay)",
                      color: "var(--parchment)",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 9,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3
                  className="leading-none mb-3"
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontWeight: 500,
                    fontSize: 28,
                    color: "var(--ink)",
                  }}
                >
                  {step.title}{" "}
                  <em style={{ color: "var(--moss)", fontStyle: "italic" }}>{step.titleEm}</em>
                </h3>

                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "var(--bark)", maxWidth: 300 }}
                >
                  {step.desc}
                </p>

                {/* Tag */}
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs"
                  style={{
                    border: `1px solid ${step.tagColor}`,
                    color: step.tagColor,
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {step.tag}
                </span>

                {/* Arrow connector (hidden on last) */}
                {i < STEPS.length - 1 && (
                  <span
                    className="hidden lg:block absolute"
                    style={{
                      top: 52,
                      right: -16,
                      fontSize: 18,
                      color: "var(--clay)",
                      opacity: 0.6,
                    }}
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Honey/organic trust badges */}
        <div
          className="flex flex-wrap justify-center gap-3 md:gap-4 mt-12 md:mt-16 pt-10 md:pt-12"
          style={{ borderTop: "1px solid var(--rule)" }}
        >
          {[
            { icon: "🌿", label: "100% Natural Ingredients" },
            { icon: "🏡", label: "Small-Batch Harvested" },
            { icon: "📦", label: "Plastic-Free Packaging" },
            { icon: "🤝", label: "Direct from Growers" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: "var(--parchment)",
                border: "1px solid var(--honey)",
                color: "var(--bark)",
              }}
            >
              <span>{icon}</span>
              <span
                className="gr-mono"
                style={{ color: "var(--bark)", fontSize: 9 }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
