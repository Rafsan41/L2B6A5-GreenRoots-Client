"use client"

import { useState } from "react"

const FAQS = [
  {
    q: "How do you ensure herb potency?",
    a: "Every batch is tested by third-party laboratories for active compound concentration, heavy metals, and microbial contamination. Certificates of Analysis (CoA) are available on every product page.",
  },
  {
    q: "Are your products safe during pregnancy?",
    a: "Some botanicals are contraindicated during pregnancy. We mark all such products clearly and recommend consulting our certified herbalists or your physician before starting any new regimen.",
  },
  {
    q: "Where do you source your herbs from?",
    a: "We partner directly with small-scale farms across Bangladesh, India, and Sri Lanka. We pay above fair-trade rates and conduct annual farm visits to ensure ethical and sustainable harvesting.",
  },
  {
    q: "How quickly will my order arrive?",
    a: "Orders within Dhaka are delivered within 2 hours. Nationwide delivery takes 1–3 business days via our cold-chain courier partners to preserve potency.",
  },
  {
    q: "Do you offer bulk or wholesale pricing?",
    a: "Yes — we have a practitioner programme and wholesale tiers for clinics, wellness centres, and retail partners. Contact hello@greenroots.com.bd to apply.",
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      className="relative z-10"
      style={{
        background: "var(--parchment)",
        padding:    "clamp(48px, 6vw, 90px) 0",
        borderTop:  "1px solid var(--rule)",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10">

        {/* Heading */}
        <div className="text-center mb-12">
          <span
            className="gr-mono mb-3 inline-block"
            style={{
              background:    "oklch(0.83 0.17 89 / 0.14)",
              color:         "var(--honey-deep)",
              border:        "1px solid oklch(0.83 0.17 89 / 0.38)",
              borderRadius:  9999,
              padding:       "4px 14px",
              fontSize:      10,
              letterSpacing: "0.14em",
            }}
          >
            ✦ QUESTIONS FROM THE GARDEN
          </span>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize:   "clamp(28px, 3.5vw, 44px)",
              fontWeight: 500,
              color:      "var(--ink)",
              lineHeight: 1.1,
              marginTop:  8,
            }}
          >
            Common Questions
          </h2>
        </div>

        {/* FAQ list */}
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                background:   "var(--cream)",
                border:       open === i
                  ? "1px solid oklch(0.52 0.08 140 / 0.5)"
                  : "1px solid var(--rule)",
                boxShadow:    open === i
                  ? "0 4px 20px oklch(0.58 0.06 130 / 0.10)"
                  : "none",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center px-6 py-5 text-left"
              >
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize:   18,
                    fontWeight: 500,
                    color:      "var(--ink)",
                  }}
                >
                  {faq.q}
                </span>
                <span
                  className="shrink-0 ml-4 transition-transform duration-300"
                  style={{
                    color:     "var(--moss)",
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                    fontSize:  22,
                  }}
                >
                  +
                </span>
              </button>

              {open === i && (
                <div
                  className="px-6 pb-5"
                  style={{
                    fontSize:   15,
                    lineHeight: 1.7,
                    color:      "var(--bark)",
                    borderTop:  "1px solid var(--rule)",
                    paddingTop: 16,
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
