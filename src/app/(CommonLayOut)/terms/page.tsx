import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service — GreenRoots",
  description: "The terms and conditions governing your use of GreenRoots.",
}

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using GreenRoots, you agree to be bound by these Terms of Service and our Privacy Policy.",
      "If you do not agree with any part of these terms, please do not use our website or services.",
      "These terms apply to all visitors, customers, and registered users of GreenRoots.",
    ],
  },
  {
    title: "2. Products & Services",
    body: [
      "GreenRoots sells herbal and botanical products intended for personal wellness use only.",
      "All product descriptions, ingredient lists, and usage guidance are provided for informational purposes and do not constitute medical advice.",
      "We reserve the right to modify, discontinue, or limit the availability of any product at any time without notice.",
      "Product images are representative. Colour and appearance may vary slightly due to natural variation in plant materials.",
    ],
  },
  {
    title: "3. Accounts & Registration",
    body: [
      "You must be at least 18 years of age to create an account and place orders.",
      "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
      "Please notify us immediately at hello@greenroots.com.bd if you suspect unauthorised access to your account.",
      "We reserve the right to suspend or terminate accounts that violate these terms.",
    ],
  },
  {
    title: "4. Ordering & Payment",
    body: [
      "Placing an order constitutes an offer to purchase the selected products at the stated price.",
      "We reserve the right to refuse or cancel any order, including after confirmation, if we suspect fraud, errors in pricing, or stock issues.",
      "All prices are listed in Bangladeshi Taka (BDT) and include applicable taxes unless stated otherwise.",
      "Payment must be completed at checkout. We do not accept payment on delivery for online orders.",
    ],
  },
  {
    title: "5. Shipping & Delivery",
    body: [
      "Estimated delivery times are indicative. GreenRoots is not responsible for delays caused by third-party couriers or force majeure events.",
      "Risk of loss and title for products pass to you upon delivery.",
      "If your order has not arrived within the estimated delivery window, please contact us within 14 days of the expected delivery date.",
    ],
  },
  {
    title: "6. Returns & Refunds",
    body: [
      "Orders may be cancelled within 1 hour of placement for a full refund.",
      "For perishable or consumable herbal products, returns are accepted only if the product arrives damaged or defective.",
      "To initiate a return, email hello@greenroots.com.bd with your order number and photos of the issue within 48 hours of delivery.",
      "Approved refunds are processed within 5–7 business days to the original payment method.",
    ],
  },
  {
    title: "7. Intellectual Property",
    body: [
      "All content on this website — including text, images, logos, and design — is the property of GreenRoots or its licensors.",
      "You may not reproduce, distribute, or create derivative works without our express written permission.",
      "User-submitted reviews and content remain your property. By submitting, you grant GreenRoots a non-exclusive licence to display this content on our platform.",
    ],
  },
  {
    title: "8. Prohibited Uses",
    body: [
      "You may not use GreenRoots for any unlawful purpose or in violation of these terms.",
      "Reselling our products without prior written authorisation is strictly prohibited.",
      "Attempting to scrape, reverse-engineer, or interfere with our platform or systems is prohibited.",
      "Posting false, misleading, or defamatory reviews is a violation of these terms and may result in account suspension.",
    ],
  },
  {
    title: "9. Disclaimer of Warranties",
    body: [
      "GreenRoots products are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before starting any herbal supplement.",
      "Our website and services are provided 'as is' without warranties of any kind, express or implied.",
      "We do not warrant that the website will be uninterrupted, error-free, or free of harmful components.",
    ],
  },
  {
    title: "10. Changes to These Terms",
    body: [
      "We may update these Terms of Service at any time. The 'Last updated' date at the top of this page reflects the most recent revision.",
      "Continued use of GreenRoots after changes are posted constitutes your acceptance of the revised terms.",
      "For material changes, we will notify registered users by email.",
    ],
  },
]

export default function TermsPage() {
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
            Legal · Terms
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
            Terms of Service
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
            Please read these terms carefully before using GreenRoots. They explain your rights and responsibilities as a customer.
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
            Questions about these terms?
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
            .
          </p>
        </div>

        <p className="text-xs text-center" style={{ color: "var(--bark)" }}>
          See also:{" "}
          <Link href="/privacy" style={{ color: "var(--moss)", textDecoration: "underline", textUnderlineOffset: 3 }}>
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  )
}
