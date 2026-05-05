const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "I ordered ashwagandha and turmeric late at night and both were at my door by sunrise — sealed, signed, and smelling like my grandmother's kitchen. GreenRoots has become my go-to herbal store, and I'm a genuine sceptic.",
    emphasis: ["ashwagandha and turmeric", "genuine"],
    name: "Rafsan Ahmed",
    location: "Dhaka",
    orders: 18,
    rating: 5,
    accent: false,
    large: true,
  },
  {
    id: 2,
    quote:
      "Found chamomile and ashwagandha under one roof. The category filters make it very easy to find exactly what I need.",
    name: "Sarah Rahman",
    location: "Chittagong",
    rating: 5,
    accent: false,
    large: false,
  },
  {
    id: 3,
    quote:
      "Real-time tracking, genuine herbs, cash on delivery. The packaging feels as artisan as the products inside.",
    name: "Karim Hossain",
    location: "Sylhet",
    rating: 4,
    accent: true,
    large: false,
  },
  {
    id: 4,
    quote:
      "Finally a herbal store that respects the roots my mother swears by alongside modern wellness science.",
    name: "Nusrat K.",
    location: "Dhaka",
    rating: 5,
    accent: false,
    large: false,
  },
];

function Stars({ count, onDark = false }: { count: number; onDark?: boolean }) {
  return (
    <div style={{ color: onDark ? "var(--honey)" : "var(--honey-deep)", letterSpacing: 3 }}>
      {"✦".repeat(count)}
      {count < 5 && (
        <span style={{ opacity: 0.28 }}>{"✦".repeat(5 - count)}</span>
      )}
    </div>
  );
}

export function MagazineTestimonials() {
  const lead = TESTIMONIALS[0];
  const supporting = TESTIMONIALS.slice(1);

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
        <div
          className="flex flex-col gap-10 lg:grid lg:gap-14 items-start"
          style={{ gridTemplateColumns: "1.15fr 0.85fr" }}
        >
          {/* ── Big pull quote ──────────────────────────── */}
          <div className="relative">
            {/* Decorative quote mark */}
            <div
              className="absolute pointer-events-none hidden sm:block"
              style={{
                top: 80,
                right: 20,
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: 200,
                lineHeight: 1,
                color: "var(--moss-soft)",
                opacity: 0.35,
                zIndex: 0,
              }}
              aria-hidden="true"
            >
              ❝
            </div>

            <div className="relative z-10">
              <span className="gr-index mb-4">❦ Chapter VI · Letters</span>
              <h2
                className="mb-8 md:mb-12"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontWeight: 500,
                  fontSize: "clamp(36px, 5.5vw, 80px)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                }}
              >
                From the{" "}
                <em style={{ color: "var(--moss)", fontStyle: "italic" }}>customers.</em>
              </h2>

              <Stars count={lead.rating} onDark={false} />

              <blockquote
                className="mt-5 mb-7 md:mb-9"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "clamp(18px, 3vw, 36px)",
                  lineHeight: 1.25,
                  color: "var(--ink)",
                  fontWeight: 400,
                }}
              >
                &ldquo;{lead.quote}&rdquo;
              </blockquote>

              <div
                className="flex items-center gap-4 pt-6"
                style={{ borderTop: "1px solid var(--rule)" }}
              >
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "var(--moss)",
                    color: "oklch(0.96 0.02 90)",
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontStyle: "italic",
                    fontSize: 24,
                  }}
                >
                  {lead.name[0]}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontStyle: "italic",
                      fontSize: 22,
                      color: "var(--ink)",
                    }}
                  >
                    {lead.name}
                  </div>
                  <div
                    className="gr-mono mt-0.5"
                    style={{ color: "var(--bark)" }}
                  >
                    {lead.location} · Customer since 2024 · {lead.orders} orders
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Supporting quotes ───────────────────────── */}
          <div className="flex flex-col gap-4">
            {supporting.map((t) => (
              <article
                key={t.id}
                className="rounded-2xl p-5 md:p-6"
                style={{
                  background: t.accent
                    ? "oklch(from var(--cta) l c h / 0.12)"
                    : "var(--card-surface)",
                  border: `1px solid ${
                    t.accent
                      ? "oklch(from var(--cta) l c h / 0.35)"
                      : "var(--card-border-color)"
                  }`,
                  boxShadow: t.accent
                    ? "3px 3px 0 oklch(from var(--cta) l c h / 0.20)"
                    : "var(--card-box-shadow)",
                }}
              >
                <Stars count={t.rating} onDark={false} />
                <p
                  className="mt-2.5 mb-3.5"
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: 18,
                    lineHeight: 1.4,
                    color: "var(--card-name-primary)",
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div
                  className="flex justify-between items-baseline pt-3"
                  style={{ borderTop: "1px dashed var(--card-divider)" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontStyle: "italic",
                      fontSize: 16,
                      color: "var(--card-name-primary)",
                    }}
                  >
                    — {t.name}
                  </span>
                  <span className="gr-mono" style={{ color: "var(--card-subtitle)" }}>
                    {t.location}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
