"use client";

import { useState } from "react";

export function HerbLetter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section
      className="border-b"
      style={{
        padding: "clamp(48px, 6vw, 80px) 0",
        borderColor: "var(--rule)",
        background: "var(--sage)",
        position: "relative",
        zIndex: 2,
        overflow: "hidden",
      }}
    >
      {/* Subtle leaf pattern background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 200"
        fill="none"
        stroke="currentColor"
        strokeWidth={0.4}
        preserveAspectRatio="xMidYMid slice"
        style={{ color: "var(--moss)", opacity: 0.15 }}
        aria-hidden="true"
      >
        <ellipse cx="120"  cy="60"  rx="10" ry="20" transform="rotate(25 120 60)"  />
        <ellipse cx="380"  cy="140" rx="8"  ry="16" transform="rotate(-35 380 140)" />
        <ellipse cx="720"  cy="40"  rx="12" ry="24" transform="rotate(15 720 40)"  />
        <ellipse cx="1000" cy="160" rx="9"  ry="18" transform="rotate(-20 1000 160)" />
        <ellipse cx="1300" cy="80"  rx="10" ry="20" transform="rotate(30 1300 80)"  />
      </svg>

      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="text-3xl mb-4" aria-hidden="true">🌿</div>

          <span className="gr-index inline-block mb-3" style={{ color: "var(--moss)" }}>
            The Herb Letter
          </span>

          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 500,
              fontSize: "clamp(32px, 4.5vw, 60px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
            }}
          >
            Join{" "}
            <em style={{ color: "var(--moss)", fontStyle: "italic" }}>10,000+</em>{" "}
            herb lovers.
          </h2>

          <p
            className="mb-8 mx-auto"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(16px, 2vw, 19px)",
              lineHeight: 1.6,
              color: "var(--bark)",
              maxWidth: 480,
            }}
          >
            Monthly seasonal guide, new herb arrivals, home remedy tips and
            early access to limited harvests — straight to your inbox.
          </p>

          {submitted ? (
            <div
              className="inline-flex items-center gap-3 px-6 md:px-8 py-4 rounded-full"
              style={{
                background: "var(--moss-deep)",
                color: "var(--clay-soft)",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontStyle: "italic",
                fontSize: 20,
              }}
            >
              ☘ Welcome to the herb family!
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 min-w-0 rounded-full px-5 py-3 text-sm outline-none w-full"
                style={{
                  background: "var(--parchment)",
                  border: "1px solid var(--rule)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
                }}
              />
              <button
                type="submit"
                className="rounded-full px-6 py-3 text-sm font-medium transition-colors shrink-0 w-full sm:w-auto"
                style={{
                  background: "var(--moss-deep)",
                  color: "var(--parchment)",
                  border: 0,
                  cursor: "pointer",
                  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
                }}
              >
                Subscribe →
              </button>
            </form>
          )}

          <p
            className="mt-4 text-xs"
            style={{ color: "var(--bark)", fontFamily: "var(--font-jetbrains-mono), monospace", letterSpacing: "0.1em" }}
          >
            No spam. Unsubscribe anytime. We respect your inbox.
          </p>
        </div>
      </div>
    </section>
  );
}
