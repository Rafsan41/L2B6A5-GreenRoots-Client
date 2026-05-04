import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "The Herb Journal — GreenRoots",
  description: "Insights, guides, and stories from the world of herbal wellness.",
}

const POSTS = [
  {
    slug:     "adaptogens-stress-guide",
    category: "Wellness",
    date:     "April 12, 2025",
    readTime: "6 min read",
    title:    "Adaptogens 101: How Herbs Help Your Body Handle Stress",
    excerpt:  "Ashwagandha, Rhodiola, and Holy Basil have been used for centuries to build resilience. Here's the science behind why they work — and how to use them safely.",
    image:    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
    featured: true,
  },
  {
    slug:     "turmeric-golden-milk",
    category: "Recipes",
    date:     "March 28, 2025",
    readTime: "4 min read",
    title:    "Golden Milk: The Ancient Anti-Inflammatory Drink Reimagined",
    excerpt:  "Turmeric's active compound curcumin has powerful anti-inflammatory properties. Our herbalists share the best way to make it bioavailable with a simple kitchen trick.",
    image:    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80",
    featured: false,
  },
  {
    slug:     "herb-sourcing-transparency",
    category: "Our Story",
    date:     "March 10, 2025",
    readTime: "5 min read",
    title:    "From Field to Jar: How We Source Our Herbs",
    excerpt:  "Every GreenRoots product starts with a relationship — with farmers, with the land, with traditional knowledge. We pull back the curtain on our sourcing process.",
    image:    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    featured: false,
  },
  {
    slug:     "sleep-herbs-guide",
    category: "Wellness",
    date:     "February 22, 2025",
    readTime: "7 min read",
    title:    "5 Herbs That Actually Help You Sleep Better",
    excerpt:  "Valerian, Passionflower, Lemon Balm, Chamomile, and Ashwagandha — ranked by evidence strength and practical tips on when and how to take each one.",
    image:    "https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?w=800&q=80",
    featured: false,
  },
  {
    slug:     "skin-herbs-beauty",
    category: "Beauty",
    date:     "February 5, 2025",
    readTime: "5 min read",
    title:    "Botanical Beauty: Herbs Your Skin Will Thank You For",
    excerpt:  "Calendula, Neem, Rose Hip, and Gotu Kola have been cornerstones of Ayurvedic skincare for generations. Here's how to incorporate them into your routine.",
    image:    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80",
    featured: false,
  },
  {
    slug:     "digestive-herbs-guide",
    category: "Wellness",
    date:     "January 18, 2025",
    readTime: "6 min read",
    title:    "Gut Feelings: The Best Herbs for Digestive Health",
    excerpt:  "From Ginger to Fennel to Slippery Elm — a practitioner's guide to the herbs most supported by evidence for bloating, indigestion, and gut inflammation.",
    image:    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    featured: false,
  },
]

const CATEGORIES = ["All", "Wellness", "Recipes", "Beauty", "Our Story"]

export default function BlogPage() {
  const featured = POSTS.find((p) => p.featured)!
  const rest     = POSTS.filter((p) => !p.featured)

  return (
    <main className="min-h-screen">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div
        className="border-b"
        style={{
          background: "var(--parchment)",
          padding: "clamp(48px, 7vw, 96px) 0 clamp(32px, 4vw, 56px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10">
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
            The Herb Journal
          </p>
          <h1
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 500,
              fontSize: "clamp(38px, 6vw, 68px)",
              lineHeight: 1.0,
              color: "var(--ink)",
              letterSpacing: "-0.02em",
            }}
          >
            Stories from the <em style={{ color: "var(--moss)", fontStyle: "italic" }}>garden</em>
          </h1>
          <p
            className="mt-4 max-w-lg"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle: "italic",
              fontSize: 18,
              lineHeight: 1.6,
              color: "var(--bark-2)",
            }}
          >
            Guides, recipes, and deep dives into the world of herbal wellness — written by our herbalists.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-12 md:py-16 space-y-14">

        {/* ── Category filter (visual only) ──────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold cursor-default transition-colors ${
                cat === "All"
                  ? "border-[var(--moss)] bg-[var(--moss)] text-white"
                  : "border-[var(--rule)] text-[var(--bark)] hover:border-[var(--moss)] hover:text-[var(--moss)]"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* ── Featured post ─────────────────────────────────────────── */}
        <article className="group grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border lg:grid-cols-2" style={{ borderColor: "var(--rule)" }}>
          <div className="relative h-64 overflow-hidden lg:h-auto">
            <img
              src={featured.image}
              alt={featured.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span
              className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: "var(--moss)" }}
            >
              Featured
            </span>
          </div>
          <div
            className="flex flex-col justify-center p-8 lg:p-10"
            style={{ background: "var(--parchment)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="rounded-full border px-3 py-1 text-xs font-semibold"
                style={{ borderColor: "var(--clay)", color: "var(--clay)" }}
              >
                {featured.category}
              </span>
              <span className="text-xs" style={{ color: "var(--bark)" }}>
                {featured.date} · {featured.readTime}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 500,
                fontSize: "clamp(24px, 3vw, 34px)",
                lineHeight: 1.15,
                color: "var(--ink)",
                marginBottom: 16,
              }}
            >
              {featured.title}
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--bark-2)" }}>
              {featured.excerpt}
            </p>
            <Link
              href={`/blog/${featured.slug}`}
              className="inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--moss)" }}
            >
              Read article →
            </Link>
          </div>
        </article>

        {/* ── Post grid ─────────────────────────────────────────────── */}
        <div>
          <h2
            className="mb-8"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 500,
              fontSize: 28,
              color: "var(--ink)",
            }}
          >
            Recent articles
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-md"
                style={{ borderColor: "var(--rule)" }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col flex-1 p-5" style={{ background: "var(--parchment)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold"
                      style={{ borderColor: "var(--clay)", color: "var(--clay)" }}
                    >
                      {post.category}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--bark)" }}>
                      {post.readTime}
                    </span>
                  </div>
                  <h3
                    className="mb-2 flex-1"
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontWeight: 500,
                      fontSize: 20,
                      lineHeight: 1.25,
                      color: "var(--ink)",
                    }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-xs leading-relaxed mb-4 line-clamp-3" style={{ color: "var(--bark-2)" }}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px]" style={{ color: "var(--bark)" }}>{post.date}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-semibold transition-colors hover:underline"
                      style={{ color: "var(--moss)" }}
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── Newsletter CTA ─────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-8 md:p-12 text-center"
          style={{ background: "var(--parchment)", border: "1px solid var(--rule)" }}
        >
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono, monospace)",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--clay)",
              marginBottom: 12,
            }}
          >
            ❧ The Herb Letter
          </p>
          <h3
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 500,
              fontSize: "clamp(26px, 4vw, 38px)",
              color: "var(--ink)",
              marginBottom: 12,
            }}
          >
            Get new articles in your inbox
          </h3>
          <p className="text-sm max-w-md mx-auto mb-6" style={{ color: "var(--bark-2)" }}>
            Monthly dispatches on herbs, wellness, and seasonal remedies. No spam — unsubscribe anytime.
          </p>
          <Link
            href="/home#newsletter"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--moss)" }}
          >
            Subscribe to the Herb Letter
          </Link>
        </div>
      </div>
    </main>
  )
}
