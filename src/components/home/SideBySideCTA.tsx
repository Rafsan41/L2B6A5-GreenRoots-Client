import Link from "next/link";
import { BotanicalSVG } from "@/components/icons/botanical";

export function SideBySideCTA() {
  return (
    <section
      className="flex flex-col lg:grid border-b"
      style={{
        gridTemplateColumns: "1fr 1.2fr",
        minHeight: "clamp(400px, 50vw, 640px)",
        borderColor: "var(--rule)",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* ── LEFT: botanical illustration panel ──────────────── */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          background: "var(--clay-soft)",
          minHeight: "clamp(200px, 30vw, 400px)",
        }}
      >
        <BotanicalSVG
          className="w-3/5 md:w-4/5 h-auto animate-sway"
          style={{ color: "var(--rust)", opacity: 0.55 }}
          aria-hidden="true"
        />
      </div>

      {/* ── RIGHT: dark moss CTA panel ──────────────────────── */}
      <div
        className="flex items-center"
        style={{
          background: "var(--moss-deep)",
          color: "var(--cream)",
          padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 80px) clamp(40px, 6vw, 80px) clamp(20px, 4vw, 64px)",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <div
            className="gr-mono on-dark mb-6"
            style={{ fontSize: 11 }}
          >
            ☘ ☘ ☘ &nbsp; Welcome offer
          </div>

          <h2
            className="mb-6 md:mb-8"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 500,
              fontSize: "clamp(44px, 7vw, 96px)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: "var(--parchment)",
            }}
          >
            Your first<br />
            <em style={{ color: "var(--clay-soft)", fontStyle: "italic" }}>order</em><br />
            ships <em style={{ color: "var(--clay-soft)", fontStyle: "italic" }}>free.</em>
          </h2>

          <p
            className="mb-7 md:mb-9"
            style={{
              fontSize: "clamp(15px, 2vw, 17px)",
              lineHeight: 1.6,
              color: "oklch(0.82 0.04 90)",
              maxWidth: 460,
            }}
          >
            A small welcome gift — dried mint and chamomile — tucked in with
            your first order, plus free delivery anywhere in Dhaka. No
            subscription required, ever.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-10 md:mb-12">
            <Link
              href="/register"
              className="inline-flex items-center gap-3 rounded-full px-6 md:px-7 py-3 md:py-4 text-sm font-medium transition-colors"
              style={{
                background: "var(--parchment)",
                color: "var(--moss-deep)",
              }}
            >
              Create an account <span>→</span>
            </Link>
            <Link
              href="/medicines"
              className="px-4 py-3 md:py-4 text-sm font-medium"
              style={{ background: "transparent", border: 0, color: "oklch(0.85 0.04 90)" }}
            >
              <span style={{ borderBottom: "1px solid currentColor", paddingBottom: 2 }}>
                Browse as a guest
              </span>
            </Link>
          </div>

          {/* Trust checks */}
          <div
            className="flex flex-col gap-2.5 pt-7"
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
                  fontStyle: "italic",
                  fontSize: "clamp(15px, 1.8vw, 17px)",
                  color: "oklch(0.85 0.04 90)",
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
  );
}
