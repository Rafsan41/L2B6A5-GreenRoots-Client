import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy — GreenRoots",
  description: "How GreenRoots collects, uses, and protects your personal information.",
}

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: [
      "When you create an account or place an order, we collect your name, email address, delivery address, and phone number.",
      "We automatically collect certain technical information such as your IP address, browser type, and pages visited to help us improve our service.",
      "Payment information is processed entirely by our secure payment partners. GreenRoots never stores full card numbers or CVV codes on our servers.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "To process and fulfil your orders, send shipping confirmations, and provide customer support.",
      "To personalise your browsing experience and recommend products based on your interests.",
      "To send occasional emails about new herbs, seasonal offers, and updates — you may unsubscribe at any time.",
      "To detect and prevent fraud, abuse, and other harmful activity on our platform.",
    ],
  },
  {
    title: "3. Sharing Your Information",
    body: [
      "We never sell, rent, or trade your personal data to third parties for marketing purposes.",
      "We share your delivery address and contact details with our logistics partners solely to fulfil your order.",
      "We may disclose information if required by law, court order, or to protect the rights and safety of GreenRoots or others.",
    ],
  },
  {
    title: "4. Cookies & Tracking",
    body: [
      "GreenRoots uses cookies to keep you signed in, remember your cart, and understand how our site is used.",
      "We use analytics tools (such as anonymised page-view data) to improve our website. No personally identifiable data is shared with analytics providers.",
      "You may disable cookies in your browser settings at any time. Note that some features (such as the cart and login) require cookies to function.",
    ],
  },
  {
    title: "5. Data Retention",
    body: [
      "We retain your account data for as long as your account is active or as needed to provide services.",
      "Order records are retained for seven years to comply with financial regulations.",
      "You may request deletion of your account and associated personal data by contacting us at hello@greenroots.com.bd.",
    ],
  },
  {
    title: "6. Your Rights",
    body: [
      "You have the right to access, correct, or delete your personal data at any time by visiting your profile page or contacting us.",
      "You may opt out of marketing emails using the unsubscribe link included in every email we send.",
      "If you believe your data has been mishandled, you have the right to lodge a complaint with the relevant data-protection authority.",
    ],
  },
  {
    title: "7. Security",
    body: [
      "We use industry-standard encryption (TLS/HTTPS) to protect data in transit.",
      "Access to personal data within our team is restricted to personnel who need it to perform their job functions.",
      "While we take reasonable precautions, no method of internet transmission is 100 % secure. We encourage you to use a strong, unique password for your account.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. When we do, we will revise the 'Last updated' date at the top of this page.",
      "Continued use of GreenRoots after changes are posted constitutes acceptance of the updated policy.",
      "For significant changes, we will notify you by email or by placing a prominent notice on our website.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div
        className="border-b"
        style={{
          background: "var(--parchment)",
          padding: "clamp(48px, 7vw, 96px) 0 clamp(32px, 4vw, 56px)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono, monospace)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--clay)",
              marginBottom: 16,
            }}
          >
            Legal · Privacy
          </p>
          <h1
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 500,
              fontSize: "clamp(36px, 5vw, 56px)",
              lineHeight: 1.05,
              color: "var(--ink)",
              marginBottom: 16,
            }}
          >
            Privacy Policy
          </h1>
          <p style={{ color: "var(--bark)", fontSize: 14 }}>
            Last updated: <strong>January 2025</strong>
          </p>
          <p
            className="mt-4 max-w-xl"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle: "italic",
              fontSize: 18,
              lineHeight: 1.6,
              color: "var(--bark-2)",
            }}
          >
            At GreenRoots, your privacy is as important to us as the purity of our herbs. Here is exactly how we handle your data.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 600,
                fontSize: 22,
                color: "var(--ink)",
              }}
            >
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.body.map((para, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm leading-relaxed"
                  style={{ color: "var(--bark-2)" }}
                >
                  <span style={{ color: "var(--clay)", flexShrink: 0, marginTop: 2 }}>✦</span>
                  <span>{para}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Contact */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--parchment)", border: "1px solid var(--rule)" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 600,
              fontSize: 20,
              color: "var(--ink)",
              marginBottom: 8,
            }}
          >
            Questions about your privacy?
          </h2>
          <p className="text-sm" style={{ color: "var(--bark-2)" }}>
            Email us at{" "}
            <a
              href="mailto:hello@greenroots.com.bd"
              style={{ color: "var(--moss)", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              hello@greenroots.com.bd
            </a>{" "}
            or visit our{" "}
            <Link
              href="/contact"
              style={{ color: "var(--moss)", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              contact page
            </Link>
            . We aim to respond within 2 business days.
          </p>
        </div>

        <p className="text-xs text-center" style={{ color: "var(--bark)" }}>
          See also:{" "}
          <Link href="/terms" style={{ color: "var(--moss)", textDecoration: "underline", textUnderlineOffset: 3 }}>
            Terms of Service
          </Link>
        </p>
      </div>
    </main>
  )
}
